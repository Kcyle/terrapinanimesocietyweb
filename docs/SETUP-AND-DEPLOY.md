# Setup, Services & Deployment

Everything a technical owner needs to run the site locally, configure its backend services, deploy it, and hand it off. For day-to-day content changes, see [EDITING-GUIDE.md](EDITING-GUIDE.md) instead.

## Contents

- [Running it locally](#running-it-locally)
- [Environment variables](#environment-variables)
- [Services](#services)
  - [Supabase (Maid Cafe reservations)](#supabase-maid-cafe-reservations)
  - [Google OAuth (Maid Cafe sign-in)](#google-oauth-maid-cafe-sign-in)
  - [Admin tools](#admin-tools)
- [Deployment](#deployment)
- [Handoff checklist](#handoff-checklist)

---

## Running it locally

**Prerequisites:** [Node.js](https://nodejs.org) 20+ and [Git](https://git-scm.com).

```sh
git clone https://github.com/Kcyle/terrapinanimesocietyweb.git
cd terrapinanimesocietyweb
npm install
npm run dev          # http://localhost:4321
```

The public pages (home, about, meetings, events) work without any configuration. Only the **Maid Cafe reservation flow** and the **admin tools** need the environment variables and services below.

---

## Environment variables

Copy the template and fill in real values:

```sh
cp .env.example .env
```

`.env` is git-ignored and must never be committed. The variables:

| Variable                     | Needed for                        | Notes                                                        |
| :--------------------------- | :-------------------------------- | :----------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`        | Maid Cafe reservations            | From your Supabase project settings.                         |
| `PUBLIC_SUPABASE_ANON_KEY`   | Maid Cafe reservations            | The Supabase **anon/public** key (safe to expose in a browser). |
| `PUBLIC_GOOGLE_CLIENT_ID`    | Maid Cafe Google sign-in          | From Google Cloud OAuth credentials.                         |
| `ADMIN_PASSWORD`             | Admin screening editor + check-in | The password that unlocks the `/admin/*` pages.              |
| `GITHUB_TOKEN`               | Admin screening editor (saving)   | A GitHub token with write access; only used server-side.     |
| `GITHUB_OWNER` / `GITHUB_REPO` | Admin screening editor          | Optional; default to `Kcyle` / `terrapinanimesocietyweb`.    |

Variables prefixed with `PUBLIC_` are readable in the browser by design (that is how Astro exposes them to client code). Everything else stays server-side.

---

## Services

### Supabase (Maid Cafe reservations)

The Maid Cafe reservation system and live seat map are backed by a Supabase (Postgres) database.

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the project's **SQL Editor** and run the entire [`maidcafe-schema.sql`](../maidcafe-schema.sql) script. It creates:
   - `maidcafe_reservations` — one row per reservation.
   - `maidcafe_seats` — 96 seats (16 tables × 6), with realtime enabled for the live map.
   - `reserve_seats(...)` — an atomic function that prevents two people from booking the same seat.
3. Copy the project's **URL** and **anon key** from Settings → API into `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.

> Row-Level Security is enabled with open policies suited to an anonymous public reservation form. If you later add anything sensitive, tighten these policies.

### Google OAuth (Maid Cafe sign-in)

The Maid Cafe lets guests sign in with Google (via Supabase Auth).

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth 2.0 Client ID** (Web application).
2. Add your site's domain (and `http://localhost:4321` for local testing) to the **Authorized JavaScript origins**.
3. In Supabase → Authentication → Providers, enable Google and paste the client ID/secret.
4. Put the client ID into `PUBLIC_GOOGLE_CLIENT_ID`.

### Admin tools

Two password-gated pages, both unlocked by `ADMIN_PASSWORD`:

- **`/admin/maidcafe`** — a check-in dashboard with instant search over reservations (reads from Supabase).
- **`/admin/screenings`** — an in-browser editor for the screening lineup. When you save, it calls the `/api/screenings` endpoint, which commits the updated `src/data/screenings.json` to GitHub using `GITHUB_TOKEN`, triggering a redeploy.

> **Important:** the screening editor's *save* feature needs a server runtime to run `/api/screenings`. The production site is a **static** GitHub Pages build, which does not run that endpoint. The reliable way to update screenings on the live site is to **edit [`src/data/screenings.json`](../src/data/screenings.json) directly** (see the [Editing Guide](EDITING-GUIDE.md#the-screening-schedule-meetings-and-the-home-page)). Keep the admin editor for local use, or host on a server-capable platform if you want live saving.

---

## Deployment

Deployment is automatic via GitHub Actions ([`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)):

1. Push to `main` (or run the workflow manually from the Actions tab).
2. The workflow installs dependencies, runs `npm run build`, and publishes `dist/` to GitHub Pages.
3. The custom domain comes from [`public/CNAME`](../public/CNAME) (`tas.umd.edu`); `astro.config.mjs` sets the same `site` URL.

**GitHub secrets** — the build reads these from the repo's **Settings → Secrets and variables → Actions**. Set them there so the deployed site can reach Supabase and the admin tools:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_GOOGLE_CLIENT_ID`
- `ADMIN_PASSWORD`

If a deploy fails, open the **Actions** tab on GitHub and read the failed step's log — it's almost always a missing secret or a syntax error in a recently edited file.

---

## Handoff checklist

When transferring the club (and this site) to the next owner:

- [ ] **Add the new owner** to the GitHub repository (Settings → Collaborators) — or transfer ownership of the repo to them.
- [ ] **Rotate shared secrets** the old owner knew: change `ADMIN_PASSWORD`, and issue a fresh `GITHUB_TOKEN`. Update both the new `.env` and the GitHub Actions secrets.
- [ ] **Hand over the service accounts** the site depends on, or recreate them under the club's shared account: the Supabase project, the Google Cloud OAuth credentials, and the payment handles (Venmo/Zelle) referenced on the Maid Cafe page.
- [ ] **Update contact details** on the site if they change — search the codebase for `terrapinanimesociety@gmail.com` and `@kcyle_` and replace as needed (see the [Editing Guide](EDITING-GUIDE.md#common-maid-cafe-edits)).
- [ ] **Confirm the custom domain** (`tas.umd.edu`) DNS still points to GitHub Pages, and that whoever manages the `umd.edu` subdomain knows the new contact.
- [ ] **Do a test deploy:** make a tiny edit, push to `main`, and confirm it goes live. That proves the whole pipeline works end-to-end for the new owner.
