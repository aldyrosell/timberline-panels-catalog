import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type ClosingCtaProps = HomeContent["closingCta"];

export function ClosingCta({ backgroundImage, heading, body, primaryCta, secondaryCta, noteLineOne, noteLineTwo }: ClosingCtaProps) {
  return (
    <section id="contact" className="bg-brown relative overflow-hidden">
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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(95deg,rgba(50,37,26,0.88)_0%,rgba(50,37,26,0.68)_60%,rgba(50,37,26,0.38)_100%)]"
      />

      <Container className="relative">
        <div className="flex flex-wrap items-center justify-between gap-[clamp(24px,3vw,40px)] py-[clamp(36px,4.6vw,60px)]">
          <div className="reveal max-w-[820px] min-w-[min(100%,280px)] flex-[1_1_380px]">
            <h2 className="font-heading m-0 mb-2.5 text-[clamp(24px,3vw,38px)] leading-[1.15] font-semibold tracking-[-0.5px] text-white">
              {heading}
            </h2>
            <p className="m-0 text-[clamp(14.5px,1.15vw,16.5px)] leading-[1.6] text-white/82">
              {body}
            </p>
            <div className="mt-[26px] flex flex-wrap gap-3.5">
              <Link
                href={primaryCta.href}
                className="bg-gold-ink hover:bg-gold-hover inline-flex min-h-11 items-center rounded-[12px] px-[26px] py-4 text-[15px] font-semibold text-white"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex min-h-11 items-center rounded-[12px] border border-white/50 bg-white/10 px-[26px] py-4 text-[15px] font-semibold text-white hover:bg-white/22"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          <p
            aria-hidden
            className="font-script m-0 flex-[0_1_auto] text-right text-[clamp(22px,2.6vw,34px)] leading-[1.4] text-white/90"
          >
            {noteLineOne}
            <br />
            {noteLineTwo}
          </p>
        </div>
      </Container>
    </section>
  );
}
