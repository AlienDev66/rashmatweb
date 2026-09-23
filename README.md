# RASHMAT web

Public site + **Creator Studio / CMS** for [rashmat.app](https://rashmat.app).

## Run

```bash
cd web
cp .env.example .env   # same Supabase project as the app
bun install
bun run dev
```

- Site: http://localhost:5173  
- Studio: http://localhost:5173/studio  

## Studio (complete CMS)

Sidebar app with:

| Route | Purpose |
|-------|---------|
| `/studio` | Dashboard + quick actions |
| `/studio/programs` | Catalog (search, publish, duplicate, delete) |
| `/studio/programs/new` | Wizard + templates + auto-schedule |
| `/studio/programs/:id` | Program meta + fill missing days |
| `/studio/cms` | Deep editor: sessions, drills, Mux, reorder |
| `/studio/students` | Enrollment progress |
| `/studio/library` | Templates & drill presets |
| `/studio/settings` | Account |

### Automations (less busywork)

- Program templates (BJJ, No-Gi, Striking, blank)
- Auto-create `weeks × days/week` sessions with rotating day patterns
- Seed starter drills from template
- Auto-fill missing days later
- Duplicate program / session (with drills)
- One-tap drill presets + full starter block
- Reorder / duplicate last drill

Mux **upload** still comes later — paste playback IDs for now.

## Build

```bash
bun run build
```
