# Baby Shower · The Mystery

One-off invitation app for one combined baby-shower + gender-reveal event. A photo-led landing page styled as a case file, name-only RSVP, post-confirmation location/time reveal, and a tailnet-gated admin view. Bilingual ES/EN.

## Quick start

```sh
bun install
bun run dev
```

Open http://localhost:3000 — English at `/`, Spanish at `/es/*`.

## Commands

| Command                | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `bun run dev`          | Dev server with hot reload                     |
| `bun run build`        | Tailwind CSS + islands client bundle to `static/` |
| `bun start`            | Production server (run `build` first)          |
| `bun test`             | Test suite                                     |
| `bun run check-types`  | `tsc --noEmit`                                 |
| `bun run lint`         | oxlint                                         |
| `bun run format`       | oxfmt (write)                                  |

## Stack

- Bun runtime + Bun bundler
- Hono + `@hono/zod-validator` + Hono RPC (`hc`)
- Preact SSR with streaming + islands hydration (`<preact-island>` custom elements; hooks, no signals)
- Tailwind CSS v4 (`@theme` in `src/global.css`) + tailwind-variants
- Zod schemas shared between client and server
- SQLite via Drizzle + `bun:sqlite` (planned)
- Server-side image optimization via `Bun.Image` (planned)

## Layout

```
src/
├── main.ts              Hono server entry
├── islands.ts           client hydration entry + ISLANDS registry
├── islands/             interactive islands (e.g. RsvpForm)
├── components/          shared UI (tailwind-variants) + Document shell
├── lib/
│   ├── i18n.ts          hand-rolled ES/EN dictionaries
│   ├── client.ts        shared Hono RPC client
│   ├── preact-islands.tsx  island() / registerIslands() runtime
│   └── schemas/         Zod schemas (rsvp)
├── routes/              Hono routes (home, rsvp)
└── global.css           Tailwind v4 theme
assets/                  photo masters
prototype/               visual-direction prototype (static HTML)
docs/content-inventory.md  ES/EN copy deck
CONTEXT.md               domain glossary (use its terms verbatim)
```

## Contributing

- All tickets and the wayfinder map live in this repo's issues (map: #1).
- Deployment (nix packaging, OCI image, Caddy vhost) is handled by the [homelab flake](https://github.com/fveracoechea/homelab); do not add nix files here.
- See [AGENTS.md](./AGENTS.md) for agent-facing conventions.
