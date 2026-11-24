import { cache } from "react";

import { sanityFetch } from "./client";
import { HOME_QUERY } from "./queries";
import { homeQuerySchema } from "./schema";
import { siteConstants } from "@/config/site";
import type { SiteConfig } from "@/types/site";

export const CONTENT_TAGS = [
  "siteSettings",
  "homePage",
  "product",
  "application",
  "finish",
  "testimonial",
  "showroom",
] as const;

export const getHomeQuery = cache(async () => {
  const data = await sanityFetch<unknown>({
    query: HOME_QUERY,
    tags: [...CONTENT_TAGS],
  });

  const parsed = homeQuerySchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Content from Sanity does not match what this site expects.\n${JSON.stringify(
        parsed.error.issues.map(({ path, message }) => `${path.join(".")}: ${message}`),
        null,
        2,
      )}`,
    );
  }

  return parsed.data;
});

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const { settings } = await getHomeQuery();

  return {
    ...siteConstants,
    name: settings.name,
    legalName: settings.legalName,
    title: settings.title,
    description: settings.description,
    telephone: settings.telephone,
    email: settings.email,
    address: {
      streetAddress: settings.address.streetAddress ?? undefined,
      addressLocality: settings.address.addressLocality,
      addressRegion: settings.address.addressRegion ?? undefined,
      postalCode: settings.address.postalCode ?? undefined,
      addressCountry: settings.address.addressCountry,
    },
    geo: settings.geo ?? undefined,
    openingHours: settings.openingHours ?? [],
    socials: settings.socials ?? [],
    formEndpoint: settings.formEndpoint ?? "",
    nav: settings.nav,
    ogImageUrl: settings.ogImage?.url ?? "/og.jpg",
  };
});

export const getHomeContent = cache(async () => (await getHomeQuery()).home);

export const getSettings = cache(async () => (await getHomeQuery()).settings);
