import { ClockIcon } from "@sanity/icons/Clock";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { ImageIcon } from "@sanity/icons/Image";
import { LaunchIcon } from "@sanity/icons/Launch";
import { LinkIcon } from "@sanity/icons/Link";
import { PinIcon } from "@sanity/icons/Pin";
import { ThListIcon } from "@sanity/icons/ThList";
import { defineField, defineType } from "sanity";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe what's in the picture, for people who can't see it.",
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as { decorative?: boolean } | undefined;
          if (parent?.decorative) return true;
          return alt ? true : "Alt text is required unless the image is marked decorative.";
        }),
    }),
    defineField({
      name: "decorative",
      title: "Purely decorative",
      type: "boolean",
      description:
        "Tick for background pictures that show nothing important.",
      initialValue: false,
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Button",
  type: "object",
  icon: LaunchIcon,
  options: { columns: 2 },
  fields: [
    defineField({
      name: "label",
      title: "Button text",
      type: "string",
      description: "What the button says. Describe the destination — never 'Click here'.",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "A page (/contact/), a section (#book) or a full web address.",
      validation: (rule) =>
        rule.required().custom((href) =>
          typeof href === "string" && /^(\/|#|https?:\/\/|tel:|mailto:)/.test(href)
            ? true
            : "Start with /, #, https://, tel: or mailto:",
        ),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

export const navItem = defineType({
  name: "navItem",
  title: "Menu link",
  type: "object",
  icon: LinkIcon,
  options: { columns: 2 },
  fields: [
    defineField({
      name: "label",
      title: "Menu text",
      type: "string",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "A path ending in a slash (/services/) or a section anchor (#services).",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const linkGroup = defineType({
  name: "linkGroup",
  title: "Footer column",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "title",
      title: "Column heading",
      type: "string",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "items",
      title: "Links",
      type: "array",
      of: [{ type: "navItem" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title,
      subtitle: `${Array.isArray(items) ? items.length : 0} links`,
    }),
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social profile",
  type: "object",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "label",
      title: "Network",
      type: "string",
      description: "Facebook, Instagram, LinkedIn, and so on.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Profile address",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "YouTube", value: "youtube" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const postalAddress = defineType({
  name: "postalAddress",
  title: "Address",
  type: "object",
  icon: PinIcon,
  options: { columns: 2 },
  description:
    "Shown on your site and to search engines. Keep it identical everywhere.",
  fields: [
    defineField({ name: "streetAddress", title: "Street", type: "string" }),
    defineField({
      name: "addressLocality",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "addressRegion", title: "State or region", type: "string" }),
    defineField({ name: "postalCode", title: "Postal code", type: "string" }),
    defineField({
      name: "addressCountry",
      title: "Country code",
      type: "string",
      description: "Two letters, such as US or PH.",
      validation: (rule) => rule.required().length(2),
    }),
  ],
});

export const openingHoursSpec = defineType({
  name: "openingHoursSpec",
  title: "Opening hours",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "days",
      title: "Days",
      type: "array",
      of: [{ type: "string" }],
      options: { list: WEEKDAYS, layout: "grid" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "opens",
      title: "Opens",
      type: "string",
      description: "24-hour time, such as 08:00.",
      validation: (rule) => rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "HH:mm" }),
    }),
    defineField({
      name: "closes",
      title: "Closes",
      type: "string",
      description: "24-hour time, such as 18:00.",
      validation: (rule) => rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "HH:mm" }),
    }),
  ],
  preview: {
    select: { days: "days", opens: "opens", closes: "closes" },
    prepare: ({ days, opens, closes }) => ({
      title: Array.isArray(days) ? days.join(", ") : "No days selected",
      subtitle: `${opens ?? "?"} – ${closes ?? "?"}`,
    }),
  },
});

export const richLine = defineType({
  name: "richLine",
  title: "Text",
  type: "array",
  of: [
    {
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [{ title: "Bold", value: "strong" }],
        annotations: [],
      },
    },
  ],
});
