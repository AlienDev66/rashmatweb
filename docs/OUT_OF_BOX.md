# Out of the box — status & explanations

## Verified / shipped this pass

| Item | Status |
|------|--------|
| **Mux upload (platform)** | Edge Function scaffold + Studio **Upload video** UI. Needs `MUX_TOKEN_*` secrets + deploy. Creators do **not** need Mux accounts. |
| **Publish checklist** | Enforced: custom cover + ≥1 session + ≥1 drill + ≥1 video. |
| **Athlete onboarding** | Recommendations → **Start first session** (enroll + open day 1). |
| **Share program** | `https://rashmat.app/p/{id}` → Open in app (`rashmat://program/{id}`). |
| **Mock catalog in prod** | Mock only in `__DEV__`; production no longer invents fake camps on fetch failure. |

---

## Why Mux? Do creators pay Mux?

**No — creators don’t create Mux accounts or pay Mux.**

RASHMAT owns **one** Mux org. Studio uploads through our function with platform tokens. We store `playback_id`; the app streams HLS.

| Who | Mux role |
|-----|----------|
| Creator | Uploads video in Studio (or pastes ID while ops configures Mux) |
| RASHMAT | Pays Mux (encoding + delivery); prices into Pro later |
| Athlete | Presses play — adaptive video on phone |

Why not only Supabase Storage MP4? Mobile training needs adaptive bitrate; Mux is the locked architecture choice for session video.

Setup: see `app/supabase/functions/mux-direct-upload/README.md`.

---

## Explain: Pagamentos + entitlements

**Today:** checkout is a demo form → `enroll_program` free. Membership is a profile field, barely gating content.

**Out-of-box paid product needs:**

1. Real payment (Stripe on web / RevenueCat on iOS+Android — stores dislike linking out for IAP).
2. **Entitlement** = “user X may access program Y” (table or RevenueCat entitlement), checked before play.
3. Webhooks so refunds revoke access.

Without this you can beta with free enroll; you can’t charge Hotmart-style sellers’ audiences on-platform.

---

## Explain: Import assistido (Hotmart → camp)

Sellers already have **Module → Lesson** trees. A wizard that accepts pasted outline or CSV:

```
Week,Day,Title
1,1,Frames & hip escape
1,2,Positional rounds
```

…creates the schedule in one click. No Hotmart API required. Cuts white-glove time. **Not built yet** — next after Mux is live.

---

## Explain: Códigos / link de acesso

Hotmart keeps checkout. After purchase, seller gives `rashmat.app/p/{id}` or a code that calls `enroll_program` without payment.

Use case: “Bought my guard course on Hotmart → open this link → train the 6-week camp.”

**Share page is step 1.** Access codes / redeem UI still to build.

---

## Explain: Tirar mock fallback

If Supabase fails in production and we served mock BJJ programs, athletes would see **fake catalog** and think it’s real. Now mock is **dev-only**. Prod shows empty/error and you fix infra.
