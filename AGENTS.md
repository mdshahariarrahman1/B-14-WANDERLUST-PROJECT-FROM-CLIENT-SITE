<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wanderlust

Next.js 16 App Router frontend (`src/app`). The API is a **separate repo and process**: `../wanderlust-server` (sibling directory, its own git, Express 5 + MongoDB in one `index.js`, `http://localhost:5000`). Start it with `node index.js` from that directory; nothing here spawns it.

## Backend auth — read before touching any fetch

- **Every** backend data endpoint (destinations, bookings, add_destination) runs `verifyToken`, which verifies a real Better Auth JWT against the JWKS at `http://localhost:3000/api/auth/jwks`. The Next server must therefore run on **port 3000** (and `BETTER_AUTH_URL` must match), or every API call is a 401.
- Requests need `Authorization: Bearer <jwt>`. Get it server-side with `auth.api.getToken({ headers: await headers() })` (throws 401 without a session); client-side use `getTokenFromClient()` (`authClient.token()`).
- `destinationAuthHeaders` (`authorization: "User Login"`) in `src/lib/api.ts` is a **legacy placeholder the backend rejects**. Don't copy it; use `auth.api.getToken` server-side or `getTokenFromClient()` in client components.
- Internal route handlers forward a bearer token upstream: destinations PUT/DELETE reuse the incoming `Authorization` header, booking handlers mint one with `auth.api.getToken`. Keep this pattern when adding handlers; the profile stats fetch also sends one.
- 401 is easily misread as "backend down". `curl http://localhost:5000/destinations` returning 401 means the server is up and rejecting auth (connection refused means down); `User Login` is rejected too.
- Mongo documents come in two shapes: seeded docs carry `image`/`imageAlt`/numeric `rating`/`price`; form submissions carry `imageUrl`/`description` with string `price`. Shared `normalizeDestination` lives in `src/app/destinations/normalize.ts`; `src/app/destinations/[id]/page.tsx` has a private duplicate that also maps `highlights`/`reviewsCount`/`departureDate` — keep the two in sync.

## Routing and data flow

- Root layout hardcodes `<Navbar />`, `<main>{children}</main>`, `<Footer />`, `<Toaster />`; pages compose only their own section. Toasts are `toast.add({...})` from `@/components/ui/toast` (not sonner).
- `/` = static sections (`src/components/{banner,why-choose,testimonials,cta}.tsx`) plus `FeaturedDestinations` → `FeaturedCarousel` with the first 5 normalized docs. The carousel fetch needs a session JWT, so signed-out visitors see its fallback copy.
- `/destinations` and `/destinations/[id]` stream their fetches inside `<Suspense>` (Cache Components); detail calls `notFound()` on 404.
- `/destinations` is public in `proxy.ts`, but its server component calls `auth.api.getToken`; signed-out visitors get the "temporarily unavailable" state because the token lookup is inside the existing try/catch.
- `src/proxy.ts` is Next 16 middleware with `matcher: ['/destinations/:path','/add_destination']` — one extra segment, i.e. detail pages only; `/destinations` itself is public. It redirects signed-out users to `/login`.
- `/bookings` and `/profile` are session-gated server pages (`auth.api.getSession({ headers: await headers() })`) that redirect to `/login`. `/bookings` also does `redirect("/401")` on 401/403; the `/401` page lives at `src/app/401/page.tsx`. Profile stats degrade to `—` when their fetch fails.
- Client mutations go through internal route handlers: `/api/destinations/[id]` (PUT/DELETE), `/api/bookings` (POST), `/api/bookings/[id]` (DELETE, session-gated, forwards `x-user-email`). They return 502 when the backend is unreachable; destination dialogs then `router.refresh()`.
- Booking URLs prefer `BOOKING_API`, else `${API_BASE_URL}/bookings`; handlers append `/bookings` when the env value lacks it. `.env` provides `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`, `BOOKING_API`; `API_BASE_URL` is absent, so non-booking traffic defaults to `:5000`.
- Auth is Better Auth at `src/lib/auth.ts` (email+password, `jwt()` plugin, Mongo db `wanderlust`), mounted at `src/app/api/auth/[...all]`; client helpers in `src/lib/auth-client.ts`. `/login` and `/sign-up` live under `src/app/(auth)/`.

## Commands

- `npm run dev` — Turbopack dev server on port 3000. If `.next/dev/lock` exists, a server is already running; reuse it instead of starting another.
- `npm run build` / `npm start` — production. PPR routes print ◐ in the route table (`/`, `/destinations`, `/destinations/[id]`); a route losing its ◐ means a Suspense boundary was dropped.
- `npm run lint` — ESLint 9 flat config directly (not `next lint`). Baseline is **not clean**: exactly two `react-hooks/set-state-in-effect` errors in `src/hooks/use-mobile.ts` and `src/components/ui/carousel.tsx`. Use `npx eslint <path>` for focused checks; don't treat them as regressions.
- `npx next typegen && npx tsc --noEmit` — typecheck. `next-env.d.ts` and `.next/types` are generated/gitignored, so run typegen first on a fresh clone.
- Use npm (`package-lock.json` only). No Jest/Vitest/Playwright — don't invent test commands.

## Stack quirks

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`, `experimental.agentFeedback`, and the `@tailwindcss/turbopack` CSS rule. No webpack config. Under Cache Components, route segment options (`dynamic`, `dynamicParams`, `revalidate`, `fetchCache`, `runtime`) are unavailable; use `"use cache"` + `cacheLife`/`cacheTag`, and wrap uncached reads in `<Suspense>`.
- `next dev` rewrites the managed block at the top of this file and `agentFeedback` may add another; edit only outside the markers and commit managed blocks with your work.
- Typed routes are on: type pages/layouts with generated globals (`PageProps<...>`, `LayoutProps<"/">`, `RouteContext<...>`), not hand-written `params`.
- `next/image` allows any `https` host (`hostname: "**"`) because the form accepts arbitrary URLs; `w` must be one of Next's configured sizes.
- Tailwind is v4 CSS-first: no `tailwind.config.*`, no PostCSS config. `src/app/globals.css` imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css` (variants/utilities only). `:root` + `@theme inline` define shadcn tokens plus `brand`/`brand-dark`; sections use explicit `neutral-*`/`brand` classes.
- UI is shadcn **base-nova** on **Base UI** (`@base-ui/react`) plus headless `@shadcn/react` primitives. Compose with `render={<Button />}`, never `asChild`; type via `<Primitive>.Root.Props`. `src/components/ui` is generated — prefer `npx shadcn add <name>` (reads `components.json`) and keep `data-slot` patterns.
- `cn` comes from the `cn` npm package, not `clsx`/`tailwind-merge`; generated files import `{ cn } from "cn"` and `src/lib/utils.ts` only re-exports it.
- Base UI `Select` only shows its placeholder while `value` is `null`; an empty string renders blank, so pass `value={x || null}`.
- `@/*` maps to `src/*`. `public/images` holds home-page assets (`Banner.png`, `Wanderlast*.png` logo, feature icons, testifier portraits); reuse them, and the logo is an image, not text.
