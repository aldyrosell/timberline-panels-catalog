import { useId } from "react";
import { Container } from "@/components/container";
import { ArrowRight } from "@/components/icons";
import { SelectMenu } from "@/components/select-menu";
import type { HomeContent } from "@/lib/sanity/schema";

type MaterialFinderProps = HomeContent["materialFinder"];

export function MaterialFinder({ heading, fields, submitLabel }: MaterialFinderProps) {
  const fieldId = useId();

  return (
    <section className="border-line border-b bg-white">
      <Container>
        <div className="py-[clamp(26px,3.4vw,44px)]">
          <h2 className="font-heading m-0 mb-5 text-[clamp(20px,2vw,24px)] font-semibold">
            {heading}
          </h2>

          <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] items-end gap-4">
            {fields.map((field, index) => (
              <div key={field.label}>
                <label
                  id={`${fieldId}-${index}-label`}
                  htmlFor={`${fieldId}-${index}`}
                  className="text-muted-ink mb-[7px] block text-xs"
                >
                  {field.label}
                </label>
                <SelectMenu
                  id={`${fieldId}-${index}`}
                  labelId={`${fieldId}-${index}-label`}
                  placeholder={field.placeholder}
                  options={field.options}
                  className="border-line bg-cream text-ink min-h-[46px] gap-2 rounded-[12px] border pr-3.5 pl-3 text-sm"
                />
              </div>
            ))}

            <button
              type="button"
              className="bg-deep hover:bg-deep-hover inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-[12px] px-6 text-sm font-semibold text-white"
            >
              {submitLabel}
              <ArrowRight className="h-2.5 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
