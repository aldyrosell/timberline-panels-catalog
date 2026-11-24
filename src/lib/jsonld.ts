import { siteConstants } from "@/config/site";
import type { SiteConfig } from "@/types/site";

export type JsonLdNode = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConstants.url).toString();
}

export function businessSchema(config: SiteConfig): JsonLdNode {
  const address = Object.fromEntries(
    Object.entries(config.address).filter(([, value]) => Boolean(value)),
  );

  return {
    "@context": "https://schema.org",
    "@type": config.schemaType,
    "@id": absoluteUrl("/#business"),
    name: config.name,
    legalName: config.legalName,
    description: config.description,
    url: config.url,
    telephone: config.telephone,
    email: config.email,
    image: config.ogImageUrl.startsWith("http")
      ? config.ogImageUrl
      : absoluteUrl(config.ogImageUrl),
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    ...(config.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: config.geo.latitude,
            longitude: config.geo.longitude,
          },
        }
      : {}),
    openingHoursSpecification: config.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes,
    })),
    ...(config.socials.length > 0
      ? { sameAs: config.socials.map((social) => social.href) }
      : {}),
  };
}

export function websiteSchema(config: SiteConfig): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: config.name,
    url: config.url,
    inLanguage: config.locale,
    publisher: { "@id": absoluteUrl("/#business") },
  };
}
