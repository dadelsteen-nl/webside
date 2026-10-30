# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Dadelsteen project conventions

Brand e-commerce site for **imbody** AI smart-mirror home gyms (NL/BE market), brand name **Dadelsteen**.
Visual direction: *earthy, light and professional* — Dadelsteen-first (organisations: government, social domain, rehab, physio, boutique fitness; home second), colours from the logo/business card: sand/stone backgrounds, espresso-brown text, date-brown accent, forest/palm green. Avoid black/grey and the dark look of imbodybe.com. Serif display headings, slow easing, generous whitespace. Health-insurer reimbursement / national government are ambitions: never present them as available. Dadelsteen is an imbody distributor: imbody brand assets (imbody.com, and the shared Cloudinary account `depjdtrdf` also used by imbodybe.com) may be reused. Code-level brand photos live in `src/lib/brandMedia.ts`; never use competitor sites' own material.

## Stack
- Next.js 16 App Router + Payload CMS 3.92 (ecommerce plugin) + SQLite locally (`DATABASE_URL=file:./dadelsteen.db`; Postgres later).
- Package manager: **pnpm**. Dev server: `pnpm dev` (may run on port 3001 if 3000 is busy).
- After changing collections/globals: `pnpm generate:types` and `pnpm generate:importmap`.
- Production (Vercel) uses Postgres + Vercel Blob with migrations in `src/migrations`. After schema changes create one with the Blob plugin enabled, or its fields are missed:
  `DATABASE_URL=postgres://u:p@127.0.0.1:1/x PAYLOAD_SECRET=x BLOB_READ_WRITE_TOKEN=vercel_blob_rw_a1_b2 pnpm payload migrate:create <name>`
- Typecheck: `npx tsc --noEmit`. Baseline template errors exist in `CartModal.tsx`, `CheckoutPage.tsx`, `generatePreviewPath.ts` (owned by the shop task).

## i18n
- Locales `nl` (default) and `en`, prefix always (`/nl/...`, `/en/...`). Config in `src/i18n/routing.ts`.
- Routes live under `src/app/(app)/[locale]/<internal-path>/page.tsx`. Folder names are the **internal English pathnames**; localized URLs come from `routing.pathnames`. Add any new route to `pathnames`.
- Always link with `Link` / `useRouter` / `redirect` from `@/i18n/navigation` (not `next/link`), using internal pathnames, e.g. `<Link href="/business">`, `<Link href={{ pathname: '/products/[slug]', params: { slug } }}>`.
- Every page/layout under `[locale]` must `await params` and call `setRequestLocale(locale)` before using next-intl.
- UI strings: `messages/{nl,en}/{namespace}.json`, namespaces listed in `src/i18n/request.ts`. Use `useTranslations('ns')` / `getTranslations('ns')`. Only edit the namespace files your task owns. Keep nl and en keys in sync.
- CMS content uses Payload field localization (`localized: true`); query with `locale` from params.

## Design tokens (`src/app/(app)/[locale]/globals.css`)
- Colors (Tailwind): `sand` #f4efe8 (page bg), `stone` #e8dcc8, `cream` #fbf8f2 (cards), `ink` #2e1f16 (espresso text; legacy name), `bronze` #a3562a (date accent; legacy name), `bronze-deep` #7a3f1f, `olive-grey` #6b5e4e (secondary text), `forest` #24402f / `forest-deep` #1b3123 (the only dark section colour), `palm` #46704f (green accent on light), `clay` #c9a57a (accent on forest; use `emphasisLight` there). Semantic shadcn tokens map to these.
- Fonts: `font-display` (Fraunces, headings — light weights 300–400, large sizes) and `font-sans` (Manrope, body). h1–h3 use display font automatically.
- Easing: `var(--ease-luxe)` = cubic-bezier(0.22,1,0.36,1); durations 0.8–1.2s for reveals. Respect `prefers-reduced-motion`.
- Small radius (`--radius: 0.25rem`). Buttons: uppercase, wide tracking (`tracking-[0.18em] text-xs`), ink fill or bronze outline.
- Single light theme (no dark mode).
- Logo: `Logo` (props `tagline`, `tone`) / `LogoIcon` from `@/components/icons/logo`; wordmark is bold Manrope like the business card.

## Libraries available
`motion` (import from `motion/react`), `gsap` (+ `gsap/ScrollTrigger`), `lenis` (`lenis/react`), shadcn/ui components in `src/components/ui`, `lucide-react` icons, `@mollie/api-client`, `resend`.
