# Timberline Panels: Plan

Written 2026-11-24. **Status: plan only. Nothing has been built yet.** The code in this repo is the
current marketing site, still on Sanity. This plan turns it into the full app.

## Summary

A laminates website with a filterable product catalogue, a sample-request cart and quote requests, run from an admin panel.

This repo starts from the existing **Grainora Surfaces** marketing site (Next.js + Sanity). The design,
components, SEO and motion are already here and stay. Sanity is replaced by a PostgreSQL database and an
admin panel inside the app, and the brand is renamed to **Timberline Panels**.

**What it does:**

- Visitors browse the catalogue filtered by product type, finish, thickness and application.
- The home page's **Find the Right Material** bar opens the catalogue already filtered by those choices.
- Customers add products to a sample cart and send a sample request.
- Customers send quote requests for projects.
- An admin can mark a customer as a dealer. Dealers see dealer prices.
- It is not a shop. Nothing is bought or paid for in the app.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, PostgreSQL 18 with Drizzle,
Better Auth, Resend, pg-boss, Vitest, Playwright, ESLint and Prettier. Local development runs in Docker.

**Also included:** customer accounts, staff roles with admin invites, emails, spam protection, an audit
log, legal pages, bundled demo images, an hourly demo reset, and seeded logins for every role.

### Fixed decisions: do not reopen

These were settled with the owner. Do not suggest otherwise.

1. **This is a demo**, like the owner's EcommerceApp and BookingApp. It shows seeded sample content, and
   the public demo resets every hour. No real business runs on it. Do not raise legal compliance,
   trademarks, domains or other real-business concerns.
2. **No payments of any kind**: no payment gateway, no recorded payments, no payments module, no online
   ordering, no shop.
3. **Follow EcommerceApp and BookingApp.** Every pattern taken from them is written into this plan. Do not
   add features neither has. For example: no "delete my account", no "download my data", no consent
   checkbox.
4. **The name is final:** Timberline Panels.
5. **Hosting is out of scope.** Only local Docker matters for now.

### For an agent picking this up

- This repo is standalone. Everything needed is in it: this plan, the coding guides in
  `docs_development/`, and the old Sanity content model in `docs_development/sanity-reference/`.
- On the owner's PC, EcommerceApp and BookingApp (Laravel 13 + Inertia + React) sit next to this repo at
  `../EcommerceApp` and `../BookingApp`. They're optional extras: this plan already describes what to
  take from them. If something isn't covered here, ask the owner rather than guessing.
- Work through [Build steps](#build-steps) in order.

---

## Admin and pages

**Admin:** products, product types, finishes, thicknesses, applications, sample requests, quote requests, showrooms, dealers, testimonials, newsletter subscribers, site content, settings, staff, audit log.

**Public routes:** `/`, `/products/`, `/products/<slug>/`, `/samples/` (the sample cart), `/quote/`, `/login/`, `/register/`, `/account/`, `/privacy/`, `/terms/`, `/cookies/`, `/admin/`.

---

## Starting point: what is already in this repo

| What | Where | What happens to it |
|---|---|---|
| The marketing site (design, sections, SEO, motion) | `src/` | Stays. Sections already take plain props, so only their data source changes. |
| Theme, fonts, icons | `src/app/globals.css`, `src/components/` | Stays unchanged. |
| Site config, JSON-LD, sitemap, robots | `src/config/site.ts`, `src/lib/jsonld.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` | Stays. The Sanity half of the config is read from the database instead. |
| Sanity client, GROQ queries, Zod content schemas | `src/lib/sanity/` | The Zod schemas are the starting shape for the tables and admin forms. Then the folder is deleted. |
| Revalidation webhook, draft-mode routes | `src/app/api/` | Deleted. |
| The old Sanity Studio (schemas, seed content, custom inputs) | `docs_development/sanity-reference/` | Reference for the tables, the seed and the admin forms. Not part of the app. Deleted once the port is done. |
| Demo images | `src/assets/images/` | Already the final place. See [Images](#images). |
| Motion | `src/components/motion-script.tsx`, `globals.css` | Stays. Documented in `docs_development/MOTION-SYSTEM.md`. |

The brand changes from **Grainora Surfaces** to **Timberline Panels** in the seed content, including the
business name, legal name, logo text and email sender name.

### Content: Sanity to database

Sanity documents in this site: `product`, `application`, `finish`, `testimonial`, `showroom`, plus the singletons `siteSettings` and `homePage`.

| Sanity | Table | Change |
|---|---|---|
| `product` | `products` | Gains a product type, thicknesses, a regular price and a dealer price. Gets a detail page at `/products/<slug>/`. |
| `finish` | `finishes` | Linked to products (many to many). |
| `application` | `applications` | Linked to products (many to many). |
| (new) | `product_types`, `thicknesses` | The other two filters of the Find the Right Material bar. |
| `showroom` | `showrooms` | Unchanged. |
| `testimonial` | `testimonials` | Unchanged. |

- `siteSettings` becomes the single-row `site_settings` table: business name, address, phone, email,
  geo, opening hours, socials, SEO defaults, header and footer text.
- `homePage` becomes the single-row `home_page` table: each section's copy, with ordered lists of
  references stored as join tables with a `position` column.
- Field descriptions in the Sanity schemas become help text in the admin forms.
- `docs_development/sanity-reference/components/` holds the old Studio's `OpeningHoursInput` and
  `SocialProfilesInput`. The admin forms for opening hours and social profiles follow their layout.

### Home page sections

| Section | Becomes |
|---|---|
| Material finder (`material-finder.tsx`) | Opens `/products/` filtered by the four choices. |
| Products, Collections | Read from `products`, linking to `/products/` and each product's page. |
| Applications | Read from `applications`, each linking to `/products/` filtered by it. |
| Showrooms | Read from `showrooms`. |
| Testimonials | Read from `testimonials`. |
| Hero, Value props, Why choose, How it works, Stats, Closing CTA | Home page content, edited in the admin. |
| Newsletter form in the footer | Saves to `newsletter_subscribers`. |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Validation | Zod, on both client and server |
| Database | PostgreSQL 18 |
| ORM and migrations | Drizzle ORM + drizzle-kit |
| Auth | Better Auth (Drizzle adapter) |
| Admin panel | Built into the app under `/admin` |
| Images | Demo photos bundled in the code. Uploads saved on the server's disk and processed with sharp. Both served through `next/image`. |
| Email | Resend + React Email |
| Payments | None |
| Background jobs | pg-boss, a job queue stored in Postgres |
| Unit and integration tests | Vitest |
| Browser tests | Playwright |
| Lint and format | ESLint + Prettier |
| Local development | Docker, with shared Postgres and nginx containers |

### State and forms

| Need | Choice |
|---|---|
| Server data | Server Components to read, Server Actions to write |
| Filters kept in the URL | nuqs: catalogue filters on `/products/`, admin list filters |
| Sample cart | Zustand, saved to localStorage |
| Live data that refreshes itself | TanStack Query (polling): new sample and quote requests in the admin |
| Complex forms | React Hook Form + Zod |
| Admin tables | TanStack Table (the shadcn data table) |
| Optimistic updates | React 19 `useOptimistic` |

There is no global store beyond the sample cart.

---

## Catalogue, samples and quotes

There is no slot engine and no shop.

- **Catalogue.** `/products/` filters by product type, finish, thickness and application. The filters live
  in the URL (nuqs), so the Find the Right Material bar just links to `/products/` with those choices,
  and a filtered list can be shared or bookmarked.
- **Prices.** Products show the regular price. A logged-in dealer sees the dealer price instead. Prices are
  only shown, never charged.
- **Sample cart.** "Request a sample" adds a product (with its finish) to a cart kept in the browser
  (Zustand, saved to localStorage). `/samples/` lists the cart and sends it as one sample request, with a
  delivery address. Up to 10 samples per request, set in the admin.

  Statuses: `requested` → `preparing` → `sent`, with `cancelled`.
- **Quote requests.** `/quote/` takes the project type, the products and approximate quantities (square
  metres), the location and a note. Sales replies with a quote written in the admin, which the customer
  sees in their account and gets by email.

  Statuses: `requested` → `in_progress` → `quoted` → `closed`, with `cancelled`.
- **Dealers.** An admin marks a customer as a dealer. It's a flag on the customer, not a staff role.

### Cancelling

- **Customer, from their account:** A sample or quote request can be cancelled until staff start working on it. After that, the customer contacts the sales team.
- Staff can cancel or change at any time from the admin.
- Every change sends an email to the customer and to the staff involved.

### Timezone

Everything runs on **Asia/Manila** time. Timestamps are stored as `timestamptz`, and every date shown and
every scheduled job is worked out in Manila time, whatever timezone the server or the visitor's device is
in. Helpers live in `src/lib/time.ts`.

---

## Rendering

| Page type | How it renders |
|---|---|
| Public marketing pages | Static. Reads are cached with `'use cache'` + `cacheTag()`. |
| Booking, request and account pages | Dynamic. They show live data for one visitor. |
| Admin | Dynamic, and visible only after login |

- When an admin saves, the Server Action writes to the database and calls `updateTag()` for the affected
  tags. The public page updates on the next request, with no rebuild.
- `npm run build` must still show every public marketing route as static.
- Detail pages built from the database export `generateStaticParams()` from a database query and are
  cached by tag. A new item gets its page on its first visit, then stays cached until it is edited.
- **Refreshing from outside a Server Action.** `updateTag()` only works inside a Server Action, and the
  worker runs outside Next.js. So the demo reset calls `POST /api/internal/revalidate`, protected by
  `INTERNAL_API_SECRET`, which runs `revalidateTag(tag, { expire: 0 })` for every tag.

### SEO

- **Sitemap** reads the database: the fixed routes from `src/config/site.ts` plus every published detail
  page, with `updated_at` as `lastModified`. Hidden and draft items are left out.
- **robots.txt** disallows `/admin/`, `/account/` and `/api/`. Account, login and admin pages also send
  `noindex`.
- **Metadata** on every public route: a unique title (~50–60 characters) and description (~140–160),
  and a canonical URL with a trailing slash. SEO fields are edited in the admin, with length hints.
- **JSON-LD**, built from the same data as the markup: `Organization` for the company, `LocalBusiness` per showroom, `Product` per product. Also `WebSite` on the home page,
  `BreadcrumbList` on nested routes, and `FAQPage` only where a real FAQ is shown. Never invent ratings,
  reviews or awards.
- **NAP**: the business name, address and phone come from `site_settings` through the merged config in
  `src/config/site.ts`, so they're identical everywhere: page, footer, JSON-LD. Never retype them inline.
- `trailingSlash: true` stays. Every internal link ends with a slash.

---

## Project structure

```text
timberline-panels-catalog/
  CLAUDE.md / AGENTS.md   # primary instructions (mirrors)
  docker-compose.yml
  docker/
    Dockerfile
    entrypoint.sh
    start.sh
    nginx-proxy.conf      # copied to ../DOCKER/nginx-proxy/conf.d/
  docs_development/
    PLAN.md               # this file
    REACT_NEXT_ENGINEERING_GUIDE.md
    MOTION-SYSTEM.md
    sanity-reference/     # old Sanity Studio, deleted after the port
  drizzle/                # generated migrations, committed
  drizzle.config.ts
  storage/uploads/        # files uploaded through the admin, gitignored
  storage/maintenance     # exists only while the demo reset runs
  e2e/                    # Playwright tests
  src/
    app/
      (site)/             # public pages
      account/            # customer account: details, password, bookings and requests
      admin/              # admin panel
      api/auth/[...all]/route.ts         # Better Auth
      api/internal/revalidate/route.ts   # cache refresh for the worker, secret-protected
      uploads/[...path]/route.ts         # serves uploaded files
    assets/images/        # bundled images shipped with the code (the demo's photos)
    components/
      ui/                 # shadcn/ui, owned
      admin/              # admin building blocks
      sections/           # site sections, already here
    config/site.ts
    db/
      index.ts            # Drizzle client
      schema/             # one file per area
      seed.ts
    lib/
      auth.ts             # Better Auth server
      auth-client.ts      # Better Auth client
      booking/            # availability and rules for the core feature
      email/              # sendEmail(), transports, React Email templates
      uploads/            # save, process, delete
      jobs/               # job definitions
      roles.ts            # staff roles and their can…() checks
      audit.ts            # writes the audit log
      rate-limit.ts       # limits for public forms
      time.ts             # Asia/Manila date helpers
      jsonld.ts
      utils.ts
    worker/index.ts       # background job worker
    proxy.ts              # Next 16 proxy: maintenance page, redirects /admin to login
```

---

## Database

- Database `timberline` on the shared Postgres container `shared-postgres`, plus `timberline_test` for tests.
- Each schema area has its own file in `src/db/schema/`. Migrations are generated by drizzle-kit and
  committed in `drizzle/`. They run automatically when the container starts.
- `npm run db:seed` resets the app to its demo content.
- Prices are stored as whole centavos (`integer`), in PHP. They're only shown, never charged.
- `newsletter_subscribers`: email and sign-up date. The admin lists them and exports a CSV.

---

## Auth

- Better Auth with email and password, stored through the Drizzle adapter.
- **Customer accounts.** Customers sign up and log in to see and manage their own sample and quote requests.
- **Staff roles** follow BookingApp's `UserRole`: a plain list of roles, each mapped to `can…()` checks
  such as `canManageBookings()` or `canManageContent()`. No permissions package. Better Auth stores the
  role on the user. The checks live in `src/lib/roles.ts`.

| Role | Can do |
|---|---|
| admin | Everything, including staff accounts, settings, dealers and the audit log |
| sales | Sample requests, quote requests, customers |

- Customers have no staff role and cannot reach `/admin`.
- `proxy.ts` redirects signed-out visitors from `/admin` to the login page. That redirect is only a
  convenience. **Every admin page and every Server Action checks the session and role itself.** Server
  Actions are public endpoints, so a check in the layout alone does not protect them.

### Account flows

- **Customer sign-up** needs email verification. A customer can't book or send a request until their
  email is verified.
- **Password reset** by email, for customers and staff.
- **Staff invites.** Only an admin creates staff accounts: name, email and role. The new staff member gets
  an email with a link to set their password. There is no public sign-up for staff.
- An admin can change a staff member's role or deactivate them. A deactivated account is logged out at
  once and can't log in. The last active admin can't be deactivated.

### Customer account page

Follows EcommerceApp's account area. A customer can edit their name and contact details, change their
password, and see their sample and quote requests, with the cancel options described under
[Cancelling](#cancelling).

There is no self-delete, as in EcommerceApp and BookingApp. Staff are deactivated by an admin, never
deleted, so the audit log always shows who did what.

---

## Security

### Spam protection

Every public form (sign-up, login, bookings and requests, newsletter) has:

- **Rate limiting** by IP address and by account. Better Auth's built-in rate limit covers login and
  sign-up. The other forms use a small limit table in Postgres.
- **A honeypot field,** hidden from people. A bot that fills it in is silently ignored.
- **A minimum fill time.** A form sent within two seconds of loading is treated as a bot.

No CAPTCHA for now.

### Audit log

Like BookingApp's `AuditLogger`:

- `audit_log` table: who, what action, which record, the changed fields before and after, IP address, and
  time.
- Every admin change is recorded, plus logins, failed logins, staff invites and role changes.
- Only admins can view it, in **Admin → Audit log**, filtered by person, record or date.

### Legal pages

As in BookingApp: **Privacy Policy**, **Terms of Service** and **Cookie Policy** at `/privacy/`,
`/terms/` and `/cookies/`. Their text is site content edited in the admin. A page with no text returns a
404 and is left out of the footer and the sitemap.

---

## Images

### Two kinds of image: bundled and uploaded

The same design as BookingApp's `RoomTypeImage` and EcommerceApp's `ProductImage`:

- Every image row stores a **`path`** and a **`disk`**, never a URL. One helper, `imageSrc()`, works out
  the URL when the page renders.
- **`disk: "bundled"`** is an image shipped with the code in `src/assets/images/` (as BookingApp ships
  `resources/images/aldyr/`). `path` is the image's file name without the extension.
  `src/assets/images/index.ts` maps each name to a static import, so Next.js builds and hashes it like
  Vite does with `Vite::asset()`, and supplies its width, height and blur placeholder. The demo's photos
  are all bundled.
- **`disk: "uploads"`** is an image an admin uploaded. `path` is its place in `storage/uploads/`.
- The seed only writes `bundled` rows, so a database reset brings every demo photo back with nothing
  copied to storage.
- Deleting a bundled row never deletes the file. Deleting an uploaded row deletes its file.
- An admin can replace a bundled image with an upload. The row then switches to `disk: "uploads"`.
- Every image row also stores `alt` and a **decorative** flag. `alt` is required unless the image is
  decorative, which is the only way to get an empty `alt`.

### Uploads

Same approach as EcommerceApp's `PublicImages` and `ProductPhotos`:

1. An admin uploads through a Server Action. The Server Actions body size limit and nginx's
   `client_max_body_size` are both raised to fit the largest upload.
2. sharp re-encodes every image: turns it the right way up using the EXIF flag, scales it down to a
   maximum size for its longest side, saves it as WebP at quality 82, and strips EXIF data including GPS
   location.
3. The file is saved under `storage/uploads/<area>/<id>/<hash>.webp`. The content hash in the name means
   it can be cached forever.
4. `src/app/uploads/[...path]/route.ts` serves the files with long cache headers, and refuses paths that
   try to leave the uploads folder.
5. `next/image` serves them through `images.localPatterns: [{ pathname: "/uploads/**" }]`.
6. Files are written before the database transaction and deleted again if it fails. A deleted row loses
   its file only after the transaction commits.

### Image rules

- Always set `width` and `height`, from the static import or the stored row. Missing dimensions cause
  layout shift.
- `preload` + `fetchPriority="high"` on the LCP image only, usually the hero. Never on more than one image
  per route.
- Use the blur placeholder where the image is large enough to matter.

---

## Email

Resend, set up the way EcommerceApp and BookingApp have it.

- The `resend` npm package. Templates are written with React Email in `src/lib/email/templates/`.
- One `sendEmail()` function with two transports, picked by `MAIL_TRANSPORT`:
  - `log` (the default for development) prints the email to the container output, like Laravel's
    `MAIL_MAILER=log`.
  - `resend` sends it through Resend. The From address must be on a domain verified in Resend.
- Emails are sent from the background worker, so a slow send never holds up a page.

| To | When |
|---|---|
| Customer | Verify email, password reset |
| Customer | Sample request received, sent or cancelled |
| Customer | Quote request received, quote ready, or cancelled |
| Staff | Invite to set a password, password reset |
| Notification address | A new or cancelled sample or quote request |

Staff notifications also go to a notification address set in the admin.

---

## Background jobs

The worker does what Laravel's queue worker and scheduler (`queue:listen` and `schedule:work`) do in
EcommerceApp and BookingApp:

- the hourly demo reset (see [Demo reset](#demo-reset))
- sending emails

It uses **pg-boss**, a job queue that keeps its jobs and schedules in its own `pgboss` schema in Postgres,
so there's no Redis. `src/worker/index.ts` registers the jobs and their schedules. It runs as a second
process beside `next dev`, the same way EcommerceApp runs its server, queue and scheduler together through
`concurrently`.

---

## Demo reset

The public demo returns to its seeded state every hour, the same as `demo:reset` in EcommerceApp and
BookingApp.

- It runs only when `DEMO_MODE=true`. The job isn't scheduled otherwise, and it also refuses to run
  without the flag, because it drops every table. A local development copy leaves it off, so your work
  isn't wiped every hour.
- Each run:
  1. creates `storage/maintenance`, so visitors see a "back shortly" page instead of errors
  2. drops every table in the app's own schema, runs the migrations and runs the seed. pg-boss's `pgboss`
     schema is left alone, so the reset doesn't delete its own job.
  3. empties `storage/uploads/`
  4. refreshes every cached page through `/api/internal/revalidate`
  5. deletes `storage/maintenance`, even if a step failed
- `proxy.ts` checks for `storage/maintenance`. While it exists, every request gets a 503 "back shortly"
  page.
- The demo's photos are bundled images, so emptying `storage/uploads/` never loses them.
- Everyone is logged out by a reset, because sessions live in the dropped tables. The audit log is cleared
  too.
- It can also be run by hand: `npm run demo:reset`.

### Demo logins

The seed creates one account for each role, so the demo can be tried from every side, like the logins
table in EcommerceApp's README. Passwords come from `.env`, never from the code. Emails use the `.test`
domain, for example `admin@timberline.test`. The README lists them.

Accounts seeded: admin, sales, one customer, one dealer customer.

---

## Docker, local development

Same pattern as EcommerceApp and BookingApp: one app container behind the shared nginx, with the database
on a shared container. The site is reached at **http://timberline.localhost**.

### Shared containers

On the owner's PC, the shared containers live in `../DOCKER`: `nginx-proxy/` (container `shared-nginx`)
and `mysql/` (container `shared-mysql`, not used here). Both use external Docker networks, `proxy` and
`database`.

**`shared-postgres` may not exist yet.** If `../DOCKER/postgres/docker-compose.yml` is missing, create it:

```yaml
services:
  postgres:
    image: postgres:18
    container_name: shared-postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql
    networks:
      - database

volumes:
  pgdata:

networks:
  database:
    external: true
```

### `docker-compose.yml`

```yaml
services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    volumes:
      - .:/app
      - node_modules:/app/node_modules
      - next:/app/.next
    environment:
      APP_URL: http://timberline.localhost
      DATABASE_URL: postgres://postgres:secret@shared-postgres:5432/timberline
      WATCHPACK_POLLING: "true"
    tty: true
    networks:
      default:
      proxy:
        aliases:
          - timberline-app
      database:

volumes:
  node_modules:
  next:

networks:
  proxy:
    external: true
  database:
    external: true
```

- `node_modules` and `.next` are volumes, so the dependencies installed on Windows stay out of the Linux
  container.
- `WATCHPACK_POLLING` makes hot reload work on a Windows bind mount.
- No port is published. The site is reached only through `shared-nginx`.
- The container is named `timberline-panels-catalog-app-1`, after this folder.

### `docker/Dockerfile`

A development image on `node:24-bookworm-slim`. The code is bind-mounted, so the image holds only the
startup scripts. It exposes port 3000.

### `docker/entrypoint.sh`

Mirrors EcommerceApp's entrypoint:

1. Creates `.env` from `.env.example` if it's missing.
2. Fills in `BETTER_AUTH_SECRET` and `INTERNAL_API_SECRET` with random values if they're empty, the way
   EcommerceApp's entrypoint generates `APP_KEY`.
3. Runs `npm ci` whenever `package-lock.json` has changed since the last install, tracked with a sha1 file.
4. Creates the `timberline` and `timberline_test` databases on `shared-postgres` if they're missing.
5. Runs the Drizzle migrations.

### `docker/start.sh`

Runs both processes with `concurrently`:

- `web`: `next dev --hostname 0.0.0.0 --port 3000`
- `worker`: `tsx watch src/worker/index.ts`

### `docker/nginx-proxy.conf`

Copied to `../DOCKER/nginx-proxy/conf.d/timberline.conf`:

```nginx
server {
    listen 80;
    server_name timberline.localhost;

    client_max_body_size 20m;

    location / {
        resolver 127.0.0.11 valid=10s ipv6=off;
        set $upstream http://timberline-app:3000;
        proxy_pass $upstream;

        proxy_http_version 1.1;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- The resolver line looks the app up on each request, so a stopped app doesn't take nginx down.
- The `Upgrade` and `Connection` headers let Next's hot reload work through nginx.
- `next.config.ts` lists `timberline.localhost` in `allowedDevOrigins`. Without it, Next blocks hot reload from
  that host.

### Commands

First time:

```bash
docker network create database   # skip if it already exists
docker network create proxy      # skip if it already exists
docker compose -f ../DOCKER/postgres/docker-compose.yml up -d
docker compose -f ../DOCKER/nginx-proxy/docker-compose.yml up -d
cp docker/nginx-proxy.conf ../DOCKER/nginx-proxy/conf.d/timberline.conf
docker exec shared-nginx nginx -t && docker exec shared-nginx nginx -s reload
docker compose up -d --build
docker exec timberline-panels-catalog-app-1 npm run db:seed
```

Every day:

```bash
docker compose up -d
docker compose down
docker logs -f timberline-panels-catalog-app-1
docker exec timberline-panels-catalog-app-1 npm run db:migrate
```

Put `docker exec timberline-panels-catalog-app-1` in front of any `npm` command.

---

## Scripts

| Script | Does |
|---|---|
| `dev` | `next dev` |
| `worker` | Runs the background worker |
| `build` | `next build` |
| `start` | `next start` |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint |
| `format` / `format:check` | Prettier |
| `test` | Vitest |
| `e2e` / `e2e:ui` | Playwright |
| `db:generate` | Generates a migration from schema changes (drizzle-kit) |
| `db:migrate` | Applies migrations |
| `db:seed` | Resets the database to the demo content |
| `db:studio` | Drizzle Studio, a database browser |
| `demo:reset` | Resets the demo by hand. Refuses to run unless `DEMO_MODE=true`. |

Vitest integration tests run against the `timberline_test` database. Playwright runs against the app in Docker.

---

## Environment variables

All of them are server-only. None takes the `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
|---|---|
| `APP_URL` | The site's address. Feeds `metadataBase`, canonicals and JSON-LD. |
| `DEMO_MODE` | `true` only on the public demo. Turns on the hourly reset. |
| `DATABASE_URL` | The app's database |
| `DATABASE_URL_TEST` | The test database |
| `BETTER_AUTH_SECRET` | Signs sessions |
| `BETTER_AUTH_URL` | Same as `APP_URL` |
| `INTERNAL_API_SECRET` | Protects `/api/internal/revalidate`, which the worker calls |
| `UPLOADS_DIR` | Where uploads are saved. Defaults to `storage/uploads`. |
| `MAIL_TRANSPORT` | `log` or `resend` |
| `RESEND_API_KEY` | Resend key |
| `MAIL_FROM_ADDRESS` / `MAIL_FROM_NAME` | Sender, on a domain verified in Resend |
| `DEMO_ADMIN_PASSWORD` / `DEMO_STAFF_PASSWORD` / `DEMO_CUSTOMER_PASSWORD` | Passwords for the seeded demo accounts |

The Sanity variables in today's `.env.example` are removed in step 1.

---

## Build steps

1. **Docker and the database.** Add the Docker files, Drizzle, the schema and the seed (renamed to
   Timberline Panels). Switch the home page, layout, sitemap and JSON-LD from Sanity to the database. Then delete
   `src/lib/sanity/`, the Sanity API routes, `next-sanity` and the Sanity variables. `npm run build` must
   still show the public routes as static.
2. **Auth and the admin shell.** Better Auth, roles, staff invites, the admin layout and the audit log.
3. **Content editing.** Site settings, home page sections and every collection in the admin, with bundled
   and uploaded images and `updateTag()` refreshes.
4. **Customer accounts.** Sign-up with email verification, password reset, the account page and the legal
   pages.
5. **The core feature:** the catalogue and product pages, the sample cart, quote requests, dealer prices, and requests in the admin and the account page.
6. **Email and the worker.** Resend, React Email templates, pg-boss and staff notifications.
7. **Demo and protection.** Demo reset, demo logins, spam protection, the README logins table.
8. **Tests.** Vitest for availability and rules, Playwright for the main flows.
9. **Clean up.** Delete `docs_development/sanity-reference/` once nothing needs it.
