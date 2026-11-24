import { z } from "zod";

export const TRUST_POINT_ICONS = ["droplet", "layers", "users"] as const;
export const VALUE_PROP_ICONS = ["droplet", "layers", "palette", "truck"] as const;
export const REASON_ICONS = ["gem", "layers", "person", "shield"] as const;
export const STAT_ICONS = ["building", "layers", "trophy", "truck"] as const;
export const TESTIMONIAL_ICONS = ["home", "house", "office", "van"] as const;
export const SOCIAL_ICONS = ["facebook", "instagram", "linkedin", "youtube"] as const;

const text = z.string().min(1);

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const imageSchema = z
  .object({
    url: text,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    lqip: z.string().nullish(),
    alt: z.string(),
    decorative: z.boolean(),
  })
  .refine((image) => image.decorative || image.alt.length > 0, {
    message: "alt text is required unless the image is marked decorative",
    path: ["alt"],
  });

const ctaSchema = z.object({ label: text, href: text });
const navItemSchema = z.object({ label: text, href: text });

const titled = <T extends readonly [string, ...string[]]>(icons: T) =>
  z.object({ title: text, description: text, icon: z.enum(icons) });

export const settingsSchema = z.object({
  name: text,
  legalName: text,
  title: text,
  description: text,
  telephone: text,
  email: text,
  address: z.object({
    streetAddress: z.string().nullish(),
    addressLocality: text,
    addressRegion: z.string().nullish(),
    postalCode: z.string().nullish(),
    addressCountry: text,
  }),
  geo: z.object({ latitude: z.number(), longitude: z.number() }).nullish(),
  openingHours: z
    .array(z.object({ days: z.array(z.enum(WEEKDAYS)).min(1), opens: text, closes: text }))
    .min(1),
  socials: z
    .array(z.object({ label: text, href: text, icon: z.enum(SOCIAL_ICONS) }))
    .nullish(),
  formEndpoint: z.string().nullish(),
  ogImage: imageSchema.nullish(),
  tagline: text,
  headerCta: ctaSchema,
  wordmarkLineOne: text,
  wordmarkLineTwo: text,
  footerLinksTitle: text,
  footerContactTitle: text,
  footerHoursTitle: text,
  closedLabel: text,
  footerSlogan: text,
  newsletterTitle: text,
  newsletterBody: text,
  newsletterPlaceholder: text,
  newsletterSubmitLabel: text,
  newsletterSubmittingLabel: text,
  newsletterSuccess: text,
  newsletterUnconfigured: text,
  newsletterError: text,
  nav: z.array(navItemSchema).min(1),
});

export const homeSchema = z.object({
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
  _updatedAt: text,

  hero: z.object({
    eyebrow: text,
    heading: text,
    body: text,
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    image: imageSchema,
    trustPoints: z
      .array(z.object({ lineOne: text, lineTwo: text, icon: z.enum(TRUST_POINT_ICONS) }))
      .min(1),
  }),

  materialFinder: z.object({
    heading: text,
    fields: z
      .array(z.object({ label: text, placeholder: text, options: z.array(text).min(1) }))
      .min(1),
    submitLabel: text,
  }),

  valueProps: z.object({ items: z.array(titled(VALUE_PROP_ICONS)).min(1) }),

  products: z.object({
    eyebrow: text,
    heading: text,
    link: ctaSchema,
    cardCtaLabel: text,
    items: z.array(z.object({ _id: text, title: text, description: text, image: imageSchema })).min(1),
  }),

  whyChoose: z.object({
    backgroundImage: imageSchema,
    eyebrow: text,
    headingLineOne: text,
    headingLineTwo: text,
    body: text,
    reasons: z.array(titled(REASON_ICONS)).min(1),
  }),

  applications: z.object({
    eyebrow: text,
    heading: text,
    link: ctaSchema,
    items: z.array(z.object({ _id: text, title: text, image: imageSchema })).min(1),
  }),

  collections: z.object({
    eyebrow: text,
    heading: text,
    body: text,
    items: z.array(z.object({ _id: text, name: text, image: imageSchema })).min(1),
    panelImage: imageSchema,
    panelText: text,
  }),

  stats: z.object({
    items: z.array(z.object({ value: text, label: text, icon: z.enum(STAT_ICONS) })).min(1),
  }),

  testimonials: z.object({
    backgroundImage: imageSchema,
    eyebrow: text,
    heading: text,
    link: ctaSchema,
    items: z
      .array(
        z.object({
          _id: text,
          quote: text,
          role: text,
          city: text,
          icon: z.enum(TESTIMONIAL_ICONS),
        }),
      )
      .min(1),
  }),

  howItWorks: z.object({
    eyebrow: text,
    heading: text,
    steps: z.array(z.object({ title: text, description: text })).min(1),
  }),

  showrooms: z.object({
    eyebrow: text,
    heading: text,
    link: ctaSchema,
    items: z
      .array(z.object({ _id: text, name: text, kind: text, hours: text, image: imageSchema }))
      .min(1),
  }),

  closingCta: z.object({
    backgroundImage: imageSchema,
    heading: text,
    body: text,
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    noteLineOne: text,
    noteLineTwo: text,
  }),
});

export const homeQuerySchema = z.object({
  settings: settingsSchema,
  home: homeSchema,
});

export type SanityImage = z.infer<typeof imageSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
export type SiteSettings = z.infer<typeof settingsSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
