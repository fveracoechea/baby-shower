# Baby-shower invitation app

Invitation app for one combined baby-shower + gender-reveal event: landing page with photos, name-only RSVP, post-confirmation location/time reveal, tailnet-gated admin view. Bilingual ES/EN.

## Stack

- Bun runtime + Bun bundler
- Hono (HTTP framework) + @hono/zod-validator + Hono RPC (`hc`)
- Preact SSR with streaming + islands hydration (hooks, no signals)
- Tailwind CSS v4 (`@theme` in `src/global.css`) + tailwind-variants
- Zod schemas in `src/lib/schemas/`
- i18n: Hono `languageDetector` + hand-rolled dictionaries (`src/lib/i18n.ts`)
- Drizzle + `bun:sqlite` (planned; not wired yet)
- `Bun.Image` server-side image optimization (planned; ticket #11 on the tracker)

## Commands

- `bun install` — install deps
- `bun run dev` — dev server with hot reload
- `bun run build` — Tailwind CSS + islands client bundle into `static/`
- `bun start` — production server (run `build` first)
- `bun test` — test suite
- `bun run check-types` — `tsc --noEmit`
- `bun run lint` — oxlint
- `bun run format` — oxfmt (write); `bun run format:check` — check only

Run `lint`, `format`, `check-types`, and `test` before committing.

## Conventions

- **Domain language**: `CONTEXT.md` is the glossary — use its terms verbatim (Guest, RSVP, nameKey, Plus-one, Reveal, Cutoff, Retrieval, Admin view, Headcount, The Mystery, Witness, Secret Envelope, Theory).
- **Copy**: `docs/content-inventory.md` holds the ES/EN copy inventory; UI strings come from there via `src/lib/i18n.ts`.
- **Islands**: wrap with `island(Component, name)` from `src/lib/preact-islands.tsx` and register the loader in the `ISLANDS` map in `src/islands.ts`. Islands receive no serialized props; they are self-sufficient.
- **File names**: kebab-case.
- **Commit messages**: descriptive, reference tracker tickets as `(ticket #n)`; never add co-author lines.

## Boundaries

- **Issue tracker**: all tickets live in this repo's issues (wayfinder map: #1). Wayfinding operations (sub-issues, blocking, frontier queries) are documented in `docs/agents/issue-tracker.md` in the homelab repo; substitute repo `fveracoechea/baby-shower`.
- **Deployment**: nix packaging, OCI image, and the `services/baby-shower.nix` module live in the homelab flake. Do not add nix files to this repo.
