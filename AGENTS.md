# Timberline Panels: Coding Instructions

A laminates website with a filterable product catalogue, a sample-request cart and quote requests, run from an admin panel. A demo app: seeded content, reset hourly when `DEMO_MODE=true`.

**Current state:** the code is still the original marketing site on Sanity. `docs_development/PLAN.md`
converts it step by step. The rules below describe the finished app. Until a build step replaces
something (Sanity, its `NEXT_PUBLIC_SANITY_*` variables, the missing `test` script), work with what is
there.

## Instruction Hierarchy

1. This file is the primary instruction set. It is self-sufficient for routine work.
2. `docs_development/PLAN.md` is the plan: what the app does, the data model, every decision, and the
   build steps. Read it before starting a build step or changing a feature.
3. `docs_development/REACT_NEXT_ENGINEERING_GUIDE.md` is the deep reference for React, Next.js,
   TypeScript, validation, accessibility and testing.
4. `docs_development/MOTION-SYSTEM.md` is the reference for the scroll-reveal motion already in the site.
5. Read 2–4 on demand, when a task needs them. Do not load them for routine work.
6. Existing repository conventions outrank the guides. When several valid approaches exist, use the one
   already in the codebase.
7. `CLAUDE.md` mirrors this file for Claude Code. If conventions change here, keep it in sync.

## Fixed Decisions

- **Demo only.** No legal, trademark, domain or other real-business concerns.
- **No payments of any kind.** No gateway, no payment records, no shop, no online ordering.
- **Follow EcommerceApp and BookingApp** (the owner's Laravel apps). PLAN.md records every pattern taken
  from them. Do not add features neither has.
- **Hosting is out of scope.** Local Docker only.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Zod · PostgreSQL 18
· Drizzle · Better Auth · Resend + React Email · pg-boss · Vitest · Playwright · ESLint · Prettier ·
Docker. npm is the package manager.

## Working Method

- Read existing code before changing it. Match the current structure and naming.
- Reuse existing components, helpers and types. Do not duplicate formatting, validation or layout logic.
- Prefer small, focused changes. Preserve existing behavior unless the task requires changing it.
- Do not add a dependency unless clearly necessary. Check `package.json` first.
- A schema change is never complete on its own: the Drizzle schema, the migration, the seed, the admin
  form and the components that read it land together.
- Never commit secrets. Every environment variable is server-only; none takes the `NEXT_PUBLIC_` prefix.

## Rendering and Data

- Public marketing pages are **static**, cached with `'use cache'` + `cacheTag()`. Admin saves refresh them
  with `updateTag()` inside the Server Action. A route that silently becomes dynamic is a regression.
- Booking, request, account and admin pages are dynamic.
- Pages and layouts fetch once and pass **explicit props** down. Section components take plain props and
  stay Server Components.
- Add `"use client"` only for interactivity, and keep the client boundary small.
- **Every admin page and every Server Action checks the session and the role itself**, through
  `src/lib/roles.ts`. Server Actions are public endpoints; a layout check alone protects nothing.
- Validate every form and Server Action input with Zod on the server. Client validation is only for UX.
- All dates and times are worked out in **Asia/Manila** time through `src/lib/time.ts`.

## Content

- Every visible string, image and piece of business data comes from the database and is edited in the
  admin. If you're typing copy into a `.tsx` file, it belongs in a table instead.
- `src/config/site.ts` merges the code-owned config (`url`, routes) with `site_settings`. Metadata,
  JSON-LD, sitemap and contact blocks all read that merged object. **Never retype the business name,
  address or phone inline.**
- Editors control content, never appearance. No fields for colors, spacing or alignment.

## Images

- Image rows store `path` + `disk` (`bundled` or `uploads`), never a URL. Use `imageSrc()`.
- Demo photos are bundled in `src/assets/images/` and never copied to `storage/uploads/`.
- Always set `width` and `height`. `preload` + `fetchPriority="high"` on the LCP image only.
- `alt` is required unless the image is marked decorative.

## SEO

- Every public route has a unique title and description, and a canonical with a trailing slash.
  `trailingSlash: true` stays.
- JSON-LD is built from the same data as the markup. Never invent ratings, reviews or awards.
- Exactly one `<h1>` per route. No skipped heading levels. Landmarks: `<header>`, `<nav>`, `<main>`,
  `<footer>`.
- Internal links use `next/link`, root-relative paths and descriptive anchor text.

## Styling

- Tailwind v4 theme tokens live in `@theme` in `src/app/globals.css`. Use tokens, not hex values.
- shadcn/ui components are owned source in `src/components/ui/`. Add them on demand.
- Use `cn()` from `src/lib/utils.ts`. Mobile-first. Respect `prefers-reduced-motion`.

## Running It

Docker, behind the shared nginx, at http://timberline.localhost. Put `docker exec timberline-panels-catalog-app-1` in front of
any `npm` command. First-time setup is in PLAN.md under "Docker, local development".

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

- Read the route table `npm run build` prints. Every public marketing route must still be static.
- Never state that a check passed unless you ran it and read the output. Name anything you could not
  check (visual, responsive, accessibility, browser flows) as unverified.

## Reporting

When finishing a task, report what changed, the files, the exact commands run with their results, and
anything left unverified or still to do.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
