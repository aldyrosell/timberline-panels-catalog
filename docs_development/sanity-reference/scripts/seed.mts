import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { dataset, projectId } from "../projectConfig.ts";

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    "SANITY_WRITE_TOKEN is not set.\n" +
      "Copy .env.example to .env.local and paste an Editor-permission token\n" +
      "from sanity.io/manage > API > Tokens.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-09-25",
  token,
  useCdn: false,
});

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = path.resolve(HERE, "../seed-images");

const assetCache = new Map<string, string>();

async function image(file: string, alt: string, decorative = false) {
  let assetId = assetCache.get(file);

  if (!assetId) {
    const buffer = await readFile(path.join(IMAGE_DIR, file));
    const asset = await client.assets.upload("image", buffer, { filename: file });
    assetId = asset._id;
    assetCache.set(file, assetId);
    console.log(`  uploaded ${file}`);
  }

  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: assetId },
    alt,
    decorative,
  };
}


const keyed = <T extends object>(items: T[], prefix: string) =>
  items.map((item, index) => ({ ...item, _key: `${prefix}${index}` }));

const link = (label: string, href: string) => ({ _type: "cta", label, href });

const refs = (ids: string[], prefix: string) =>
  ids.map((id, index) => ({ _type: "reference", _ref: id, _key: `${prefix}${index}` }));

const PRODUCTS = [
  {
    "_id": "product-marine-plywood",
    "title": "Marine Plywood",
    "description": "Built to withstand moisture and heavy use. Ideal for long-lasting interiors.",
    "file": "product-marine-plywood.webp"
  },
  {
    "_id": "product-decorative-laminates",
    "title": "Decorative Laminates",
    "description": "Stylish, durable surfaces in a wide range of colors and textures.",
    "file": "product-decorative-laminates.webp"
  },
  {
    "_id": "product-woodgrain-finishes",
    "title": "Woodgrain Finishes",
    "description": "Bring natural beauty to your spaces with realistic wood designs.",
    "file": "product-woodgrain-finishes.webp"
  },
  {
    "_id": "product-solid-color-panels",
    "title": "Solid Color Panels",
    "description": "Clean, modern finishes for contemporary spaces.",
    "file": "product-solid-color-panels.webp"
  }
];

const APPLICATIONS = [
  {
    "_id": "application-modular-cabinets",
    "title": "Modular Cabinets",
    "file": "application-modular-cabinets.webp"
  },
  {
    "_id": "application-kitchen-interiors",
    "title": "Kitchen Interiors",
    "file": "application-kitchen-interiors.webp"
  },
  {
    "_id": "application-commercial-fit-outs",
    "title": "Commercial Fit-Outs",
    "file": "application-commercial-fit-outs.webp"
  },
  {
    "_id": "application-custom-furniture",
    "title": "Custom Furniture",
    "file": "application-custom-furniture.webp"
  }
];

const FINISHES = [
  {
    "_id": "finish-classic-oak",
    "name": "Classic Oak",
    "file": "finish-classic-oak.webp"
  },
  {
    "_id": "finish-walnut",
    "name": "Walnut",
    "file": "finish-walnut.webp"
  },
  {
    "_id": "finish-teak",
    "name": "Teak",
    "file": "finish-teak.webp"
  },
  {
    "_id": "finish-ash",
    "name": "Ash",
    "file": "finish-ash.webp"
  },
  {
    "_id": "finish-maple",
    "name": "Maple",
    "file": "finish-maple.webp"
  },
  {
    "_id": "finish-walnut-dark",
    "name": "Walnut Dark",
    "file": "finish-walnut-dark.webp"
  },
  {
    "_id": "finish-stone-grey",
    "name": "Stone Grey",
    "file": "finish-stone-grey.webp"
  },
  {
    "_id": "finish-concrete",
    "name": "Concrete",
    "file": "finish-concrete.webp"
  },
  {
    "_id": "finish-matte-black",
    "name": "Matte Black",
    "file": "finish-matte-black.webp"
  },
  {
    "_id": "finish-ivory",
    "name": "Ivory",
    "file": "finish-ivory.webp"
  },
  {
    "_id": "finish-sage-green",
    "name": "Sage Green",
    "file": "finish-sage-green.webp"
  },
  {
    "_id": "finish-navy-blue",
    "name": "Navy Blue",
    "file": "finish-navy-blue.webp"
  }
];

const TESTIMONIALS = [
  {
    "_id": "testimonial-interior-designer-manila",
    "quote": "Excellent quality and consistent supply. Grainora Surfaces has been a reliable partner for all our projects.",
    "role": "Interior Designer",
    "city": "Manila",
    "icon": "home"
  },
  {
    "_id": "testimonial-contractor-cebu",
    "quote": "Wide selection of modern laminates and great customer service. Truly a dependable supplier.",
    "role": "Contractor",
    "city": "Cebu",
    "icon": "house"
  },
  {
    "_id": "testimonial-builder-davao",
    "quote": "High-quality boards and finishes. Our go-to partner for commercial fit-outs.",
    "role": "Builder",
    "city": "Davao",
    "icon": "office"
  },
  {
    "_id": "testimonial-furniture-maker-pampanga",
    "quote": "Delivery is always on schedule and the finishes match every time. Easy to specify for clients.",
    "role": "Furniture Maker",
    "city": "Pampanga",
    "icon": "van"
  }
];

const SHOWROOMS = [
  {
    "_id": "showroom-metro-hub",
    "name": "Metro Hub",
    "kind": "Showroom",
    "hours": "Open Daily · 8AM – 6PM",
    "file": "showroom-metro-hub.webp"
  },
  {
    "_id": "showroom-north-branch",
    "name": "North Branch",
    "kind": "Showroom",
    "hours": "Open Daily · 8AM – 6PM",
    "file": "showroom-north-branch.webp"
  },
  {
    "_id": "showroom-central-warehouse",
    "name": "Central Warehouse",
    "kind": "Main Distribution",
    "hours": "Open Daily · 8AM – 6PM",
    "file": "showroom-central-warehouse.webp"
  },
  {
    "_id": "showroom-south-luzon",
    "name": "South Luzon",
    "kind": "Delivery Area",
    "hours": "Wide area coverage",
    "file": "showroom-south-luzon.webp"
  }
];

type SeedDocument = { _id: string; _type: string } & Record<string, unknown>;

async function seedCollections() {
  console.log("Products, applications, finishes, testimonials, showrooms");

  const documents: SeedDocument[] = TESTIMONIALS.map((testimonial) => ({
    _id: testimonial._id,
    _type: "testimonial",
    quote: testimonial.quote,
    role: testimonial.role,
    city: testimonial.city,
    icon: testimonial.icon,
  }));

  for (const product of PRODUCTS) {
    documents.push({
      _id: product._id,
      _type: "product",
      title: product.title,
      description: product.description,
      image: await image(product.file, product.title),
    });
  }

  for (const application of APPLICATIONS) {
    documents.push({
      _id: application._id,
      _type: "application",
      title: application.title,
      image: await image(application.file, application.title),
    });
  }

  for (const finish of FINISHES) {
    documents.push({
      _id: finish._id,
      _type: "finish",
      name: finish.name,
      image: await image(finish.file, `${finish.name} laminate finish`),
    });
  }

  for (const showroom of SHOWROOMS) {
    documents.push({
      _id: showroom._id,
      _type: "showroom",
      name: showroom.name,
      kind: showroom.kind,
      hours: showroom.hours,
      image: await image(showroom.file, `${showroom.name} — ${showroom.kind}`),
    });
  }

  const transaction = documents.reduce(
    (tx, document) => tx.createOrReplace(document),
    client.transaction(),
  );

  await transaction.commit();
  console.log(`  wrote ${documents.length} documents`);
}

async function seedSiteSettings() {
  console.log("Site settings");

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: "Grainora Surfaces",
    legalName: "Grainora Surfaces",
    title: "Grainora Surfaces — Premium Laminated Marine Plywood",
    description:
      "Premium laminated marine plywood and decorative laminates for refined spaces. Engineered for strength, designed for beauty, delivered nationwide.",
    telephone: "+63 912 345 6789",
    email: "hello@grainora.com",
    address: {
      _type: "postalAddress",
      addressLocality: "Metro Manila",
      addressCountry: "PH",
    },
    openingHours: keyed(
      [
        {
          _type: "openingHoursSpec",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      "hours",
    ),
    socials: keyed(
      [
        { _type: "socialLink", label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
        { _type: "socialLink", label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
        { _type: "socialLink", label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
        { _type: "socialLink", label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
      ],
      "social",
    ),
    tagline: "Premium panels for refined spaces",
    headerCta: link("Request a Quote", "#contact"),
    wordmarkLineOne: "Grainora",
    wordmarkLineTwo: "Surfaces",
    footerLinksTitle: "Quick Links",
    footerContactTitle: "Contact Us",
    footerHoursTitle: "Business Hours",
    closedLabel: "Closed",
    footerSlogan: "Premium panels for refined spaces.",
    newsletterTitle: "Join Our Updates",
    newsletterBody: "Get the latest products and inspiration.",
    newsletterPlaceholder: "Your email address",
    newsletterSubmitLabel: "Subscribe",
    newsletterSubmittingLabel: "Sending…",
    newsletterSuccess: "Thanks — you’re on the list.",
    newsletterUnconfigured: "Subscriptions aren’t connected yet. Please email us instead.",
    newsletterError: "Something went wrong. Please try again or email us.",
    nav: keyed(
      [
        { _type: "navItem", label: "Home", href: "#top" },
        { _type: "navItem", label: "Products", href: "#products" },
        { _type: "navItem", label: "Collections", href: "#collections" },
        { _type: "navItem", label: "Applications", href: "#applications" },
        { _type: "navItem", label: "About", href: "#about" },
        { _type: "navItem", label: "Contact", href: "#contact" },
      ],
      "nav",
    ),
  });
}

async function seedHomePage() {
  console.log("Home page");

  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",

    hero: {
      _type: "heroSection",
      eyebrow: "Beautiful Surfaces. Enduring Spaces.",
      heading: "Premium Laminated Marine Plywood for Refined Spaces",
      body: "Engineered for strength. Designed for beauty. Grainora Surfaces offers premium plywood and decorative laminates for modern living.",
      primaryCta: link("Explore Products", "#products"),
      secondaryCta: link("Request a Quote", "#contact"),
      image: await image("hero.webp", "Stacked laminated plywood panels in a warm interior"),
      trustPoints: keyed(
        [
          { _type: "trustPoint", lineOne: "Marine Grade", lineTwo: "Durability", icon: "droplet" },
          { _type: "trustPoint", lineOne: "Premium", lineTwo: "Finishes", icon: "layers" },
          { _type: "trustPoint", lineOne: "Trusted by", lineTwo: "Professionals", icon: "users" },
        ],
        "trust",
      ),
    },

    materialFinder: {
      _type: "materialFinderSection",
      heading: "Find the Right Material for Your Project",
      fields: keyed([
  {
    "_type": "finderField",
    "label": "Product Type",
    "placeholder": "Select product",
    "options": [
      "Marine Plywood",
      "Decorative Laminates",
      "Solid Color Panels"
    ]
  },
  {
    "_type": "finderField",
    "label": "Finish",
    "placeholder": "Select finish",
    "options": [
      "Woodgrain",
      "Matte Solid",
      "Gloss"
    ]
  },
  {
    "_type": "finderField",
    "label": "Thickness",
    "placeholder": "Select thickness",
    "options": [
      "6 mm",
      "12 mm",
      "18 mm"
    ]
  },
  {
    "_type": "finderField",
    "label": "Application",
    "placeholder": "Select application",
    "options": [
      "Cabinetry",
      "Interiors",
      "Fit-Outs"
    ]
  }
], "finder"),
      submitLabel: "Find Materials",
    },

    valueProps: { _type: "valuePropsSection", items: keyed([
  {
    "_type": "valueProp",
    "title": "Moisture Resistant",
    "description": "Engineered for long-lasting performance in demanding environments.",
    "icon": "droplet"
  },
  {
    "_type": "valueProp",
    "title": "Marine Grade Core",
    "description": "Strong, stable and reliable for interior and semi-exterior applications.",
    "icon": "layers"
  },
  {
    "_type": "valueProp",
    "title": "Wide Finish Selection",
    "description": "Hundreds of laminates, designs, woodgrains and solid colors.",
    "icon": "palette"
  },
  {
    "_type": "valueProp",
    "title": "Reliable Supply",
    "description": "Consistent stock and timely delivery for your projects.",
    "icon": "truck"
  }
], "value") },

    products: {
      _type: "productsSection",
      eyebrow: "Our Products",
      heading: "Quality Materials for Every Vision",
      link: link("View All Products", "#products"),
      cardCtaLabel: "Explore",
      items: refs(
        PRODUCTS.map((x) => x._id),
        "product",
      ),
    },

    whyChoose: {
      _type: "whyChooseSection",
      backgroundImage: await image("why-bg.webp", "", true),
      eyebrow: "Why Choose Grainora Surfaces",
      headingLineOne: "More Than Materials.",
      headingLineTwo: "A Partner in Your Projects.",
      body: "We provide high-quality laminated boards and marine plywood that help bring your vision to life. From homes to commercial spaces, we’re here to support builders, designers and dreamers.",
      reasons: keyed([
  {
    "_type": "reason",
    "title": "Consistent Quality",
    "description": "Carefully sourced and tested for trusted results.",
    "icon": "gem"
  },
  {
    "_type": "reason",
    "title": "Durable & Reliable",
    "description": "Built for real-world conditions.",
    "icon": "shield"
  },
  {
    "_type": "reason",
    "title": "Elegant Finishes",
    "description": "Modern designs for every style.",
    "icon": "layers"
  },
  {
    "_type": "reason",
    "title": "Expert Guidance",
    "description": "Support for contractors, architects and homeowners.",
    "icon": "person"
  }
], "reason"),
    },

    applications: {
      _type: "applicationsSection",
      eyebrow: "Real Spaces. Real Possibilities.",
      heading: "Designed for a Wide Range of Applications",
      link: link("View More Applications", "#applications"),
      items: refs(
        APPLICATIONS.map((x) => x._id),
        "application",
      ),
    },

    collections: {
      _type: "collectionsSection",
      eyebrow: "Explore Our Collections",
      heading: "A Finish for Every Style",
      body: "From natural woodgrains to modern solids, our laminate collections bring beauty and durability to every space.",
      items: refs(
        FINISHES.map((x) => x._id),
        "finish",
      ),
      panelImage: await image(
        "collections-panel.webp",
        "Slatted wood wall in a contemporary interior",
      ),
      panelText: "Timeless\nSurfaces\nfor a More\nBeautiful\nTomorrow",
    },

    stats: { _type: "statsSection", items: keyed([
  {
    "_type": "statItem",
    "value": "15+",
    "label": "Years Experience",
    "icon": "trophy"
  },
  {
    "_type": "statItem",
    "value": "500+",
    "label": "Projects Supplied",
    "icon": "building"
  },
  {
    "_type": "statItem",
    "value": "100+",
    "label": "Finish Options",
    "icon": "layers"
  },
  {
    "_type": "statItem",
    "value": "Nationwide",
    "label": "Delivery Coverage",
    "icon": "truck"
  }
], "stat") },

    testimonials: {
      _type: "testimonialsSection",
      backgroundImage: await image("testimonials-bg.webp", "", true),
      eyebrow: "Trusted by Professionals",
      heading: "What Our Clients Say",
      link: link("More Testimonials", "#contact"),
      items: refs(
        TESTIMONIALS.map((x) => x._id),
        "quote",
      ),
    },

    howItWorks: {
      _type: "howItWorksSection",
      eyebrow: "Simple. Convenient. Reliable.",
      heading: "How It Works",
      steps: keyed([
  {
    "_type": "processStep",
    "title": "Browse Materials",
    "description": "Explore our wide range of plywood and laminates."
  },
  {
    "_type": "processStep",
    "title": "Request Samples",
    "description": "Get samples to check quality and finish."
  },
  {
    "_type": "processStep",
    "title": "Get a Quote",
    "description": "Receive a fast and competitive quotation."
  },
  {
    "_type": "processStep",
    "title": "Delivery or Pickup",
    "description": "We deliver nationwide or you can visit our showroom."
  }
], "step"),
    },

    showrooms: {
      _type: "showroomsSection",
      eyebrow: "Our Showrooms & Service Areas",
      heading: "Visit Us or We’ll Deliver to You",
      link: link("View Map", "#contact"),
      items: refs(
        SHOWROOMS.map((x) => x._id),
        "showroom",
      ),
    },

    closingCta: {
      _type: "closingCtaSection",
      backgroundImage: await image("cta-bg.webp", "", true),
      heading: "Ready to Bring Your Ideas to Life?",
      body: "Get a quote today or visit our showroom. Let’s build better spaces together.",
      primaryCta: link("Request a Quote", "#contact"),
      secondaryCta: link("Visit Our Showroom", "#contact"),
      noteLineOne: "Refined Spaces",
      noteLineTwo: "Real Possibilities",
    },
  });
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset}\n`);
  await seedCollections();
  await seedSiteSettings();
  await seedHomePage();
  console.log("\nDone. These are published documents, live in the dataset immediately.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
