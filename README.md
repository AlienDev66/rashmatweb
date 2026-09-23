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

Mux **upload** is optional. Default: MP4 to Supabase Storage (`video_url`). Mux HLS can come later when budget allows.

### Product tour

First creator login starts a **Studio guide** (Next / Back / Skip) across Dashboard → Programs → Wizard → CMS → Students → Library → Settings. Replay from **Guide** in the sidebar, Library, or Settings.

### Creator onboarding

White-glove playbook for the first 5–10 grappling creators:

- In-app: **Library → Creator onboarding playbook**
- Repo: [`docs/CREATOR_ONBOARDING.md`](docs/CREATOR_ONBOARDING.md)

Hotmart / course-platform sellers (keep checkout, add camp layer):

- In-app: **Library → Hotmart / course sellers**
- Repo: [`docs/HOTMART_CONVERSION.md`](docs/HOTMART_CONVERSION.md)

### Covers

Program covers upload to Supabase Storage bucket `covers` (`{userId}/programs/{programId}.*`). Apply migration `20260326000000_covers_owner_paths.sql` if the project was created before path-scoped policies.

## Build

```bash
bun run build
```
