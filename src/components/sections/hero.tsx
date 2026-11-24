import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowRight, Icon } from "@/components/icons";
import type { HomeContent } from "@/lib/sanity/schema";


type HeroProps = HomeContent["hero"];

export function Hero({ eyebrow, heading, body, primaryCta, secondaryCta, image, trustPoints }: HeroProps) {
  return (
    <section id="top" className="bg-ink relative overflow-hidden">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(23,17,12,0.93)_0%,rgba(23,17,12,0.8)_46%,rgba(23,17,12,0.36)_78%,rgba(23,17,12,0.2)_100%)]"
      />

      <Container className="pointer-events-none relative">
        <div className="hero-enter w-full max-w-[min(100%,820px)] py-[clamp(52px,7vw,104px)] pb-[clamp(40px,5vw,68px)]">
          <p className="text-gold-soft m-0 mb-[18px] text-[clamp(11px,1vw,12.5px)] font-semibold tracking-[2px] uppercase">
            {eyebrow}
          </p>

          <h1 className="font-heading m-0 text-[clamp(34px,5.4vw,60px)] leading-[1.08] font-semibold tracking-[-0.8px] text-white">
            {heading}
          </h1>

          <p className="mt-[22px] mb-0 max-w-[560px] text-[clamp(15px,1.25vw,18px)] leading-[1.6] text-white/88">
            {body}
          </p>

          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3.5">
            <Link
              href={primaryCta.href}
              className="bg-gold-ink hover:bg-gold-hover group press inline-flex min-h-11 items-center gap-2.5 rounded-[12px] px-[26px] py-4 text-[15px] font-semibold text-white"
            >
              {primaryCta.label}
              <ArrowRight className="advance h-2.5 w-4" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="press inline-flex min-h-11 items-center rounded-[12px] border border-white/50 bg-white/10 px-[26px] py-4 text-[15px] font-semibold text-white hover:bg-white/22"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <ul className="mt-[clamp(32px,4vw,52px)] flex list-none flex-wrap gap-[clamp(20px,3vw,44px)] p-0">
            {trustPoints.map((point) => (
              <li
                key={point.lineOne}
                className="flex max-w-[250px] items-center gap-3"
              >
                <Icon
                  name={point.icon}
                  className="text-gold-soft size-[22px] shrink-0"
                />
                <span className="text-[11.5px] leading-[1.4] font-semibold tracking-[1.3px] text-white uppercase">
                  {point.lineOne}
                  <br />
                  {point.lineTwo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
