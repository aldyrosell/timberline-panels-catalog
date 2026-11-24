# React / Next.js / TypeScript Coding Instructions

Coding standards and working instructions for this repository. It may contain React.js applications, Next.js applications, or both — follow the section matching the project you are editing.

This is the deep reference guide. The root `CLAUDE.md` is the primary instruction set and says when to read this file.

## Working Method

- Read existing code with `Read`/`Grep`/`Glob` before changing it. Match the current structure and naming conventions.
- Reuse existing components, hooks, utilities, services, schemas, and types. Do not duplicate API, validation, formatting, or state logic.
- Prefer small, focused changes over rewrites. Preserve existing behavior unless the task requires changing it.
- Do not add a dependency unless clearly necessary; check `package.json` first and prefer what is already installed.
- Use TypeScript wherever the project does. Avoid `any` — write a real type, or use `unknown` plus validation.
- Keep business logic out of presentational components.
- Comment only where the reason behind the code is not obvious.
- Remove debug logs, dead code, unused imports, and commented-out code you introduce.
- Never expose secrets, tokens, passwords, or private environment variables. Validate all untrusted input on the server.
- Run the relevant lint, type-check, test, and build commands with `Bash` after changing code.

---

# React.js

For Vite, Create React App, custom Webpack apps, browser extensions, and embedded React apps.

## Components

- Functional components only. Small, one responsibility each.
- Composition over inheritance. Extract reusable UI into components, reusable stateful behavior into custom hooks.
- Separate container logic from presentational UI once a component gets complex.
- Avoid deeply nested JSX — extract meaningful subcomponents.
- Prefer explicit props over passing large objects with no clear contract.
- Semantic HTML before ARIA. Keep accessibility behavior intact when modifying interactive elements.

```tsx
type UserCardProps = {
  name: string;
  email: string;
  onSelect?: () => void;
};

export function UserCard({ name, email, onSelect }: UserCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>

      {onSelect ? (
        <button type="button" onClick={onSelect}>
          Select user
        </button>
      ) : null}
    </article>
  );
}
```

## Hooks

- Follow the Rules of Hooks — never inside conditions, loops, or nested functions.
- `useState` for simple local state, `useReducer` for complex transitions, `useRef` for mutable values that must not trigger renders.
- `useEffect` is for synchronizing with external systems only. Never use it to derive a value that can be computed during render.
- Always clean up subscriptions, listeners, observers, and timers.
- `useMemo` / `useCallback` only for a measured benefit or a genuinely required stable reference.
- Reusable hook logic lives in files starting with `use`.

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadUsers() {
    const response = await fetch("/api/users", {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to load users");
    }

    const users = await response.json();
    setUsers(users);
  }

  loadUsers().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    setError("Failed to load users");
  });

  return () => {
    controller.abort();
  };
}, []);
```

## State Management

Use the smallest solution that fits, in this order:

1. Local component state
2. Lifted state
3. Context for stable, widely shared values
4. A server-state library for remote data
5. A global client-state library for complex shared client state

- Never store derived values in state.
- Do not copy server data into multiple stores without a clear reason.
- Keep state close to where it is used.
- Normalize complex collections when updates are frequent.
- Reducers or state machines for multi-step workflows.
- Keep Redux Toolkit slices focused per feature; read through selectors, not the whole store.
- Context is not a replacement for all state management.

## Data Fetching

- API calls belong in hooks, services, or query functions — not inline in components.
- Use TanStack Query or SWR if the project already does.
- Represent loading, success, empty, and error states explicitly.
- Cancel stale requests. Avoid duplicate requests for the same resource.
- Optimistic updates only when rollback behavior is defined.
- Normalize API errors before display.
- Client-side validation is never the only validation layer.

## Forms

- Controlled inputs for simple forms; React Hook Form or the project's existing library for larger ones.
- Validate with the project's schema library.
- Field-level errors shown next to the affected input.
- Disable duplicate submissions while a request is pending.
- Preserve user input when submission fails.
- Correct labels, `autocomplete` values, and input types.

## Performance

- Measure before optimizing; use the React DevTools Profiler for render problems.
- Avoid building large objects or running expensive calculations on every render.
- Virtualize large lists and tables.
- Stable keys from persistent IDs — never array indexes when order can change.
- Lazy-load large screens, editors, charts, and optional features.
- Debounce search inputs; throttle scroll and resize handlers when needed.

## Error Handling

- Error boundaries around major application sections.
- Handle async errors explicitly.
- Show actionable user-facing messages; log technical detail through the project's logger.
- Never expose stack traces or internal details to users.

## Testing

- Test behavior, not implementation details.
- React Testing Library for components; Vitest or Jest per the existing setup; Playwright or Cypress for critical end-to-end flows.
- Mock network boundaries, not internal component behavior.
- Cover loading, empty, success, error, and permission states.
- Add a regression test when fixing a bug, where practical.

## Structure

Follow the existing layout. For new projects or isolated features:

```text
src/
  app/
  components/
  features/
    users/
      components/
      hooks/
      services/
      types/
      utils/
      tests/
  hooks/
  services/
  store/
  styles/
  types/
  utils/
```

Feature code stays in its feature directory. Promote to a shared directory only once multiple features use it.

---

# Next.js

Prefer the App Router unless the repository already uses the Pages Router. Check which one exists before writing routing code.

## App Router

- Follow the `app` directory conventions already present.
- Default to Server Components.
- Add `"use client"` only for client-side interactivity, browser APIs, local state, effects, or client-only libraries.
- Keep client boundaries as small as possible. Never convert a whole page or layout to a Client Component to support one interactive child.
- Fetch data in Server Components where possible; keep secrets and privileged logic on the server.
- Route Handlers or Server Actions for server-side mutations.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` where appropriate.
- Route groups to organize without changing URLs; nested layouts for shared UI and persistent navigation.

## Server Components

- Read from the database or internal services directly when appropriate.
- No React client hooks, no browser-only libraries.
- Pass only serializable props to Client Components.
- Do not call your own public API routes from the server — call the underlying service or repository.

```tsx
import { getUsers } from "@/features/users/server/get-users";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <main>
      <h1>Users</h1>
      <UserList users={users} />
    </main>
  );
}
```

## Client Components

- Interactive sections only.
- Keep fetching on the server unless client-side refresh, polling, or user-driven fetching is required.
- Never expose server-only environment variables or import server-only modules.
- Prefer passing initial server data into a small interactive client component.

```tsx
"use client";

import { useState } from "react";

type CounterProps = {
  initialValue?: number;
};

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}
```

## Routing

- Descriptive route segments. `[id]` for dynamic routes; `[...slug]` only when catch-all is required; `[[...slug]]` only for optional catch-all.
- `redirect()` for server-side redirects, `notFound()` when a record does not exist.
- `Link` for internal navigation — raw anchors only with a specific reason.
- Preserve search params that represent filters, pagination, sorting, or shareable state.

## Data Fetching and Caching

- Choose caching behavior explicitly, never by accident.
- Static rendering for rarely-changing content; dynamic for personalized or request-specific content.
- `cache: "no-store"` for always-fresh data; revalidation for time-bounded caching.
- Cache tags for data that must be invalidated together; call `revalidatePath()` or `revalidateTag()` after successful mutations.
- Never cache user-specific or authorization-sensitive data globally.
- Verify caching behavior when using cookies, headers, authentication, or draft mode.

```tsx
const response = await fetch(`${apiUrl}/products`, {
  next: {
    revalidate: 300,
    tags: ["products"],
  },
});

if (!response.ok) {
  throw new Error("Failed to load products");
}
```

## Server Actions

- `"use server"` in server-only action modules or functions.
- Validate every input with a schema.
- Authenticate and authorize every protected action. Hidden fields and client UI are not authorization.
- Return predictable success and error results.
- Revalidate affected data after successful mutations.
- Database access stays in services or repositories; no large business workflows in page files.

```tsx
"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  await userService.create(parsed.data);
  revalidateTag("users");

  return { success: true as const };
}
```

## Route Handlers

- For public APIs, webhooks, external integrations, and client-consumed endpoints.
- Validate bodies, query params, and route params.
- Consistent JSON shapes and correct HTTP status codes.
- Authenticate and authorize protected endpoints.
- Handle expected errors separately from unexpected ones; never leak internal messages.
- Keep handlers thin — delegate to services.

```tsx
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Malformed JSON body",
      },
      {
        status: 400,
      },
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      {
        status: 422,
      },
    );
  }

  const user = await userService.create(parsed.data);

  return NextResponse.json(
    {
      data: user,
    },
    {
      status: 201,
    },
  );
}
```

## Authentication and Authorization

- Validate sessions on the server. Protect pages *and* mutation endpoints.
- Middleware is an early routing layer, not the authorization layer — check permissions again in Server Actions and Route Handlers.
- Prefer permission-based checks over role-name checks.
- Never send sensitive session data to the client.
- Secure, HTTP-only cookies for session tokens, with security options set per environment.

## Middleware

Lightweight request-time concerns only: auth redirects, locale detection, URL rewrites, basic request filtering, header updates.

No heavy database work unless the runtime and architecture explicitly support it.

## Metadata and SEO

- Use the Metadata API; `generateMetadata()` for route-specific metadata.
- Canonical URLs where necessary; Open Graph and social metadata for public pages.
- Structured data only when it accurately represents the page.
- Unique, relevant titles and descriptions. Never render misleading or duplicated SEO content.

## Images and Fonts

- `next/image` for supported images, with meaningful `alt` text and either explicit dimensions or correct `fill` usage.
- Configure remote image hosts explicitly.
- `next/font` when the project uses Next-managed fonts.
- Avoid layout shift from unknown image dimensions.

## Runtime

- Node.js runtime by default. Edge only when required and all dependencies support it.
- No Node-only packages in Edge code. Keep runtime selection explicit for routes with special requirements.

## Performance

- Minimize Client Components and shipped client JavaScript.
- Stream slow sections with Suspense where useful.
- Dynamically import large client-only dependencies.
- Avoid waterfalls — start independent requests concurrently with `Promise.all()`.
- Keep server and client bundles separated; analyze the bundle before adding a heavy dependency.
- Do not refetch the same data across nested components.

## Structure

Follow the existing layout. For new App Router projects:

```text
src/
  app/
    (auth)/
    (dashboard)/
    api/
    layout.tsx
    page.tsx
  components/
  features/
    users/
      components/
      actions/
      server/
      services/
      repositories/
      schemas/
      types/
  lib/
  server/
  styles/
  types/
  utils/
```

Use `server-only` modules for code that must never reach the client bundle.

---

# TypeScript

- Explicit domain types. `type` for unions and component props; `interface` where declaration merging or extension helps.
- Discriminated unions for state and result variants, with exhaustive checks.
- Avoid unsafe type assertions.
- Validate runtime data even when types exist — infer types from schemas where possible.
- Keep API request/response types near the relevant feature.

```tsx
type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
```

---

# API and Service Architecture

```text
UI
  -> Hook, Server Component, Server Action, or Route Handler
  -> Service
  -> Repository or external API client
  -> Database or third-party API
```

- Components contain no database code.
- Route Handlers contain no large business workflows.
- Services hold business rules; repositories handle persistence.
- API clients handle external HTTP; adapters normalize external data into internal domain types.

---

# Validation and Security

- Validate all external input; sanitize or safely render user-provided content.
- Never trust IDs, roles, prices, permissions, or ownership values from the client.
- Protect against unauthorized direct API access; parameterized database queries only.
- Rate-limit sensitive public endpoints; verify webhook signatures.
- Never log passwords, session tokens, API keys, or private customer data.
- Keep server-only code out of client bundles.
- Check file uploads for type, size, storage location, and access restrictions.

---

# Accessibility

- Semantic elements. Every form control labeled; every button with an accessible name.
- Keyboard navigation works; focus indicators stay visible.
- ARIA only where native HTML cannot express the behavior.
- Announce async errors and status updates where appropriate.
- Dialogs trap focus and restore it on close.
- Never use color as the only carrier of meaning.

---

# Styling

- Follow the project's existing styling system; do not mix approaches without strong reason.
- Reuse design tokens, theme values, spacing, typography, and shared components.
- No hard-coded colors or spacing where theme tokens exist.
- Keep responsive behavior on existing breakpoints.
- Avoid inline styles for reusable or complex styling.
- Preserve dark-mode behavior where supported.

---

# Verification

Detect the package manager from the lockfile before running anything — `pnpm-lock.yaml` → pnpm, `package-lock.json` → npm, `yarn.lock` → yarn, `bun.lockb` → bun. Check `package.json` scripts for the actual script names; not every project has `typecheck`.

```bash
npm run lint
npm run typecheck      # or: npx tsc --noEmit
npm test
npm run build
```

Before calling a task complete:

1. Review the changed files.
2. Type-check.
3. Lint.
4. Run the relevant unit and integration tests.
5. Run the production build when practical.
6. Exercise the affected user flow.
7. Verify loading, empty, error, and success states.
8. Verify authorization and permission behavior.
9. Check responsive layout.
10. Check keyboard and accessibility behavior.

**Never state that a lint, type-check, test, or build passed unless you ran it and read the output.** Report failures with the actual output. Steps you could not verify — visual, responsive, or accessibility checks that need a browser — must be named as unverified rather than implied.

Both `Bash` and `PowerShell` tools are available on this Windows host; npm/pnpm scripts run in either.

---

# Change Management

- Keep changes scoped to the requested task.
- Do not rename or reorganize unrelated files, or reformat the repository for a small change.
- Preserve backward compatibility unless instructed otherwise; document breaking changes.
- Update related tests, types, schemas, and documentation alongside the code.

## Reporting

When finishing a coding task, report:

- **What changed** — a concise explanation.
- **Files** — the important files created or modified, as clickable relative links, e.g. `[page.tsx](src/app/users/page.tsx)`.
- **Validation** — the exact commands run and their results. List nothing here that was not actually executed.
- **Notes** — assumptions, limitations, migrations, environment changes, and follow-up concerns.
