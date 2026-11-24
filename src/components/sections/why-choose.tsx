import Image from "next/image";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Icon } from "@/components/icons";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type WhyChooseProps = HomeContent["whyChoose"];

export function WhyChoose({ backgroundImage, eyebrow, headingLineOne, headingLineTwo, body, reasons }: WhyChooseProps) {
  return (
    <section id="about" className="bg-brown relative overflow-hidden">
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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(48,36,26,0.88)_0%,rgba(48,36,26,0.7)_58%,rgba(48,36,26,0.4)_100%)]"
      />

      <Container className="relative">
        <div className="flex flex-wrap items-start gap-[clamp(28px,4vw,56px)] py-[clamp(40px,5.5vw,68px)]">
          <div className="reveal max-w-[640px] min-w-[min(100%,300px)] flex-[1_1_380px]">
            <Eyebrow className="text-gold-soft mb-3">
              {eyebrow}
            </Eyebrow>
            <h2 className="font-heading m-0 text-[clamp(26px,3.4vw,42px)] leading-[1.14] font-semibold tracking-[-0.5px] text-white">
              {headingLineOne}
              <br />
              {headingLineTwo}
            </h2>
            <p className="mt-5 mb-0 text-[clamp(14.5px,1.15vw,16.5px)] leading-[1.65] text-white/80">
              {body}
            </p>
          </div>

          <ul className="stagger grid min-w-[min(100%,280px)] flex-[1_1_340px] list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5 p-0">
            {reasons.map((reason) => (
              <li
                key={reason.title}
                className="flex gap-3.5 rounded-[12px] border border-white/16 bg-white/8 px-[22px] py-5"
              >
                <Icon
                  name={reason.icon}
                  className="text-gold-soft size-6 shrink-0"
                />
                <div>
                  <h3 className="m-0 mb-1.5 text-[15px] font-bold text-white">
                    {reason.title}
                  </h3>
                  <p className="m-0 text-[13px] leading-[1.55] text-white/72">
                    {reason.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
