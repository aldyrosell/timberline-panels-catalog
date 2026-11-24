import { createClient } from "next-sanity";
import { draftMode } from "next/headers";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set. Copy .env.example to .env.local.",
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-09-25",
  useCdn: false,
  perspective: "published",
});

// Preview appends invisible edit markers to strings; these fields are parsed or compared
// exactly, so a marker on them fails validation or crashes the hours/country formatters.
const UNMARKED_FIELDS = new Set(["days", "opens", "closes", "addressCountry", "quoteWidth", "alt"]);

type FetchOptions = {
  query: string;
  tags: string[];
};

export async function sanityFetch<T>({ query, tags }: FetchOptions): Promise<T> {
  const { isEnabled: isDraft } = await draftMode();

  if (!isDraft) {
    return sanityClient.fetch<T>(query, {}, { next: { tags } });
  }

  const token = process.env.SANITY_API_READ_TOKEN;

  if (!token) {
    throw new Error(
      "Draft mode is on but SANITY_API_READ_TOKEN is not set, so drafts cannot be read.",
    );
  }

  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;

  if (!studioUrl) {
    throw new Error(
      "Draft mode is on but NEXT_PUBLIC_SANITY_STUDIO_URL is not set, so edit links cannot be built.",
    );
  }

  return sanityClient.fetch<T>(
    query,
    {},
    {
      token,
      perspective: "drafts",
      useCdn: false,
      cache: "no-store",
      stega: {
        enabled: true,
        studioUrl,
        filter: (props) =>
          props.resultPath.some(
            (segment) => typeof segment === "string" && UNMARKED_FIELDS.has(segment),
          )
            ? false
            : props.filterDefault(props),
      },
    },
  );
}
