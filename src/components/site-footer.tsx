import Link from "next/link";
import { Container } from "@/components/container";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Logo,
  Mail,
  Phone,
  Pin,
  YouTube,
} from "@/components/icons";
import { NewsletterForm, type NewsletterCopy } from "@/components/newsletter-form";
import type { DisplayHours } from "@/lib/hours";
import type { NavItem, SiteSettings } from "@/lib/sanity/schema";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: LinkedIn,
  youtube: YouTube,
} as const;

type SiteFooterProps = {
  wordmarkLineOne: string;
  wordmarkLineTwo: string;
  tagline: string;
  linksTitle: string;
  links: readonly NavItem[];
  contactTitle: string;
  telephone: string;
  email: string;
  locality: string;
  country: string;
  hoursTitle: string;
  hours: readonly DisplayHours[];
  newsletterTitle: string;
  newsletterBody: string;
  newsletter: NewsletterCopy;
  formEndpoint: string;
  legalName: string;
  slogan: string;
  socials: NonNullable<SiteSettings["socials"]>;
};

export function SiteFooter({
  wordmarkLineOne,
  wordmarkLineTwo,
  tagline,
  linksTitle,
  links,
  contactTitle,
  telephone,
  email,
  locality,
  country,
  hoursTitle,
  hours,
  newsletterTitle,
  newsletterBody,
  newsletter,
  formEndpoint,
  legalName,
  slogan,
  socials,
}: SiteFooterProps) {
  return (
    <footer className="bg-deep text-white">
      <Container>
        <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(26px,3vw,40px)] pt-[clamp(36px,4.4vw,58px)] pb-[clamp(28px,3vw,40px)]">
          <div className="max-w-[340px]">
            <div className="flex items-center gap-3">
              <Logo className="size-8" />
              <span className="font-heading text-xl leading-[1.15] font-semibold">
                {wordmarkLineOne}
                <br />
                {wordmarkLineTwo}
              </span>
            </div>
            <p className="mt-3.5 mb-0 text-[13px] text-white/70">{tagline}</p>
          </div>

          <nav aria-label={linksTitle}>
            <h2 className="m-0 mb-3.5 text-sm font-bold">{linksTitle}</h2>
            <div className="flex flex-col gap-2.5">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-gold-soft press text-[13.5px] text-white/78"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <h2 className="m-0 mb-3.5 text-sm font-bold">{contactTitle}</h2>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${telephone.replace(/[^+\d]/g, "")}`}
                className="hover:text-gold-soft press flex gap-2.5 text-[13.5px] text-white/78"
              >
                <Phone className="text-gold-soft mt-0.5 size-4 shrink-0" />
                {telephone}
              </a>
              <a
                href={`mailto:${email}`}
                className="hover:text-gold-soft press flex gap-2.5 text-[13.5px] text-white/78"
              >
                <Mail className="text-gold-soft mt-0.5 size-4 shrink-0" />
                {email}
              </a>
              <address className="flex gap-2.5 text-[13.5px] text-white/78 not-italic">
                <Pin className="text-gold-soft mt-0.5 size-4 shrink-0" />
                {`${locality}, ${country}`}
              </address>
            </div>
          </div>

          <div>
            <h2 className="m-0 mb-3.5 text-sm font-bold">{hoursTitle}</h2>
            {hours.map((entry, index) => (
              <p
                key={entry.days}
                className={
                  index < hours.length - 1
                    ? "m-0 mb-2.5 text-[13.5px] text-white/78"
                    : "m-0 text-[13.5px] text-white/78"
                }
              >
                {entry.days}
                <br />
                {entry.hours}
              </p>
            ))}
          </div>

          <div className="max-w-[380px]">
            <h2 className="m-0 mb-3.5 text-sm font-bold">{newsletterTitle}</h2>
            <p className="m-0 mb-3.5 text-[13.5px] text-white/78">{newsletterBody}</p>
            <NewsletterForm endpoint={formEndpoint} {...newsletter} />
          </div>
        </div>

        <div className="reveal flex flex-wrap items-center justify-between gap-4 border-t border-white/16 pt-5 pb-[26px]">
          <p className="m-0 text-[12.5px] text-white/60">
            © {new Date().getFullYear()} {legalName}. All rights reserved.
          </p>
          <p className="m-0 text-[12.5px] text-white/60">{slogan}</p>
          <ul className="flex list-none gap-4 p-0">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="hover:text-gold-soft press lift inline-flex text-white/75"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
