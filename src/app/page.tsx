import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Applications } from "@/components/sections/applications";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Collections } from "@/components/sections/collections";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { MaterialFinder } from "@/components/sections/material-finder";
import { Products } from "@/components/sections/products";
import { Showrooms } from "@/components/sections/showrooms";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { ValueProps } from "@/components/sections/value-props";
import { WhyChoose } from "@/components/sections/why-choose";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { closedDays, formatOpeningHours } from "@/lib/hours";
import { websiteSchema } from "@/lib/jsonld";
import { getHomeQuery, getSiteConfig } from "@/lib/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getHomeQuery();

  return {
    ...(home.seoTitle ? { title: { absolute: home.seoTitle } } : {}),
    ...(home.seoDescription ? { description: home.seoDescription } : {}),
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [config, { settings, home }] = await Promise.all([
    getSiteConfig(),
    getHomeQuery(),
  ]);

  const closed = closedDays(config.openingHours);
  const hours = [
    ...formatOpeningHours(config.openingHours),
    ...(closed.length > 0 ? [{ days: closed.join(", "), hours: settings.closedLabel }] : []),
  ];

  const country =
    new Intl.DisplayNames([config.locale], { type: "region" }).of(config.address.addressCountry) ??
    config.address.addressCountry;

  return (
    <>
      <JsonLd data={websiteSchema(config)} />

      <SiteHeader
        name={settings.name}
        tagline={settings.tagline}
        nav={settings.nav}
        cta={settings.headerCta}
      />

      <main>
        <Hero {...home.hero} />
        <MaterialFinder {...home.materialFinder} />
        <ValueProps {...home.valueProps} />
        <Products {...home.products} />
        <WhyChoose {...home.whyChoose} />
        <Applications {...home.applications} />
        <Collections {...home.collections} />
        <Stats {...home.stats} />
        <Testimonials {...home.testimonials} />
        <HowItWorks {...home.howItWorks} />
        <Showrooms {...home.showrooms} />
        <ClosingCta {...home.closingCta} />
      </main>

      <SiteFooter
        wordmarkLineOne={settings.wordmarkLineOne}
        wordmarkLineTwo={settings.wordmarkLineTwo}
        tagline={settings.tagline}
        linksTitle={settings.footerLinksTitle}
        links={settings.nav}
        contactTitle={settings.footerContactTitle}
        telephone={settings.telephone}
        email={settings.email}
        locality={config.address.addressLocality}
        country={country}
        hoursTitle={settings.footerHoursTitle}
        hours={hours}
        newsletterTitle={settings.newsletterTitle}
        newsletterBody={settings.newsletterBody}
        newsletter={{
          placeholder: settings.newsletterPlaceholder,
          submitLabel: settings.newsletterSubmitLabel,
          submittingLabel: settings.newsletterSubmittingLabel,
          success: settings.newsletterSuccess,
          unconfigured: settings.newsletterUnconfigured,
          error: settings.newsletterError,
        }}
        formEndpoint={config.formEndpoint}
        legalName={settings.legalName}
        slogan={settings.footerSlogan}
        socials={settings.socials ?? []}
      />
    </>
  );
}
