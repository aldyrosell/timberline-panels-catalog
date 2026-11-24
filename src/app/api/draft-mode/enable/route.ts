import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { sanityClient } from "@/lib/sanity/client";

const token = process.env.SANITY_API_READ_TOKEN;

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token }),
});
