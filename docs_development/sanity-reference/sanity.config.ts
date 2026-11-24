import { visionTool } from "@sanity/vision";
import { buildLegacyTheme, defineConfig } from "sanity";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { Logo } from "./logo";
import { brandColor, dataset, previewOrigins, projectId, title } from "./projectConfig";
import { schemaTypes } from "./schemaTypes";
import { SINGLETONS, structure } from "./structure";

const isSingleton = (schemaType: string) =>
  (SINGLETONS as readonly string[]).includes(schemaType);

export default defineConfig({
  name: "default",
  title,
  projectId,
  dataset,
  icon: Logo,
  theme: buildLegacyTheme({
    "--brand-primary": brandColor,
    "--default-button-primary-color": brandColor,
    "--focus-color": brandColor,
  }),
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: "Live preview",
      previewUrl: {
        initial: ({ origin }) =>
          origin.endsWith(".sanity.studio") ? previewOrigins.production : previewOrigins.local,
        previewMode: {
          enable: "/api/draft-mode/enable/",
          disable: "/api/draft-mode/disable/",
        },
      },
      allowOrigins: [previewOrigins.local, previewOrigins.production],
      resolve: {
        mainDocuments: defineDocuments([
          { route: "/", filter: '_type == "homePage" && _id == "homePage"' },
        ]),
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((template) => !isSingleton(template.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      isSingleton(schemaType)
        ? prev.filter(
            ({ action }) => action !== "duplicate" && action !== "delete" && action !== "unpublish",
          )
        : prev,
  },
});
