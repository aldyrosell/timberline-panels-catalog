const IMAGE = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  "alt": coalesce(alt, ""),
  "decorative": coalesce(decorative, false)
}`;

const CTA = `{ label, href }`;

export const HOME_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    name,
    legalName,
    title,
    description,
    telephone,
    email,
    address,
    geo,
    "openingHours": openingHours[]{ days, opens, closes },
    "socials": socials[]{ label, href, icon },
    formEndpoint,
    "ogImage": ogImage ${IMAGE},
    tagline,
    headerCta ${CTA},
    wordmarkLineOne,
    wordmarkLineTwo,
    footerLinksTitle,
    footerContactTitle,
    footerHoursTitle,
    closedLabel,
    footerSlogan,
    newsletterTitle,
    newsletterBody,
    newsletterPlaceholder,
    newsletterSubmitLabel,
    newsletterSubmittingLabel,
    newsletterSuccess,
    newsletterUnconfigured,
    newsletterError,
    "nav": nav[]{ label, href }
  },

  "home": *[_id == "homePage"][0]{
    seoTitle,
    seoDescription,
    _updatedAt,

    hero {
      eyebrow,
      heading,
      body,
      primaryCta ${CTA},
      secondaryCta ${CTA},
      image ${IMAGE},
      "trustPoints": trustPoints[]{ lineOne, lineTwo, icon }
    },

    materialFinder {
      heading,
      "fields": fields[]{ label, placeholder, options },
      submitLabel
    },

    valueProps {
      "items": items[]{ title, description, icon }
    },

    products {
      eyebrow,
      heading,
      link ${CTA},
      cardCtaLabel,
      "items": items[]->{ _id, title, description, image ${IMAGE} }
    },

    whyChoose {
      backgroundImage ${IMAGE},
      eyebrow,
      headingLineOne,
      headingLineTwo,
      body,
      "reasons": reasons[]{ title, description, icon }
    },

    applications {
      eyebrow,
      heading,
      link ${CTA},
      "items": items[]->{ _id, title, image ${IMAGE} }
    },

    collections {
      eyebrow,
      heading,
      body,
      "items": items[]->{ _id, name, image ${IMAGE} },
      panelImage ${IMAGE},
      panelText
    },

    stats {
      "items": items[]{ value, label, icon }
    },

    testimonials {
      backgroundImage ${IMAGE},
      eyebrow,
      heading,
      link ${CTA},
      "items": items[]->{ _id, quote, role, city, icon }
    },

    howItWorks {
      eyebrow,
      heading,
      "steps": steps[]{ title, description }
    },

    showrooms {
      eyebrow,
      heading,
      link ${CTA},
      "items": items[]->{ _id, name, kind, hours, image ${IMAGE} }
    },

    closingCta {
      backgroundImage ${IMAGE},
      heading,
      body,
      primaryCta ${CTA},
      secondaryCta ${CTA},
      noteLineOne,
      noteLineTwo
    }
  }
}`;
