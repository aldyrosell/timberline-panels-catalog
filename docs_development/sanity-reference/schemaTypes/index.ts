import type { SchemaTypeDefinition } from "sanity";

import { application, finish, product, showroom, testimonial } from "./documents/collections";
import { homePage } from "./documents/homePage";
import { siteSettings } from "./documents/siteSettings";
import { finderField, processStep, reason, statItem, trustPoint, valueProp } from "./objects/items";
import {
  cta,
  imageWithAlt,
  linkGroup,
  navItem,
  openingHoursSpec,
  postalAddress,
  richLine,
  socialLink,
} from "./objects/primitives";
import {
  applicationsSection,
  closingCtaSection,
  collectionsSection,
  heroSection,
  howItWorksSection,
  materialFinderSection,
  productsSection,
  showroomsSection,
  statsSection,
  testimonialsSection,
  valuePropsSection,
  whyChooseSection,
} from "./objects/sections";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,

  product,
  application,
  finish,
  testimonial,
  showroom,

  imageWithAlt,
  cta,
  navItem,
  linkGroup,
  socialLink,
  postalAddress,
  openingHoursSpec,
  richLine,

  trustPoint,
  valueProp,
  reason,
  statItem,
  processStep,
  finderField,

  heroSection,
  materialFinderSection,
  valuePropsSection,
  productsSection,
  whyChooseSection,
  applicationsSection,
  collectionsSection,
  statsSection,
  testimonialsSection,
  howItWorksSection,
  showroomsSection,
  closingCtaSection,
];
