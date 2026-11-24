import type { MetadataRoute } from "next";
import { siteConstants } from "@/config/site";

export const dynamic = "force-static";

const buildTime = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConstants.routes.map((route) => ({
    url: new URL(route.path, siteConstants.url).toString(),
    lastModified: route.lastModified ? new Date(route.lastModified) : buildTime,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
