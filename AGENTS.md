# Baby-shower invitation app

Invitation app for one combined baby-shower + gender-reveal event: landing page with photos, name-only RSVP, post-confirmation location/time reveal, tailnet-gated admin view. Bilingual ES/EN.

## Stack

- Bun runtime + Bun bundler
- Hono (HTTP framework) + @hono/zod-validator + Hono RPC (`hc`)
- Preact SSR with streaming + islands hydration (hooks, no signals)
- Tailwind CSS v4 (`@theme` in `src/global.css`) + tailwind-variants
- Zod schemas in `src/lib/schemas/`
- i18n: Hono `languageDetector` + hand-rolled dictionaries (`src/lib/i18n.ts`)
- Drizzle + `bun:sqlite`
- `Bun.Image` server-side image optimization (planned; ticket #11 on the tracker)

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues on `fveracoechea/baby-shower`; use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles use their default label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
