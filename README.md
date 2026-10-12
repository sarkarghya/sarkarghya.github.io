# arghyasarkar.com

Personal site for Arghya Sarkar, built with [Astro](https://astro.build) and deployed to Cloudflare with [Alchemy](https://alchemy.run).

## Layout

- `src/` — Astro pages, layouts, components, and content (`src/content/writing/` holds the posts)
- `public/` — static assets served as-is
- `alchemy.run.ts` — deploy config (static Astro site on `arghyasarkar.com`)
- `astro.config.mjs` — Astro config (static output, site URL)
- `V1/` — the previous Vite/React version of the site, kept for reference

## Development

```sh
bun install
bun run dev       # local dev server
bun run build     # static build to dist/
bun run preview   # serve the built site locally
```

## Deploy

```sh
bun run deploy    # alchemy deploy --stage prod
bun run destroy   # alchemy destroy --stage prod
```
