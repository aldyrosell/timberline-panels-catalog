import { CogIcon } from "@sanity/icons/Cog";
import { HomeIcon } from "@sanity/icons/Home";
import type { StructureResolver } from "sanity/structure";

export const SINGLETONS = ["siteSettings", "homePage"] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Grainora Surfaces")
    .items([
      S.listItem()
        .title("Home page")
        .id("homePage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage").title("Home page")),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings"),
        ),
      S.divider(),
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("finish").title("Finishes"),
      S.documentTypeListItem("application").title("Applications"),
      S.documentTypeListItem("showroom").title("Showrooms"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
