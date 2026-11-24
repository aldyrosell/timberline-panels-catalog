import Image from "next/image";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { SectionLink } from "@/components/section-link";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type ApplicationsProps = HomeContent["applications"];

export function Applications({ eyebrow, heading, link, items }: ApplicationsProps) {
  return (
    <section id="applications" className="bg-white">
      <Container>
        <div className="py-[clamp(40px,5.5vw,68px)]">
          <div className="mb-[clamp(24px,3vw,36px)] flex flex-wrap items-end justify-between gap-4">
            <div className="reveal max-w-[820px]">
              <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
              <h2 className="font-heading m-0 text-[clamp(26px,3.4vw,42px)] leading-[1.12] font-semibold tracking-[-0.5px]">
                {heading}
              </h2>
            </div>
            <SectionLink href={link.href}>
              {link.label}
            </SectionLink>
          </div>

          <div className="stagger stagger-cards grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(16px,2vw,26px)]">
            {items.map((application) => (
              <figure key={application._id} className="m-0">
                <div className="border-line hover:border-gold-soft lift zoom relative h-[clamp(170px,15vw,200px)] overflow-hidden rounded-[12px] border hover:shadow-[0_12px_28px_rgba(42,33,27,.10)]">
                  <Image
                    src={application.image.url}
                    alt={application.image.alt}
                    {...blurProps(application.image)}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[15px] font-semibold">
                  {application.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
