import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";

const section = (name: string, title: string, type: string) =>
  defineField({
    name,
    title,
    type,
    group: "sections",
    options: { collapsible: true, collapsed: true },
    validation: (rule) => rule.required(),
  });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "sections", title: "Sections", default: true },
    { name: "seo", title: "Search engines" },
  ],
  fields: [
    defineField({
      name: "seoTitle",
      title: "Search result title",
      type: "string",
      group: "seo",
      description:
        "Leave empty to use the title from Site settings.",
      validation: (rule) => [
        rule.max(70).error(),
        rule.max(60).warning("Titles longer than 60 characters get truncated in search results."),
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "Search result description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Leave empty to use the site-wide description from Site settings.",
      validation: (rule) => [
        rule.max(180).error(),
        rule.max(160).warning("Descriptions longer than 160 characters get truncated."),
      ],
    }),

    section("hero", "Hero", "heroSection"),
    section("materialFinder", "Material finder", "materialFinderSection"),
    section("valueProps", "Value propositions", "valuePropsSection"),
    section("products", "Products", "productsSection"),
    section("whyChoose", "Why choose us", "whyChooseSection"),
    section("applications", "Applications", "applicationsSection"),
    section("collections", "Collections", "collectionsSection"),
    section("stats", "Statistics", "statsSection"),
    section("testimonials", "Testimonials", "testimonialsSection"),
    section("howItWorks", "How it works", "howItWorksSection"),
    section("showrooms", "Showrooms", "showroomsSection"),
    section("closingCta", "Closing banner", "closingCtaSection"),
  ],
  preview: {
    select: { title: "hero.heading" },
    prepare: ({ title }) => ({ title: "Home page", subtitle: title }),
  },
});
