# ScamShield

Screenshot a suspicious SMS, WhatsApp message, or email. Get a verdict — scam, uncertain, or
genuine — with the specific evidence that gave it away, in seconds.

Built with Next.js 14 (App Router), Supabase (Auth + Database + Storage), Groq (Vision + AI
reasoning), Resend (email reports), and Recharts (analytics).

---

## 1. Prerequisites

- Node.js 18+ installed
- A free [Supabase](https://supabase.com) account
- A free [Groq](https://console.groq.com) account (for the API key)
- A free [Resend](https://resend.com) account (for sending report emails)

## 2. Install dependencies

```bash
npm install
```

## 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → New query → paste the entire contents of `supabase/schema.sql` → Run.
   This creates all tables, Row Level Security policies, and seeds the scam pattern reference data.
3. Go to **Storage** → Create a new bucket named `scan-images`. You can leave it private —
   the app generates signed access through your own account.
4. Go to **Settings → API** and copy your **Project URL** and **anon public key**.

## 4. Set up Groq

1. Go to [console.groq.com/keys](https://console.groq.com/keys) and create an API key.
2. Note: the code uses `llama-3.2-90b-vision-preview` for vision + reasoning in one call.
   Check [console.groq.com/docs/models](https://console.groq.com/docs/models) for the current
   vision-capable model name, since Groq occasionally renames/updates preview models — swap the
   model string in `lib/groq.ts` if needed.

## 5. Set up Resend

1. Create an account at [resend.com](https://resend.com) and generate an API key.
2. For testing, Resend's sandbox domain works out of the box. For production, verify your own
   domain under **Domains** and update the `from` address in
   `app/api/send-report/route.ts`.

## 6. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the four values you collected above.

## 7. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 8. Deploy

Push this repo to GitHub, then import it into [Vercel](https://vercel.com) — it auto-detects
Next.js. Add the same four environment variables in the Vercel project settings before deploying.

---

## Project structure

```
app/
  page.tsx                  → Landing page
  login/, signup/            → Auth pages
  dashboard/
    scan/                     → Upload + analyze a screenshot
    history/                  → Past scans (view/delete)
    analytics/                → Charts and stats
  api/
    scan/route.ts             → Handles upload → Groq Vision/AI → save to DB
    send-report/route.ts      → Sends the scan report via Resend
lib/
  groq.ts                     → Groq Vision + AI analysis logic
  supabase/                   → Browser + server Supabase clients
components/                   → Shared UI pieces
supabase/schema.sql            → Full database schema + RLS policies + seed data
middleware.ts                  → Protects /dashboard routes, redirects logged-in users away from auth pages
```

## What to demo

1. Sign up, land on the scan page.
2. Upload a real (or recreated) scam SMS screenshot.
3. Watch the verdict + specific reasoning appear.
4. Show it land in the history list.
5. Show the analytics dashboard with the verdict/category breakdown.

That's the whole pitch, end to end, in under two minutes.
