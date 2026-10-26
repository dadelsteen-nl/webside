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
Visual direction: *luxury wellness* — warm sand/stone backgrounds, ink text, bronze accents, serif display headings, slow easing, generous whitespace. Original copy only (never copy text/images from imbody.com or imbodybe.com).

## Stack
- Next.js 16 App Router + Payload CMS 3.92 (ecommerce plugin) + SQLite locally (`DATABASE_URL=file:./dadelsteen.db`; Postgres later).
- Package manager: **pnpm**. Dev server: `pnpm dev` (may run on port 3001 if 3000 is busy).
- After changing collections/globals: `pnpm generate:types` and `pnpm generate:importmap`.
- Typecheck: `npx tsc --noEmit`. Baseline template errors exist in `CartModal.tsx`, `CheckoutPage.tsx`, `generatePreviewPath.ts` (owned by the shop task).

## i18n
- Locales `nl` (default) and `en`, prefix always (`/nl/...`, `/en/...`). Config in `src/i18n/routing.ts`.
- Routes live under `src/app/(app)/[locale]/<internal-path>/page.tsx`. Folder names are the **internal English pathnames**; localized URLs come from `routing.pathnames`. Add any new route to `pathnames`.
- Always link with `Link` / `useRouter` / `redirect` from `@/i18n/navigation` (not `next/link`), using internal pathnames, e.g. `<Link href="/business">`, `<Link href={{ pathname: '/products/[slug]', params: { slug } }}>`.
- Every page/layout under `[locale]` must `await params` and call `setRequestLocale(locale)` before using next-intl.
- UI strings: `messages/{nl,en}/{namespace}.json`, namespaces listed in `src/i18n/request.ts`. Use `useTranslations('ns')` / `getTranslations('ns')`. Only edit the namespace files your task owns. Keep nl and en keys in sync.
- CMS content uses Payload field localization (`localized: true`); query with `locale` from params.

## Design tokens (`src/app/(app)/[locale]/globals.css`)
- Colors (Tailwind): `sand` #f4efe8 (page bg), `stone` #e4dacb, `cream` #faf7f2 (cards), `ink` #1a1a1a, `bronze` #b08d57 (accent), `bronze-deep` #8c6d3f, `olive-grey` #6e6a5e (secondary text). Semantic shadcn tokens (`bg-background`, `text-muted-foreground`, `bg-accent`...) map to these.
- Fonts: `font-display` (Fraunces, headings — light weights 300–400, large sizes) and `font-sans` (Manrope, body). h1–h3 use display font automatically.
- Easing: `var(--ease-luxe)` = cubic-bezier(0.22,1,0.36,1); durations 0.8–1.2s for reveals. Respect `prefers-reduced-motion`.
- Small radius (`--radius: 0.25rem`). Buttons: uppercase, wide tracking (`tracking-[0.18em] text-xs`), ink fill or bronze outline.
- Single light theme (no dark mode).
- Logo: `Logo` / `LogoIcon` from `@/components/icons/logo`.

## Libraries available
`motion` (import from `motion/react`), `gsap` (+ `gsap/ScrollTrigger`), `lenis` (`lenis/react`), shadcn/ui components in `src/components/ui`, `lucide-react` icons, `@mollie/api-client`, `resend`.
