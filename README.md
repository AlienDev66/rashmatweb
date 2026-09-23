# RASHMAT web

Public site + creator platform for [rashmat.app](https://rashmat.app).

Same monorepo as the mobile app (`../app`). This package owns:

1. **Marketing** — brand, Instagram, waitlist / entry
2. **Creator platform / Studio** — publish programs, manage students (growing here)

Athletes train mainly in `../app` (Expo). Creators manage on the web.

## Run

```bash
cd web
bun install
bun run dev
```

Open http://localhost:5173

## Build / deploy

```bash
bun run build
# deploy dist/ → rashmat.app
```

Config: `src/brand.ts`.
