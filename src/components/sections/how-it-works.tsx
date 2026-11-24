import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import type { HomeContent } from "@/lib/sanity/schema";

type HowItWorksProps = HomeContent["howItWorks"];

export function HowItWorks({ eyebrow, heading, steps }: HowItWorksProps) {
  return (
    <section className="border-line border-t bg-white">
      <Container>
        <div className="reveal py-[clamp(40px,5.5vw,68px)]">
          <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
          <h2 className="font-heading m-0 mb-[clamp(24px,3vw,36px)] text-[clamp(26px,3.4vw,42px)] leading-[1.12] font-semibold tracking-[-0.5px]">
            {heading}
          </h2>

          <ol className="stagger stagger-cards m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(16px,2vw,24px)] p-0">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="border-line bg-cream rounded-[12px] border px-6 pt-6 pb-[26px]"
              >
                <div className="mb-3.5 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="bg-gold-ink font-heading inline-flex size-10 items-center justify-center rounded-full text-[17px] font-semibold text-white"
                  >
                    {index + 1}
                  </span>
                </div>
                <h3 className="m-0 mb-2 text-base font-bold">{step.title}</h3>
                <p className="text-muted-ink m-0 text-[13.5px] leading-[1.6]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
