import Image from "next/image";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Icon } from "@/components/icons";
import { SectionLink } from "@/components/section-link";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type TestimonialsProps = HomeContent["testimonials"];

export function Testimonials({ backgroundImage, eyebrow, heading, link, items }: TestimonialsProps) {
  return (
    <section className="relative overflow-hidden bg-[#2E241B]">
      <Image
        src={backgroundImage.url}
        alt={backgroundImage.alt}
        {...blurProps(backgroundImage)}
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(250,247,242,0.94)_0%,rgba(250,247,242,0.86)_62%,rgba(250,247,242,0.3)_100%)]"
      />

      <Container className="relative">
        <div className="py-[clamp(40px,5.5vw,68px)]">
          <div className="mb-[clamp(22px,2.6vw,32px)] flex flex-wrap items-baseline justify-between gap-4">
            <div className="reveal">
              <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
              <h2 className="font-heading m-0 text-[clamp(26px,3.4vw,42px)] leading-[1.12] font-semibold tracking-[-0.5px]">
                {heading}
              </h2>
            </div>
            <SectionLink href={link.href}>{link.label}</SectionLink>
          </div>

          <div className="stagger stagger-cards grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(16px,2vw,24px)]">
            {items.map((testimonial) => (
              <blockquote
                key={testimonial._id}
                className="border-line hover:border-gold-soft lift m-0 flex flex-col rounded-[12px] border bg-white px-[clamp(20px,2.4vw,30px)] py-[clamp(22px,2.4vw,30px)] hover:shadow-[0_12px_28px_rgba(42,33,27,.10)]"
              >
                <p
                  aria-hidden
                  className="font-heading text-gold-ink m-0 text-2xl leading-[0.6]"
                >
                  &ldquo;
                </p>
                <p className="mt-3.5 mb-5 text-[14.5px] leading-[1.65]">
                  {testimonial.quote}
                </p>
                <footer className="border-line mt-auto flex items-center gap-3 border-t pt-4">
                  <Icon
                    name={testimonial.icon}
                    className="text-gold-ink size-[26px] shrink-0"
                  />
                  <span>
                    <span className="block text-sm font-bold">
                      {testimonial.role}
                    </span>
                    <span className="text-muted-ink block text-[12.5px]">
                      {testimonial.city}
                    </span>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
