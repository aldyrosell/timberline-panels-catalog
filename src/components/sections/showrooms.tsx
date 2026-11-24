import Image from "next/image";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { SectionLink } from "@/components/section-link";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type ShowroomsProps = HomeContent["showrooms"];

export function Showrooms({ eyebrow, heading, link, items }: ShowroomsProps) {
  return (
    <section className="bg-band">
      <Container>
        <div className="py-[clamp(40px,5.5vw,68px)]">
          <div className="mb-[clamp(22px,2.6vw,32px)] flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow className="mb-2.5">
                {eyebrow}
              </Eyebrow>
              <h2 className="font-heading m-0 text-[clamp(26px,3.4vw,42px)] leading-[1.12] font-semibold tracking-[-0.5px]">
                {heading}
              </h2>
            </div>
            <SectionLink href={link.href}>{link.label}</SectionLink>
          </div>

          <ul className="stagger stagger-cards grid list-none grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(16px,2vw,24px)] p-0">
            {items.map((showroom) => (
              <li
                key={showroom._id}
                className="border-line hover:border-gold-soft lift zoom overflow-hidden rounded-[12px] border bg-white hover:shadow-[0_12px_28px_rgba(42,33,27,.10)]"
              >
                <div className="relative h-[clamp(150px,13vw,180px)] overflow-hidden">
                  <Image
                    src={showroom.image.url}
                    alt={showroom.image.alt}
                    {...blurProps(showroom.image)}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="px-5 pt-[18px] pb-5">
                  <h3 className="m-0 mb-1.5 text-base font-bold">
                    {showroom.name}
                  </h3>
                  <p className="text-muted-ink m-0 mb-1 text-[13px]">
                    {showroom.kind}
                  </p>
                  <p className="text-muted-ink m-0 text-[13px]">
                    {showroom.hours}
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
