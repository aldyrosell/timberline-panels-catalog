# Scroll-reveal motion system

A portable, copy-paste motion layer for content sites: scroll-triggered reveals, a staggered
cascade, and a hover/feedback layer — with no motion library and no client boundary on the
sections themselves.

This file is self-contained. Everything needed to install it is here.

---

## What you get

| | |
|---|---|
| Reveals | blocks arrive on scroll, one-shot, played on a timer |
| Stagger | a group's children cascade, delay capped so it never trails |
| Hero / nav | on-load entrance that does not wait for a scroll |
| Interaction | card lift, photo zoom, arrow advance, button press, nav underline, header shadow |
| Scrubbed | one optional scroll-linked effect for where scroll position genuinely is the variable |

Cost: ~250 lines of CSS, one ~90-line component, zero dependencies.

## Assumptions

Built and verified on **Next.js App Router + React 19 + Tailwind v4 + static export**, Chrome 138.

Most of it is plain CSS and DOM and will port anywhere. Three things are stack-specific and are
tagged in the [Traps](#traps) section:

- **React** — traps 3, 5, 12, 13 concern hydration and the CSS cascade around framework-rendered
  markup. Non-React stacks can ignore trap 3 and 5.
- **Tailwind v4** — trap 4 (the `oklab()` colour bug) and the cursor rule exist because of v4's
  Preflight and colour handling. Tailwind v3 and plain CSS differ.
- **`animation-timeline`** — the scrubbed effect and header shadow need Chrome/Edge/Safari 26+.
  Both are behind `@supports`, so unsupported browsers simply get the static design.

Nothing here requires a framework for the reveals themselves. If you are not on React, drop
`MotionReveal` into a plain `<script type="module">` that runs after DOM parse and skip trap 3.

---

## Install

Do these in order. Step 3 is the one people skip and then wonder why the page flashes.

### 1. Tokens

`--settle` is the easing used by everything. Exponential ease-out: a confident arrival with no
overshoot. Do not substitute a bounce or elastic curve — they read as toy-like on content sites.

```css
:root {
  --settle: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Tailwind v4 users who want `ease-settle` as a utility, add to `@theme inline`:

```css
@theme inline {
  --ease-settle: var(--settle);
}
```

### 2. The component

Two exports. `MotionArm` is an inline `<script>` for the document head; `MotionReveal` is a client
component that renders nothing.

```tsx
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
      ...document.querySelectorAll<HTMLElement>(".reveal, .stagger, .path"),
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
```

Add `.path` to the selector only if you use the sequence variant; add your own focal class there
too (the source project used `.swatches`, `.tiles`, `.plates` on different sites).

### 3. Mount it

`MotionArm` must be in `<head>`, before first paint. `suppressHydrationWarning` on `<html>` is
required because the script sets an attribute React did not render.

```tsx
<html lang="en" suppressHydrationWarning>
  <head>
    <MotionArm />
  </head>
  <body>
    {children}
    <MotionReveal />
  </body>
</html>
```

### 4. The stylesheet

Paste this after your base layer. Rename the `m-` keyframes if they collide.

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal[data-armed] {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 560ms var(--settle),
      transform 560ms var(--settle),
      translate 260ms var(--settle),
      scale 520ms var(--settle);
  }

  .reveal[data-armed][data-shown] {
    opacity: 1;
    transform: none;
  }

  .reveal-left[data-armed] {
    transform: translateX(-28px);
  }
  .reveal-right[data-armed] {
    transform: translateX(28px);
  }
  .reveal-scale[data-armed] {
    transform: translateY(18px) scale(0.965);
  }
  .reveal-soft[data-armed] {
    transform: translateY(14px);
    filter: blur(5px);
    transition:
      opacity 640ms var(--settle),
      transform 640ms var(--settle),
      filter 640ms var(--settle),
      translate 260ms var(--settle),
      scale 520ms var(--settle);
  }
  .reveal-soft[data-armed][data-shown] {
    filter: none;
  }

  .stagger[data-armed] > * {
    opacity: 0;
    transform: translateY(26px);
    transition:
      opacity 560ms var(--settle),
      transform 560ms var(--settle),
      translate 260ms var(--settle),
      scale 520ms var(--settle);
  }

  .stagger[data-armed][data-shown] > *,
  .reveal[data-armed][data-shown] .stagger > * {
    opacity: 1;
    transform: none;
  }

  .stagger[data-armed] > *:nth-child(2)  { transition-delay:  85ms; }
  .stagger[data-armed] > *:nth-child(3)  { transition-delay: 170ms; }
  .stagger[data-armed] > *:nth-child(4)  { transition-delay: 255ms; }
  .stagger[data-armed] > *:nth-child(5)  { transition-delay: 340ms; }
  .stagger[data-armed] > *:nth-child(6)  { transition-delay: 425ms; }
  .stagger[data-armed] > *:nth-child(n + 7) { transition-delay: 510ms; }

  .stagger-cards[data-armed] > * {
    transform: translateY(30px) scale(0.975);
  }

  @keyframes m-enter-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: none; }
  }

  @keyframes m-enter-down {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: none; }
  }

  [data-motion="on"] .hero-enter > * {
    animation: m-enter-up 620ms var(--settle) backwards;
  }
  [data-motion="on"] .hero-enter > :nth-child(2) { animation-delay:  80ms; }
  [data-motion="on"] .hero-enter > :nth-child(3) { animation-delay: 160ms; }
  [data-motion="on"] .hero-enter > :nth-child(4) { animation-delay: 240ms; }
  [data-motion="on"] .hero-enter > :nth-child(5) { animation-delay: 320ms; }

  [data-motion="on"] .nav-enter {
    animation: m-enter-down 460ms var(--settle) backwards;
  }

  @supports (animation-timeline: view()) {
    @keyframes m-frame {
      from { transform: scale(1.05); }
      to   { transform: scale(1); }
    }

    .frame-settle {
      animation: m-frame var(--settle) forwards;
      animation-timeline: view();
      animation-range-start: cover 0%;
      animation-range-end: cover 50%;
    }
  }

  @supports (animation-timeline: scroll()) {
    @keyframes m-header-condense {
      to {
        box-shadow:
          0 1px 0 rgba(0, 0, 0, 0.06),
          0 8px 24px rgba(0, 0, 0, 0.07);
      }
    }

    .header-condense {
      animation: m-header-condense 1ms linear both;
      animation-timeline: scroll();
      animation-range-start: 0px;
      animation-range-end: 120px;
    }
  }

  .advance {
    transition: translate 160ms var(--settle);
  }
  .group:hover .advance,
  .group:focus-visible .advance {
    translate: 4px 0;
  }

  .lift {
    transition:
      translate 260ms var(--settle),
      box-shadow 260ms var(--settle),
      border-color 260ms var(--settle);
  }
  .lift:hover {
    translate: 0 -4px;
  }

  .zoom img {
    transition: scale 520ms var(--settle);
  }
  .zoom:hover img {
    scale: 1.045;
  }

  .press {
    transition:
      background-color 160ms var(--settle),
      border-color 160ms var(--settle),
      color 160ms var(--settle),
      scale 120ms var(--settle);
  }
  .press:active {
    scale: 0.985;
  }

  .nav-underline::after {
    transition: transform 240ms var(--settle);
  }

  .menu-open {
    animation: m-enter-down 260ms var(--settle) backwards;
  }

  footer {
    overflow: clip;
  }
}

.nav-underline {
  position: relative;
}
.nav-underline::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
}
.nav-underline:hover::after,
.nav-underline:focus-visible::after {
  transform: scaleX(1);
}

button:not(:disabled),
[role="button"],
select {
  cursor: pointer;
}

@media print {
  .reveal,
  .stagger > *,
  .hero-enter > *,
  .nav-enter {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    clip-path: none !important;
    animation: none !important;
  }
  .frame-settle {
    animation: none !important;
  }
}
```

---

## The arming rule

The single most important design decision here. Get it wrong and you get either hidden text or
dead animations.

**Nothing is hidden by the stylesheet alone.** A reveal only goes to `opacity: 0` once the script
puts `data-armed` on it, and the script arms **only elements below the fold at load**
(`top > innerHeight * 0.92`).

What that buys:

- Anything on screen at load is never hidden — no flash, no page that opens with choreography, no
  LCP risk from the hero.
- A renderer tall enough to see the whole page — a crawler, a print job, a giant viewport — arms
  **nothing** and reads every word.
- No JS, blocked JS, or a thrown error means the page renders exactly as authored.
- Only content the visitor has to scroll to is ever at opacity 0.

Measured on the source project: **0% of page text hidden at rest.** An earlier attempt using
`animation-fill-mode: both` hid **62%**.

### Attributes, not classes

The script sets `data-armed` / `data-shown`, never a class. See [trap 5](#trap-5--classname-mutation-gets-reconciled-away-react).

### No blanket timeout

Do **not** add a "reveal everything after N seconds" backstop. See
[trap 2](#trap-2--animations-only-play-on-refresh-never-on-scroll-universal). Arming below-fold
content only is what makes a backstop unnecessary; the two genuine gaps are handled by `sweep()`.

---

## Class reference

### Reveal

| Class | Effect |
|---|---|
| `reveal` | opacity 0 → 1, translateY(24px) → 0, 560ms |
| `reveal-left` / `reveal-right` | arrives from the side instead of rising |
| `reveal-scale` | translateY(18px) + scale(0.965) |
| `reveal-soft` | adds blur(5px) → 0 |
| `stagger` | children cascade, +85ms each, **capped at the 7th child** |
| `stagger-cards` | heavier variant for card grids |
| `hero-enter` | on-load cascade for the hero's children |
| `nav-enter` | on-load drop-in for the header |
| `frame-settle` | scroll-scrubbed photo scale, pure CSS, no script |

**Never put `reveal` and `stagger` on the same element.** `reveal` fades the container while
`stagger` fades the children; they compound into mush. Use `reveal` for a block that arrives as one
thing, `stagger` alone for a group that cascades.

### Interaction

`advance` · `lift` · `zoom` · `press` · `nav-underline` · `menu-open` · `header-condense`

---

## Applying it

### Card hover is a FOUR-part recipe

A card with only `lift` is not done:

| Part | Class | Applied to |
|---|---|---|
| 1. lift | `lift` | the card root |
| 2. photo zoom | `zoom` | the card root — CSS targets `.zoom img` |
| 3. border tint | `hover:border-<accent>` | the card root |
| 4. elevation | `hover:shadow-[...]` | the card root |

Plus **the image wrapper needs `overflow-hidden`**, or the zoom escapes the card's corners.

A card with no photograph takes 1, 3, 4 and omits `zoom`. A card with no border omits 3.

### What gets what

| Area | Treatment |
|---|---|
| Header | `nav-enter` on brand + nav · `header-condense` · `nav-underline` on links · `menu-open` |
| Hero | `hero-enter` on the content column. **Never the hero image** — it is the LCP element |
| Card grids | `stagger stagger-cards` + the four-part recipe per card |
| Section headings | `reveal` |
| Stat / logo bands | `stagger` |
| Two-column blocks | image `reveal reveal-left` + `frame-settle` · text column `stagger` |
| **Full-bleed photo bands** | `reveal` on the content column — the most-missed block, see [trap 8](#trap-8--the-full-bleed-photo-band-gets-skipped-every-time-universal) |
| **Footer** | four things: `stagger` on link columns · `reveal` on the legal bar · `press` on every link · `lift` on socials |
| Buttons / links | `press`, `advance` |

### Coverage audit — run it, do not eyeball it

```bash
for f in src/components/sections/*.tsx; do
  grep -qE "reveal|stagger|hero-enter|nav-enter|frame-settle|header-condense" "$f" || basename "$f"
done
```

Wrappers and primitives (container, icon, json-ld) legitimately print. Any **section** that prints
is a miss.

This audit is **file-level** and has a blind spot: a file passes if *any* element in it has a
class, so a section whose card grid is done but whose heading column is bare still passes. After it
comes back clean, open every full-bleed band and confirm its content column carries `reveal`.

### Tuning per site

Vary these so two sites built from this file do not animate identically:

| Knob | Range used |
|---|---|
| reveal duration | 420ms (crisp) – 680ms (luxurious) |
| stagger step | 65ms – 100ms |
| travel distance | 20px – 32px |
| lift | 3px – 5px |
| zoom | 1.045 – 1.06 |

Give each site one **focal moment** — a single authored sequence that belongs to that content, not
a generic fade. Examples from the source project: material swatches revealed by a `clip-path` wipe;
photo tiles mask-wiping bottom-up; a four-step path whose marks resolve in reading order. Build it
as its own class alongside `stagger`, and add it to the observer's selector.

---

## Traps

Every one of these shipped into a browser and had to be diagnosed. Tags: **[universal]**,
**[React]**, **[Tailwind v4]**.

### Trap 1 — `entry` ranges are element-scaled **[universal]**
A `view()` `entry` range is only as long as the element itself, so a 64px row resolves in 64px of
scroll and reads as a snap. Use `cover`, which spans viewport + element. Applies to scrubbed motion
only (`frame-settle`).

### Trap 2 — animations only play on refresh, never on scroll **[universal]**
**Symptom:** a section animates on load; scroll up and back and it never animates again.
**Cause:** a `setTimeout` backstop force-revealing every element N seconds after load, regardless
of scroll. By the time the visitor scrolls down, everything is already shown.
**Fix:** no blanket timeout. Arm below-fold content only; handle the real gaps in `sweep()`.

### Trap 3 — hydration mismatch from touching the DOM before React **[React]**
**Symptom:** `A tree hydrated but some attributes ... didn't match`.
**Cause:** an inline script setting `data-armed` before hydration. **Next hydrates the whole tree,
not just Client Components**, so this hits plain Server Component sections too.
**Fix:** run the reveal logic in a `useEffect`. Only the tiny `data-motion` arming script stays
inline, with `suppressHydrationWarning` on `<html>`.

### Trap 4 — the header turns bright yellow on scroll **[Tailwind v4]**
**Cause:** animating `background-color` to an `rgba()` keyframe from a Tailwind `bg-white/95` base,
which computes to **`oklab()`**. Chrome interpolates in oklab and reads the sRGB channels as oklab
`a`/`b`, which ramp to 255 against a valid range of about −0.4…0.4:
```
scrollY=0   -> oklab(0.999994  0.0000455678  0.0000200868 / 0.95)
scrollY=120 -> oklab(1  255  255 / 0.921569)
```
**Fix:** animate `box-shadow` only. Never animate `background-color` from a Tailwind `bg-*/opacity`
value. If a background must animate, write both ends in the same colour space.

### Trap 5 — `className` mutation gets reconciled away **[React]**
Adding a class from script to an element inside a Client Component is unsafe even ignoring
hydration: any later re-render reconciles it straight back off and silently un-reveals content. Use
attributes React never rendered.

### Trap 6 — IntersectionObserver misses two cases **[universal]**
IO only reports threshold *crossings*. Both of these strand content permanently:
1. **Skipped past** — anchor jump, End key, browser scroll restoration.
2. **The last elements on the page** — a negative bottom `rootMargin` pulls the trigger line up
   from the viewport bottom, and anything in that band can never reach it.

**Fix:** `sweep()` reveals anything with `bottom < 0`, plus everything remaining once
`scrollY + innerHeight >= scrollHeight - 2`.

### Trap 7 — the sweep must not live in the observer callback **[universal]**
**Symptom:** the footer legal line stays invisible when you scroll to it but appears after a
refresh.
**Cause:** `sweep()` called only from the IO callback, which fires only on a *crossing*. Arrive at
the bottom after the last crossing and it never runs.
**Why it survives testing:** a `scrollTo`-based test keeps firing crossings and masks it. Real
wheel scrolling does not. **Test with `page.mouse.wheel`, at more than one viewport height.**
**Fix:** drive `sweep()` from a passive rAF-throttled `scroll` + `resize` listener that detaches
when `pending` empties.

### Trap 8 — the full-bleed photo band gets skipped every time **[universal]**
**What it is:** a background photograph spanning the entire viewport width, dark scrim over it,
content on top (eyebrow, large heading, body, buttons, often a pull-quote). Usually sits between
two normal sections or directly above the footer as the closing CTA.
**Cause, two of them:** motion applied through a shared heading component (bands build their
heading inline and import nothing), and classes applied by pattern-matching `grid`/`<ul>`
containers (bands are flex columns of loose children).
**Symptom:** the whole band sits dead while grids above and below animate. Easy to miss because a
full-bleed photo already looks finished.
**Fix:** `reveal` on the band's content column. Enumerate section files; never rely on a shared
component for coverage.

### Trap 9 — the footer legal bar gets half-applied **[universal]**
The footer is **two** blocks — the link-column grid and the legal/copyright row below the rule —
plus its own links and socials. `stagger` on the grid alone looks finished and leaves the rest
dead. Needs all four: `stagger` · `reveal` · `press` · `lift`.

### Trap 10 — a white strip flashes below the footer **[universal]**
**Cause:** `transform: translateY(+Npx)` **extends the document's scrollable overflow**. While the
last elements sit armed at a positive translate, the document is N pixels taller than its content,
so you can scroll past the footer onto the body background. Measured: a 20px reveal translate
produced exactly 20px of extra document height.
**Why it hides:** the hazard is the *contrast*, not the translate. Every site with a downward
translate has the gap; you only see it where a **dark footer sits on a light body**. Do not treat
"looks fine" as "does not have it".
**Fix:** `footer { overflow: clip }` — contains descendants' transform overflow without creating a
scroll container or breaking `position: sticky` (`hidden` would do both).
**Test:**
```js
const armed = document.documentElement.scrollHeight;
document.querySelectorAll("[data-armed]").forEach(e => e.setAttribute("data-shown", ""));
// ~1.4s later — must equal `armed`:
document.documentElement.scrollHeight;
```

### Trap 11 — the interaction layer gets left behind when porting **[universal]**
**Symptom:** reveals all work; cards are inert and buttons show an arrow cursor.
**Cause:** porting focuses on reveal classes because that is what the verification script measures.
A site with **zero** hover states passes every reveal check cleanly.
**Fix:** treat the interaction layer as a separate, explicitly audited deliverable. The card-hover
audit and the cursor rule will not be caught by reveal verification.

### Trap 12 — the reveal's resolved state outranks every hover transform **[React / CSS cascade]**
**Symptom:** a card has `lift`, the class is present, the rule exists — nothing happens on hover.
**Cause: specificity.**
```
.stagger[data-armed][data-shown] > *   →  (0,3,0)   transform: none
.lift:hover                            →  (0,2,0)   transform: translateY(-4px)
```
**Fix: use the independent transform properties**, which do not collide with `transform` at all:

| Effect | Wrong | Right |
|---|---|---|
| card lift | `transform: translateY(-4px)` | `translate: 0 -4px` |
| image zoom | `transform: scale(1.05)` | `scale: 1.05` |
| button press | `transform: scale(0.985)` | `scale: 0.985` |

`transform`, `translate`, `scale` and `rotate` are separate properties that compose, so the reveal
can own `transform` while hover owns `translate`/`scale`.

### Trap 13 — the reveal also eats the hover's `transition`, so hovers snap **[CSS cascade]**
**Symptom:** hover works but **instantly**, with no easing.
**Cause:** the same collision one level deeper, and it survives the trap 12 fix. `transition` is a
shorthand — whichever rule wins **replaces the whole list**. `.stagger[data-armed] > *` (0,2,0)
declares `transition: opacity, transform` and discards `.lift`'s `transition: translate` (0,1,0).
The value still changes; it just changes in one frame. Measured before the fix: **every card on
every site** read `transition-property: opacity, transform` — no site had an animated lift.
**Fix:** the reveal rule owns the element's `transition`, so it must declare **everything that
element transitions** — append `translate` and `scale` to every reveal transition list. This is
already done in the stylesheet above.
**Verifying:** value-diffing reports a pass for an instant snap — that is how this shipped past the
first check. Use the Web Animations API, which returns nothing when there is no transition:
```js
await el.hover();                       // ~25ms later:
el.getAnimations().map(a => ({ p: a.transitionProperty, d: a.effect.getTiming().duration }));
// [] means the hover is NOT animating. Expect e.g. [{ p: "translate", d: 260 }].
```
Sampling computed values mid-transition also works but needs care: `cubic-bezier(0.16, 1, 0.3, 1)`
front-loads heavily — at 70ms of a 260ms transition it is already ~83% complete, which reads as
"instant" against a naive threshold.

---

## Verification

Run all of it. Items 6, 7, 10 and 11 each exist because something shipped past a lighter check.

1. Typecheck, lint, build.
2. **Console clean** — zero errors and warnings, after interacting *and* scrolling. Re-run after
   every mechanism change.
3. **Layout parity** — compare every `section/h1/h2/h3/li/figure/p/a/button/ul/ol` box, motion vs
   reduced-motion, at desktop and mobile widths. Must be identical: motion may not move layout.
4. **No-JS** — load with JavaScript disabled; every reveal element computes to opacity 1.
5. **Reduced motion** — zero elements in motion mid-scroll; hover travel gone.
6. **Stranding** — jump to bottom *and* wheel-scroll; nothing left hidden in either.
7. **Idle test** — sit at the top 8s, then scroll. Reveals must still play (trap 2).
8. **Hidden-at-rest** — measure text at opacity 0 before scrolling. Target 0%.
9. **Document height constant** — armed vs resolved `scrollHeight` must match (trap 10).
10. **Hovers actually animate** — `el.getAnimations()` ~25ms after a real pointer hover. An empty
    array means it snaps. "Computed style changed" is **not** sufficient (trap 13).
11. **Cursor** — every `<button>` and `<select>` computes `cursor: pointer`.
12. **Performance** — LCP against a pre-change baseline measured the same way. Budget ≤ 2.5s.
13. **Lighthouse** — accessibility, best-practices and SEO must not regress.

### Performance expectation

On the source project all four sites got **faster**, 1484–2224ms → 1456–2120ms under real
throttling (150ms RTT / 1.6 Mbps / 4× CPU, median of 5). That is not motion speeding anything up —
it is hero text no longer counting as an LCP candidate while it fades, leaving the hero image alone
as the reported element. CLS stayed 0 and all accessibility/SEO scores held.

The key constraint that makes this safe: **the hero image never animates.**
