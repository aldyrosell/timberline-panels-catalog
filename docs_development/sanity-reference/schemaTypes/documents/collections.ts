import { ColorWheelIcon } from "@sanity/icons/ColorWheel";
import { CommentIcon } from "@sanity/icons/Comment";
import { ImagesIcon } from "@sanity/icons/Images";
import { PackageIcon } from "@sanity/icons/Package";
import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";

import { TESTIMONIAL_ICONS } from "../icons";

const str = (name: string, title: string, max: number, description?: string) =>
  defineField({
    name,
    title,
    type: "string",
    ...(description ? { description } : {}),
    validation: (rule) => rule.required().max(max),
  });

const photo = (title = "Photograph", description?: string) =>
  defineField({
    name: "image",
    title,
    type: "imageWithAlt",
    ...(description ? { description } : {}),
    validation: (rule) => rule.required(),
  });

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
    str("title", "Product name", 40),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    photo(),
  ],
  preview: { select: { title: "title", subtitle: "description", media: "image" } },
});

export const application = defineType({
  name: "application",
  title: "Application",
  type: "document",
  icon: ImagesIcon,
  fields: [str("title", "Name", 40, "Such as Kitchen Interiors."), photo()],
  preview: { select: { title: "title", media: "image" } },
});

export const finish = defineType({
  name: "finish",
  title: "Finish",
  type: "document",
  icon: ColorWheelIcon,
  fields: [
    str("name", "Finish name", 30),
    photo("Swatch", "A close-up of the surface. It's shown small."),
  ],
  preview: { select: { title: "name", media: "image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  description:
    "Only use real quotes from real clients.",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "Without quotation marks — the design adds them.",
      validation: (rule) => rule.required().max(300),
    }),
    str("role", "Client's role", 40, "Such as Interior Designer or Contractor."),
    str("city", "City", 40),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: TESTIMONIAL_ICONS },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "role", subtitle: "city" } },
});

export const showroom = defineType({
  name: "showroom",
  title: "Showroom",
  type: "document",
  icon: PinIcon,
  fields: [
    str("name", "Name", 40),
    str("kind", "Type", 40, "Such as Showroom, Warehouse or Service Area."),
    str("hours", "Opening hours", 60, "Written as it should appear, such as 'Open Daily · 8AM – 6PM'."),
    photo(),
  ],
  preview: { select: { title: "name", subtitle: "kind", media: "image" } },
});
