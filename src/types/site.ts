export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHours = {
  days: readonly Weekday[];
  opens: string;
  closes: string;
};

export type PostalAddress = {
  streetAddress?: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SiteRoute = {
  path: string;
  label: string;
  inNav: boolean;
  changeFrequency: ChangeFrequency;
  priority: number;
  lastModified?: string;
};

export type SiteConstants = {
  url: string;
  indexable: boolean;
  locale: string;
  schemaType: string;
  routes: readonly SiteRoute[];
};

export type SiteConfig = SiteConstants & {
  name: string;
  legalName: string;
  title: string;
  description: string;
  telephone: string;
  email: string;
  address: PostalAddress;
  geo?: { latitude: number; longitude: number };
  openingHours: readonly OpeningHours[];
  socials: readonly SocialLink[];
  formEndpoint: string;
  nav: readonly NavItem[];
  ogImageUrl: string;
};
