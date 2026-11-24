"use client";

import { useEffect } from "react";

const ARM = `document.documentElement.dataset.motion="on"`;

export function MotionArm() {
  return <script dangerouslySetInnerHTML={{ __html: ARM }} />;
}

export function MotionReveal() {
  useEffect(() => {
    const root = document.documentElement;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.removeAttribute("data-motion");
      return;
    }

    const targets = [
      ...document.querySelectorAll<HTMLElement>(".reveal, .stagger, .swatches"),
    ].filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);

    if (!targets.length) return;

    for (const el of targets) el.setAttribute("data-armed", "");

    const pending = new Set<Element>(targets);

    const show = (el: Element) => {
      el.setAttribute("data-shown", "");
      observer.unobserve(el);
      pending.delete(el);
    };

    const sweep = () => {
      if (!pending.size) return;

      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      for (const el of [...pending]) {
        if (atBottom || el.getBoundingClientRect().bottom < 0) show(el);
      }
      if (!pending.size) detach();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target);
        }
        sweep();
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sweep();
      });
    };

    function detach() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    for (const el of targets) observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      detach();
      observer.disconnect();
    };
  }, []);

  return null;
}
