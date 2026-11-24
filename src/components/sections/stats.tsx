import { Container } from "@/components/container";
import { Icon } from "@/components/icons";
import type { HomeContent } from "@/lib/sanity/schema";

type StatsProps = HomeContent["stats"];

export function Stats({ items }: StatsProps) {
  return (
    <section className="bg-deep">
      <Container>
        <ul className="stagger grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(20px,2.6vw,32px)] p-0 py-[clamp(28px,3.4vw,44px)]">
          {items.map((stat) => (
            <li key={stat.label} className="flex items-center gap-4">
              <Icon
                name={stat.icon}
                className="text-gold-soft size-[54px] shrink-0"
              />
              <div>
                <p className="font-heading m-0 text-[clamp(24px,2.4vw,30px)] leading-[1.1] font-semibold text-white">
                  {stat.value}
                </p>
                <p className="m-0 mt-1 text-[13px] text-white/78">
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
