import { defineArrayMember, defineField, defineType } from "sanity";

const str = (name: string, title: string, max: number, description?: string) =>
  defineField({
    name,
    title,
    type: "string",
    ...(description ? { description } : {}),
    validation: (rule) => rule.required().max(max),
  });

const txt = (name: string, title: string, max: number, description?: string) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 3,
    ...(description ? { description } : {}),
    validation: (rule) => rule.required().max(max),
  });

const eyebrow = () => str("eyebrow", "Eyebrow", 60, "The small capitalised line above the heading.");

const heading = (description: string, max = 90) => str("heading", "Heading", max, description);

const link = () => defineField({ name: "link", title: "Heading link", type: "cta" });

const image = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "imageWithAlt",
    ...(description ? { description } : {}),
    validation: (rule) => rule.required(),
  });

const refList = (to: string, description: string) =>
  defineField({
    name: "items",
    title: "Shown here",
    type: "array",
    description,
    of: [defineArrayMember({ type: "reference", to: [{ type: to }] })],
    validation: (rule) => rule.required().min(1),
  });

const inlineList = (name: string, title: string, type: string, description?: string) =>
  defineField({
    name,
    title,
    type: "array",
    ...(description ? { description } : {}),
    of: [defineArrayMember({ type })],
    validation: (rule) => rule.required().min(1),
  });

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    eyebrow(),
    str(
      "heading",
      "Page headline",
      90,
      "The main headline of your homepage.",
    ),
    txt("body", "Intro paragraph", 300),
    defineField({ name: "primaryCta", title: "Main button", type: "cta" }),
    defineField({ name: "secondaryCta", title: "Second button", type: "cta" }),
    image(
      "image",
      "Background photograph",
      "The large photo at the top. Upload the full-size original.",
    ),
    inlineList("trustPoints", "Trust points", "trustPoint"),
  ],
});

export const materialFinderSection = defineType({
  name: "materialFinderSection",
  title: "Material finder",
  type: "object",
  fields: [
    heading("Above the finder dropdowns."),
    inlineList("fields", "Dropdowns", "finderField", "One per dropdown, in the order shown."),
    str("submitLabel", "Search button text", 30),
  ],
});

export const valuePropsSection = defineType({
  name: "valuePropsSection",
  title: "Value propositions",
  type: "object",
  fields: [inlineList("items", "Value propositions", "valueProp")],
});

export const productsSection = defineType({
  name: "productsSection",
  title: "Products",
  type: "object",
  fields: [
    eyebrow(),
    heading("The section heading above the product cards."),
    link(),
    str("cardCtaLabel", "Card link text", 24, "Repeated on every product card, such as 'Explore'."),
    refList("product", "Drag to reorder. Remove one to hide it."),
  ],
});

export const whyChooseSection = defineType({
  name: "whyChooseSection",
  title: "Why choose us",
  type: "object",
  fields: [
    image("backgroundImage", "Background photograph", "Sits behind the text. Usually ticked decorative."),
    eyebrow(),
    str("headingLineOne", "Heading, first line", 45),
    str("headingLineTwo", "Heading, second line", 45, "Shown on its own line. Both lines form one heading."),
    txt("body", "Body copy", 400),
    inlineList("reasons", "Reasons", "reason"),
  ],
});

export const applicationsSection = defineType({
  name: "applicationsSection",
  title: "Applications",
  type: "object",
  fields: [
    eyebrow(),
    heading("The section heading above the application photographs."),
    link(),
    refList("application", "Drag to reorder. Remove one to hide it."),
  ],
});

export const collectionsSection = defineType({
  name: "collectionsSection",
  title: "Collections",
  type: "object",
  fields: [
    eyebrow(),
    heading("The section heading above the finish swatches."),
    txt("body", "Body copy", 300),
    refList("finish", "The swatches, in order. Drag to reorder."),
    image("panelImage", "Side photograph"),
    defineField({
      name: "panelText",
      title: "Text over the side photograph",
      type: "text",
      rows: 5,
      description: "Press Enter for each new line. Set in capitals by the design.",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Statistics",
  type: "object",
  fields: [inlineList("items", "Statistics", "statItem")],
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
    image("backgroundImage", "Background photograph", "Sits behind the quotes. Usually ticked decorative."),
    eyebrow(),
    heading("The section heading above the client quotes."),
    link(),
    refList("testimonial", "Drag to reorder."),
  ],
});

export const howItWorksSection = defineType({
  name: "howItWorksSection",
  title: "How it works",
  type: "object",
  fields: [
    eyebrow(),
    heading("The section heading above the steps."),
    inlineList("steps", "Steps", "processStep", "Numbered automatically in this order."),
  ],
});

export const showroomsSection = defineType({
  name: "showroomsSection",
  title: "Showrooms",
  type: "object",
  fields: [
    eyebrow(),
    heading("The section heading above the showroom cards."),
    link(),
    refList("showroom", "Drag to reorder. Remove one to hide it."),
  ],
});

export const closingCtaSection = defineType({
  name: "closingCtaSection",
  title: "Closing banner",
  type: "object",
  fields: [
    image("backgroundImage", "Background photograph", "Sits behind the text. Usually ticked decorative."),
    heading("The last thing a visitor reads before the footer."),
    txt("body", "Body copy", 240),
    defineField({ name: "primaryCta", title: "Main button", type: "cta" }),
    defineField({ name: "secondaryCta", title: "Second button", type: "cta" }),
    str("noteLineOne", "Handwritten note, first line", 30, "Decorative — screen readers skip it."),
    str("noteLineTwo", "Handwritten note, second line", 30),
  ],
});
