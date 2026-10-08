# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (Turbopack, on by default in Next 16; outputs to `.next/dev`)
- `npm run build` — production build (Turbopack by default)
- `npm run start` — run the production build
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`); the old `next lint` command was removed in Next 16

There is no test setup in this repo yet.

## Architecture

Mobile-first gift app in Spanish (Next.js 16.2.12, React 19.2, App Router, TypeScript, Tailwind v4). `@/*` maps to the repo root.

- `content/` — editable texts and settings (start date, timezone, login names, cookie messages, letters, coupons). Change content here, not in components.
- `app/(app)/` — protected pages (inicio, cartas, frasco, cupones, certificado) sharing the tab bar layout; `app/login/` is public.
- `app/acciones.ts` — all Server Actions. Every mutating action checks the session and skips saving when `rol === "yo"` (the boyfriend's preview mode).
- `lib/jwt.ts` + `lib/session.ts` — name-only login stored as a signed JWT cookie (`SESSION_SECRET`); `proxy.ts` does the optimistic redirect to `/login`.
- `lib/store.ts` — tiny key/value store: Upstash Redis when `KV_REST_API_URL`/`KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`) are set, otherwise `.data/db.json` locally (errors on Vercel without Redis).
- `lib/fechas.ts` — all date math uses `"YYYY-MM-DD"` strings in `ZONA_HORARIA`, never server-local time.
- Certificate image (`app/(app)/certificado/imagen/route.tsx`) and PWA icons (`lib/icono.tsx`) are generated with `ImageResponse`.

## Working with this Next.js version (16.x) — do not rely on training data

Next 16 changed enough from earlier versions (which dominate most training data) that APIs and conventions must be verified against `node_modules/next/dist/docs/` before use, per `AGENTS.md`. Key breaking changes to keep in mind:

- **Async request APIs are fully async, no sync fallback**: `cookies()`, `headers()`, `draftMode()`, and `params`/`searchParams` in pages, layouts, routes, and metadata image files must all be `await`ed. Synchronous access (allowed as a deprecated fallback in v15) no longer works at all.
- **`middleware.ts` → `proxy.ts`**: the file and exported function are renamed to `proxy`; edge runtime is not supported in `proxy` (only `nodejs`). Config flags like `skipMiddlewareUrlNormalize` are renamed too (`skipProxyUrlNormalize`).
- **Turbopack is the default** for both `dev` and `build` (no `--turbopack` flag needed). A custom `webpack` config in `next.config.ts` will make `next build` fail unless you pass `--webpack` or migrate the config.
- **Turbopack config moved**: `experimental.turbopack` is now a top-level `turbopack` key in `next.config.ts`.
- **`revalidateTag(tag)` now requires a second `cacheLife` profile argument** (`revalidateTag('posts', 'max')`); use `updateTag` from `next/cache` in Server Actions for immediate read-your-writes semantics instead.
- **`cacheComponents`** (top-level config) replaces the removed experimental PPR flag/`experimental_ppr` segment config and the deprecated `experimental.dynamicIO`/`experimental.useCache` flags.
- **Parallel route slots require an explicit `default.js`** — builds fail without one.
- **`next/legacy/image` and `images.domains`** are deprecated; use `next/image` and `images.remotePatterns`.
- **`next lint` is removed**; lint via the ESLint CLI (`npm run lint` in this repo already does this).
- **`serverRuntimeConfig`/`publicRuntimeConfig` are removed**; use `process.env` (with `NEXT_PUBLIC_` prefix for client-exposed values).

Before implementing anything touching these areas (data fetching, caching/revalidation, middleware, image handling, parallel routes), read the matching file under `node_modules/next/dist/docs/01-app/` first.
