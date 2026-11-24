import { OpeningHoursInput } from "../../components/OpeningHoursInput";
import { SocialProfilesInput } from "../../components/SocialProfilesInput";
import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const navArray = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [defineArrayMember({ type: "navItem" })],
    validation: (rule) => rule.required().min(1),
  });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "business", title: "Business details", default: true },
    { name: "seo", title: "Search engines" },
    { name: "navigation", title: "Menus" },
    { name: "chrome", title: "Header & footer" },
  ],
  fieldsets: [
    {
      name: "newsletterForm",
      title: "Newsletter form wording",
      description: "Button text and messages. Rarely needs changing.",
      group: "chrome",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Business name",
      type: "string",
      group: "business",
      description:
        "Exactly as it appears on your Google Business Profile.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "legalName",
      title: "Registered legal name",
      type: "string",
      group: "business",
      description: "The full registered company name, if it differs from the trading name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "telephone",
      title: "Phone number",
      type: "string",
      group: "business",
      description: "Written exactly as it should be published, including country code.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      group: "business",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "postalAddress",
      group: "business",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "geo",
      title: "Map coordinates",
      type: "object",
      group: "business",
      description: "Optional. Helps map results point at the right spot.",
      fields: [
        defineField({ name: "latitude", type: "number" }),
        defineField({ name: "longitude", type: "number" }),
      ],
      options: { collapsible: true, collapsed: true, columns: 2 },
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours",
      type: "array",
      group: "business",
      description: "Switch each day on or off and pick the times.",
      of: [defineArrayMember({ type: "openingHoursSpec" })],
      components: { input: OpeningHoursInput },
    }),
    defineField({
      name: "socials",
      title: "Social profiles",
      type: "array",
      group: "business",
      components: { input: SocialProfilesInput },
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "formEndpoint",
      title: "Form submission address",
      type: "url",
      group: "business",
      description:
        "From your form provider. Leave empty if you don't have one yet.",
    }),

    defineField({
      name: "title",
      title: "Search result title",
      type: "string",
      group: "seo",
      description:
        "The blue headline in Google results. Best at 50–60 characters.",
      validation: (rule) => [
        rule.required().max(70).error(),
        rule
          .min(50)
          .max(60)
          .warning("Titles outside 50–60 characters get truncated in search results."),
      ],
    }),
    defineField({
      name: "description",
      title: "Search result description",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "The text under the headline in Google. Best at 140–160 characters.",
      validation: (rule) => [
        rule.required().max(180).error(),
        rule.min(140).max(160).warning("Descriptions outside 140–160 characters get truncated."),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Link preview image",
      type: "imageWithAlt",
      group: "seo",
      description:
        "Shown when your site is shared. Use a 1200 × 630 image.",
    }),


    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "chrome",
      description: "Under the business name in the header and the footer.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "headerCta",
      title: "Header button",
      type: "cta",
      group: "chrome",
      description: "Top right of the page, repeated in the mobile menu.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "wordmarkLineOne",
      title: "Footer wordmark, first line",
      type: "string",
      group: "chrome",
      description: "The footer sets the business name across two lines.",
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: "wordmarkLineTwo",
      title: "Footer wordmark, second line",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: "footerLinksTitle",
      title: "Footer — Links heading",
      type: "string",
      group: "chrome",
      description: "The links are the header menu, repeated.",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "footerContactTitle",
      title: "Footer — Contact heading",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "footerHoursTitle",
      title: "Footer — Hours heading",
      type: "string",
      group: "chrome",
      description: "The hours themselves are set in Business details.",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "closedLabel",
      title: "Footer — closed-day label",
      type: "string",
      group: "chrome",
      description: "Shown next to any day with no opening hours, such as 'Closed'.",
      validation: (rule) => rule.required().max(20),
    }),
    defineField({
      name: "footerSlogan",
      title: "Footer — closing line",
      type: "string",
      group: "chrome",
      description: "Printed beside the copyright notice.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "newsletterTitle",
      title: "Newsletter heading",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "newsletterBody",
      title: "Newsletter body",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "newsletterPlaceholder",
      fieldset: "newsletterForm",
      title: "Newsletter — email placeholder",
      type: "string",
      group: "chrome",
      description: "Shown inside the empty email box, and read aloud as its label.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "newsletterSubmitLabel",
      fieldset: "newsletterForm",
      title: "Newsletter — button text",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: "newsletterSubmittingLabel",
      fieldset: "newsletterForm",
      title: "Newsletter — button text while sending",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: "newsletterSuccess",
      fieldset: "newsletterForm",
      title: "Newsletter — success message",
      type: "string",
      group: "chrome",
      description: "Shown after someone subscribes.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "newsletterUnconfigured",
      fieldset: "newsletterForm",
      title: "Newsletter — not connected message",
      type: "string",
      group: "chrome",
      description: "Shown if no form submission address is set in Business details.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "newsletterError",
      fieldset: "newsletterForm",
      title: "Newsletter — error message",
      type: "string",
      group: "chrome",
      description: "Shown if the subscription fails.",
      validation: (rule) => rule.required().max(160),
    }),

    navArray("nav", "Header menu", "The links across the top of every page, repeated in the footer."),
  ],
  preview: {
    select: { title: "name" },
    prepare: ({ title }) => ({ title: title ?? "Site settings", subtitle: "Site settings" }),
  },
});
