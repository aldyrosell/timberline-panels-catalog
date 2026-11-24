"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { CloseIcon, Logo, MenuIcon } from "@/components/icons";
import type { Cta, NavItem } from "@/lib/sanity/schema";

type SiteHeaderProps = {
  name: string;
  tagline: string;
  nav: readonly NavItem[];
  cta: Cta;
};

export function SiteHeader({ name, tagline, nav, cta }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-line header-condense sticky top-0 z-40 border-b bg-white">
      <Container className="flex min-h-[76px] items-center gap-[clamp(16px,2.5vw,40px)]">
        <Link
          href="#top"
          className="text-ink nav-enter flex flex-none items-center gap-3"
        >
          <Logo className="size-[34px]" />
          <span className="block">
            <span className="font-heading block text-[19px] leading-[1.1] font-semibold tracking-[-0.2px]">
              {name}
            </span>
            <span className="text-muted-ink mt-[3px] block text-[10.5px] tracking-[0.9px] uppercase">
              {tagline}
            </span>
          </span>
        </Link>

        <div className="flex-1" />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-[clamp(14px,1.8vw,26px)] min-[980px]:flex"
        >
          {nav.map((item) => {
            const isHome = item.href === "#top";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isHome ? "page" : undefined}
                className={
                  isHome
                    ? "text-ink border-gold-ink border-b-[1.5px] pb-[3px] text-sm font-semibold"
                    : "text-ink hover:text-gold-ink nav-underline press text-sm"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={cta.href}
            className="bg-gold-ink hover:bg-gold-hover press inline-flex items-center rounded-[12px] px-5 py-3 text-sm font-semibold text-white"
          >
            {cta.label}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="border-line text-ink grid size-[46px] place-items-center rounded-[12px] border bg-white min-[980px]:hidden"
        >
          {menuOpen ? (
            <CloseIcon className="size-6" />
          ) : (
            <MenuIcon className="size-6" />
          )}
        </button>
      </Container>

      <nav
        id="mobile-menu"
        aria-label="Primary"
        className={cn(
          "mobile-menu absolute inset-x-0 top-full border-line flex flex-col border-t bg-white px-[clamp(20px,5vw,56px)] pt-2 pb-5 min-[980px]:hidden shadow-[0_18px_30px_rgba(42,33,27,.10)]",
          !menuOpen && "invisible -translate-y-2 opacity-0",
        )}
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="border-line text-ink border-b py-3.5 text-base first:font-semibold"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={cta.href}
          onClick={() => setMenuOpen(false)}
          className="bg-gold-ink mt-4 rounded-[12px] px-5 py-[15px] text-center text-[15px] font-semibold text-white"
        >
          {cta.label}
        </Link>
      </nav>
    </header>
  );
}
