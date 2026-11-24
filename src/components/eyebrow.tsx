import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-gold-ink m-0 text-xs font-semibold tracking-[2px] uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
