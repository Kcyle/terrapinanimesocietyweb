# Terrapin Anime Society — Website

The official website for the **Terrapin Anime Society (TAS)** at the University of Maryland, live at **[tas.umd.edu](https://tas.umd.edu)**.

It covers the club's weekly screenings, events (KameCon, TerpCon), and the Maid Cafe — including an online reservation and check-in system.

- **Framework:** [Astro](https://astro.build) (static site)
- **Language:** TypeScript + `.astro` components
- **Animation:** [GSAP](https://gsap.com)
- **Maid Cafe backend:** [Supabase](https://supabase.com) (reservations + live seat map)
- **Hosting:** GitHub Pages, auto-deployed on every push to `main`

---

## New here? Start with these

| I want to…                                             | Read this                                        |
| :----------------------------------------------------- | :----------------------------------------------- |
| Change site content (screenings, text, photos, maids)  | **[docs/EDITING-GUIDE.md](docs/EDITING-GUIDE.md)** |
| Run the site on my computer or set up the services     | **[docs/SETUP-AND-DEPLOY.md](docs/SETUP-AND-DEPLOY.md)** |
| Take over the project from the previous owner          | [Handoff checklist](docs/SETUP-AND-DEPLOY.md#handoff-checklist) |

If you only want to update what's on the site (not the code), the **Editing Guide** is the only file you need.

---

## Quick start

You need [Node.js](https://nodejs.org) 20 or newer.

```sh
npm install      # install dependencies (first time only)
npm run dev      # start the site locally at http://localhost:4321
```

Edit any file and the browser refreshes automatically. Press `Ctrl+C` in the terminal to stop.

| Command           | What it does                                  |
| :---------------- | :-------------------------------------------- |
| `npm run dev`     | Live preview at `localhost:4321`              |
| `npm run build`   | Build the production site into `dist/`        |
| `npm run preview` | Preview the built site before deploying       |

---

## Project map

Everything the club actually edits lives in **`src/data/`** and **`public/images/`**.

```text
terrapinanimesocietyweb/
├── public/                       Static files served as-is
│   ├── CNAME                     Custom domain (tas.umd.edu)
│   └── images/                   All images, grouped by purpose
│       ├── Artwork/  Backgrounds/  Cards/  Characters/
│       └── Icons/    Maids/       Photos/  Vendors/
├── src/
│   ├── pages/                    Each file is one page (its filename = its URL)
│   │   ├── index.astro           Home            → /
│   │   ├── about.astro           About the club  → /about
│   │   ├── meetings.astro        Meetings + map  → /meetings
│   │   ├── kamecon.astro         KameCon event   → /kamecon
│   │   ├── terpcon.astro         TerpCon event   → /terpcon
│   │   ├── maidcafe.astro        Maid Cafe + reservations → /maidcafe
│   │   ├── admin/                Password-gated admin tools
│   │   │   ├── screenings.astro  Screening editor       → /admin/screenings
│   │   │   └── maidcafe.astro    Maid Cafe check-in desk → /admin/maidcafe
│   │   └── api/screenings.ts     Server endpoint used by the screening editor
│   ├── sections/                 Big page sections (hero, about, event blocks)
│   ├── components/               Reusable pieces (header, footer, carousel, icons)
│   ├── layouts/BaseLayout.astro  Shared page shell (head, fonts, meta tags)
│   ├── data/                     ← Editable content (see the Editing Guide)
│   │   ├── screenings.json       Screening lineup + meeting time & location
│   │   ├── maidcafe-staff.ts     Maid / butler roster
│   │   └── umd-buildings.json    UMD building codes → names + map coordinates
│   ├── lib/supabase.ts           Supabase client for the Maid Cafe
│   ├── utils/                    Small helpers (DOM, anime API)
│   ├── animations/               GSAP scroll / hero / menu animations
│   └── styles/global.css         Global styles and color variables
├── maidcafe-schema.sql           Supabase database setup script
├── astro.config.mjs              Build config (site URL, base path)
├── .env.example                  Template listing the secrets the site needs
└── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages on push to main
```

**How Astro routing works:** any `.astro` file in `src/pages/` automatically becomes a page. `src/pages/about.astro` is served at `/about`. There is no separate router to configure.

---

## How deployment works

1. You push a change to the `main` branch on GitHub.
2. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages.
3. A minute or two later, the change is live at [tas.umd.edu](https://tas.umd.edu).

You do not need to build or upload anything by hand. Full details, including the required GitHub secrets, are in **[docs/SETUP-AND-DEPLOY.md](docs/SETUP-AND-DEPLOY.md)**.
