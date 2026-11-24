import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { FilterIcon } from "@sanity/icons/Filter";
import { OlistIcon } from "@sanity/icons/Olist";
import { SparkleIcon } from "@sanity/icons/Sparkle";
import { TrendUpwardIcon } from "@sanity/icons/TrendUpward";
import { defineArrayMember, defineField, defineType } from "sanity";

import { REASON_ICONS, STAT_ICONS, TRUST_POINT_ICONS, VALUE_PROP_ICONS } from "../icons";

const iconField = (list: { title: string; value: string }[]) =>
  defineField({
    name: "icon",
    title: "Icon",
    type: "string",
    description: "Pick from the icons the design provides.",
    options: { list },
    validation: (rule) => rule.required(),
  });

const str = (name: string, title: string, max: number, description?: string) =>
  defineField({
    name,
    title,
    type: "string",
    ...(description ? { description } : {}),
    validation: (rule) => rule.required().max(max),
  });

export const trustPoint = defineType({
  name: "trustPoint",
  title: "Trust point",
  type: "object",
  icon: CheckmarkCircleIcon,
  options: { columns: 2 },
  fields: [
    str("lineOne", "First line", 30),
    str("lineTwo", "Second line", 30, "Shown on its own line underneath the first."),
    iconField(TRUST_POINT_ICONS),
  ],
  preview: {
    select: { lineOne: "lineOne", lineTwo: "lineTwo" },
    prepare: ({ lineOne, lineTwo }) => ({ title: `${lineOne ?? ""} ${lineTwo ?? ""}`.trim() }),
  },
});

export const valueProp = defineType({
  name: "valueProp",
  title: "Value proposition",
  type: "object",
  icon: SparkleIcon,
  fields: [
    str("title", "Title", 40),
    str("description", "Description", 140),
    iconField(VALUE_PROP_ICONS),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const reason = defineType({
  name: "reason",
  title: "Reason",
  type: "object",
  icon: CheckmarkCircleIcon,
  fields: [
    str("title", "Title", 40),
    str("description", "Description", 140),
    iconField(REASON_ICONS),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const statItem = defineType({
  name: "statItem",
  title: "Statistic",
  type: "object",
  icon: TrendUpwardIcon,
  options: { columns: 2 },
  description: "Only publish figures you can back up.",
  fields: [
    str("value", "Figure", 12, "Written exactly as it should appear, such as 10+ or 5,000+."),
    str("label", "Label", 40),
    iconField(STAT_ICONS),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const processStep = defineType({
  name: "processStep",
  title: "Step",
  type: "object",
  icon: OlistIcon,
  fields: [str("title", "Step name", 40), str("description", "Description", 140)],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const finderField = defineType({
  name: "finderField",
  title: "Finder dropdown",
  type: "object",
  icon: FilterIcon,
  fields: [
    str("label", "Label", 30, "Such as Product Type or Finish."),
    str("placeholder", "Placeholder", 40, "Shown before a visitor picks anything."),
    defineField({
      name: "options",
      title: "Choices",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "label", options: "options" },
    prepare: ({ title, options }) => ({
      title,
      subtitle: Array.isArray(options) ? options.join(", ") : "",
    }),
  },
});
