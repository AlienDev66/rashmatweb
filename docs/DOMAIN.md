# Domain — rashmat.com

Canonical public domain: **`rashmat.com`** (Squarespace registrar).

| Host | Role |
|------|------|
| `rashmat.com` / `www.rashmat.com` | Marketing site + Creator Studio (`/studio`) |
| `app.rashmat.com` | Athlete platform / Expo web (when deployed) |
| `rashmat://…` | Native app deep links (unchanged) |
| `com.rashmat.app` | iOS/Android package ID (unchanged — store identity) |

Emails in product copy: `hello@rashmat.com`, `support@rashmat.com` (create mailboxes / forwarding when DNS is live).

## Deploy + DNS (passo a passo)

### A — Meter o site no ar (Vercel)

1. Cria conta em [vercel.com](https://vercel.com) (login com GitHub).
2. Sobe o repo RASHMAT para o GitHub (se ainda não estiver).
3. Vercel → **Add New Project** → escolhe o repo.
4. Em **Root Directory** escolhe **`web`** (não a raiz do monorepo).
5. Framework: Vite. Build: `npm run build` / Output: `dist` (costuma detetar sozinho).
6. Em **Environment Variables** adiciona (as mesmas do teu `web/.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. **Deploy**. Ficas com um URL tipo `https://rashmat-xxx.vercel.app` — testa landing + `/studio`.

O ficheiro `web/vercel.json` já faz rewrite SPA para rotas como `/studio` e `/p/...`.

### B — Ligar `rashmat.com` (Squarespace → Vercel)

1. No projeto Vercel → **Settings → Domains** → adiciona `rashmat.com` e `www.rashmat.com`.
2. A Vercel mostra os registos DNS exactos (A / CNAME). Copia-os.
3. Squarespace → **Domains** → `rashmat.com` → **DNS** / **Custom records**:
   - Apex (`@` / `rashmat.com`): o **A** que a Vercel indicar (muitas vezes `76.76.21.21`).
   - `www`: **CNAME** → `cname.vercel-dns.com` (ou o valor que a Vercel mostrar).
4. Guarda. Propagação: minutos a algumas horas.
5. Na Vercel, quando o domínio ficar **Valid**, o HTTPS fica automático.

### C — Depois de estar live

1. Supabase → Authentication → URL config: Site URL `https://rashmat.com` + redirects `https://rashmat.com/**`.
2. Se tiveres `rashmat.app`: redirect 301 → `https://rashmat.com`.
3. Email: cria forward `hello@` / `support@` (ImprovMX / Google) — não uses só o parking da Squarespace.

## Supabase Auth (resumo)

Dashboard → Authentication → URL configuration:

- Site URL: `https://rashmat.com`
- Redirect allow list: `https://rashmat.com/**`, `https://app.rashmat.com/**`, `rashmat://**`, Expo `exp://**` for dev

## Code sources of truth

- Web: `web/src/brand.ts`
- App: `app/src/lib/brand.ts`
- SEO: `web/index.html`, `web/public/sitemap.xml`, `web/public/robots.txt`
