import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

type SectionLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionLink({ href, children, className }: SectionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "border-gold-ink text-gold-ink hover:text-gold-hover hover:border-gold-hover group press inline-flex min-h-11 items-center gap-2.5 border-b pb-[3px] text-sm font-semibold",
        className,
      )}
    >
      {children}
      <ArrowRight className="advance h-2.5 w-[15px]" />
    </Link>
  );
}
