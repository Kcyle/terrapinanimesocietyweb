# Terrapin Anime Society - Website

The official website for the **Terrapin Anime Society (TAS)** at the University of Maryland, live at **[tas.umd.edu](https://tas.umd.edu)**.

It covers the club's weekly screenings and events (KameCon, TerpCon). It is a fully static site with no backend, database, or login required.

- **Framework:** [Astro](https://astro.build)
- **Language:** TypeScript + `.astro` components
- **Animation:** [GSAP](https://gsap.com)
- **Hosting:** GitHub Pages, auto-deployed on every push to `main`

---

## New here? Start with this

To change what's on the site (screenings, text, photos), you don't need to touch the code. Read the **[Editing Guide](docs/EDITING-GUIDE.md)** first.

---

## Quick start

You need [Node.js](https://nodejs.org) 20 or newer.

```sh
npm install      # install dependencies (first time only)
npm run dev      # start the site locally at http://localhost:4321
```

Edit any file and the browser refreshes automatically. Press `Ctrl+C` in the terminal to stop.

| Command           | What it does                             |
| :---------------- | :--------------------------------------- |
| `npm run dev`     | Live preview at `localhost:4321`         |
| `npm run build`   | Build the production site into `dist/`   |
| `npm run preview` | Preview the built site before deploying  |

No environment variables or accounts are needed to run or build the site.

---

## Project map

Everything the club actually edits lives in **`src/data/`** and **`public/images/`**.

```text
terrapinanimesocietyweb/
├── public/
│   ├── CNAME                     Custom domain (tas.umd.edu)
│   └── images/                   All images, grouped by purpose
│       ├── Artwork/  Backgrounds/  Cards/  Characters/
│       └── Icons/    Photos/       Vendors/
├── src/
│   ├── pages/                    Each file is one page (its filename = its URL)
│   │   ├── index.astro           Home            -> /
│   │   ├── about.astro           About the club  -> /about
│   │   ├── meetings.astro        Meetings + map  -> /meetings
│   │   ├── kamecon.astro         KameCon event   -> /kamecon
│   │   └── terpcon.astro         TerpCon event   -> /terpcon
│   ├── sections/HeroSection.astro  The home-page hero wrapper
│   ├── components/               Reusable pieces (header, footer, carousel, icons)
│   ├── layouts/BaseLayout.astro  Shared page shell (head, fonts, meta tags)
│   ├── data/                     <- Editable content (see the Editing Guide)
│   │   ├── screenings.json       Screening lineup + meeting time & location
│   │   └── umd-buildings.json    UMD building codes -> names + map coordinates
│   ├── utils/                    Small helpers (DOM, anime API)
│   ├── animations/               GSAP scroll / hero / menu animations
│   └── styles/global.css         Global styles and color variables
├── astro.config.mjs              Build config (site URL, base path)
└── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages on push to main
```

**How Astro routing works:** any `.astro` file in `src/pages/` automatically becomes a page. `src/pages/about.astro` is served at `/about`. There is no separate router to configure.

---

## How deployment works

1. You push a change to the `main` branch on GitHub.
2. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages.
3. A minute or two later, the change is live at [tas.umd.edu](https://tas.umd.edu).

You do not need to build or upload anything by hand, and there are no secrets to configure. The custom domain comes from [`public/CNAME`](public/CNAME).

---

## Handing off to the next owner

When passing the club (and this site) to the next person:

1. **Add them to the repo** (Settings -> Collaborators), or transfer the repo to them or to a club-owned GitHub organization.
2. **Confirm the domain:** in Settings -> Pages, make sure the custom domain `tas.umd.edu` is still set, and that whoever manages the `umd.edu` DNS knows the new contact.
3. **Update contact details** on the site if they change (see the [Editing Guide](docs/EDITING-GUIDE.md)).
4. **Do a test deploy:** make a small edit, push to `main`, and confirm it goes live. That proves the whole pipeline works for the new owner.
