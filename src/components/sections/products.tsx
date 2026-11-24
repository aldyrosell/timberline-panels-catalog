import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { ArrowRight } from "@/components/icons";
import { SectionLink } from "@/components/section-link";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type ProductsProps = HomeContent["products"];

export function Products({ eyebrow, heading, link, cardCtaLabel, items }: ProductsProps) {
  return (
    <section id="products" className="bg-white">
      <Container>
        <div className="py-[clamp(40px,5.5vw,68px)]">
          <div className="mb-[clamp(24px,3vw,36px)] flex flex-wrap items-end justify-between gap-4">
            <div className="reveal max-w-[820px]">
              <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
              <h2 className="font-heading m-0 text-[clamp(26px,3.4vw,42px)] leading-[1.12] font-semibold tracking-[-0.5px]">
                {heading}
              </h2>
            </div>
            <SectionLink href={link.href}>{link.label}</SectionLink>
          </div>

          <ul className="stagger stagger-cards grid list-none grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(16px,2vw,26px)] p-0">
            {items.map((product) => (
              <li
                key={product._id}
                className="border-line hover:border-gold-soft lift zoom overflow-hidden rounded-[12px] border bg-white hover:shadow-[0_12px_28px_rgba(42,33,27,.10)]"
              >
                <div className="relative h-[clamp(170px,16vw,210px)] overflow-hidden">
                  <Image
                    src={product.image.url}
                    alt={product.image.alt}
                    {...blurProps(product.image)}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="px-[22px] pt-5 pb-6">
                  <h3 className="font-heading m-0 mb-2 text-[19px] font-semibold">
                    {product.title}
                  </h3>
                  <p className="text-muted-ink m-0 mb-4 text-sm leading-[1.6]">
                    {product.description}
                  </p>
                  <Link
                    href={link.href}
                    className="text-gold-ink hover:text-gold-hover inline-flex min-h-11 items-center gap-2 text-[13.5px] font-semibold"
                  >
                    {cardCtaLabel}
                    <span className="sr-only"> {product.title}</span>
                    <ArrowRight className="h-2.5 w-[15px]" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
