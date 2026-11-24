import Image from "next/image";
import { Fragment } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { blurProps } from "@/lib/sanity/image";
import type { HomeContent } from "@/lib/sanity/schema";

type CollectionsProps = HomeContent["collections"];

export function Collections({ eyebrow, heading, body, items, panelImage, panelText }: CollectionsProps) {
  const panelLines = panelText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section id="collections" className="bg-band">
      <div className="flex flex-wrap">
        <div className="min-w-[min(100%,320px)] flex-[1_1_560px]">
          <div className="ml-auto w-full max-w-[calc(1440px*0.72)] py-[clamp(40px,5.5vw,68px)] pr-[clamp(20px,3vw,40px)] pl-[clamp(20px,5vw,56px)]">
            <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
            <h2 className="font-heading m-0 mb-3 text-[clamp(26px,3.4vw,42px)] leading-[1.12] font-semibold tracking-[-0.5px]">
              {heading}
            </h2>
            <p className="text-muted-ink m-0 mb-[clamp(22px,2.6vw,32px)] max-w-[560px] text-[15px] leading-[1.6]">
              {body}
            </p>

            <ul className="swatches grid list-none grid-cols-[repeat(auto-fit,minmax(118px,1fr))] gap-[clamp(12px,1.4vw,18px)] p-0">
              {items.map((finish) => (
                <li key={finish._id}>
                  <div
                    className="relative h-[clamp(76px,7vw,92px)] overflow-hidden rounded-[12px]"
                  >
                    <Image
                      src={finish.image.url}
                      alt={finish.image.alt}
                      {...blurProps(finish.image)}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-[9px] mb-0 text-[12.5px] font-semibold">
                    {finish.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="reveal relative min-h-[clamp(240px,26vw,420px)] min-w-[min(100%,260px)] flex-[1_1_300px]">
          <Image
            src={panelImage.url}
            alt={panelImage.alt}
            {...blurProps(panelImage)}
            fill
            sizes="(max-width: 900px) 100vw, 40vw"
            className="object-cover"
          />
          <p className="pointer-events-none absolute top-1/2 right-[clamp(18px,2.6vw,36px)] m-0 -translate-y-1/2 text-right text-[clamp(14px,1.5vw,19px)] leading-[1.75] font-bold tracking-[2px] text-white uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_2px_18px_rgba(0,0,0,0.7)]">
            {panelLines.map((line, index) => (
              <Fragment key={index}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
