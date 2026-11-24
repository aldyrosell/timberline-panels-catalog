import { Container } from "@/components/container";
import { Icon } from "@/components/icons";
import type { HomeContent } from "@/lib/sanity/schema";

type ValuePropsProps = HomeContent["valueProps"];

export function ValueProps({ items }: ValuePropsProps) {
  return (
    <section className="bg-band border-line border-b">
      <Container>
        <ul className="stagger grid list-none grid-cols-[repeat(auto-fit,minmax(230px,1fr))] justify-items-center gap-[clamp(24px,3vw,40px)] p-0 py-[clamp(40px,5.5vw,68px)] text-center">
          {items.map((prop) => (
            <li key={prop.title} className="max-w-[340px]">
              <Icon name={prop.icon} className="text-gold-ink mx-auto size-[30px]" />
              <h3 className="font-heading mt-4 mb-2 text-[19px] font-semibold">
                {prop.title}
              </h3>
              <p className="text-muted-ink m-0 text-[14.5px] leading-[1.6]">
                {prop.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
