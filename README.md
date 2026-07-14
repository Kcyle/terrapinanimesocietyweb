# Terrapin Anime Society Website

This is the code behind [tas.umd.edu](https://tas.umd.edu). If you just took over the club, this page tells you what you need to keep the site running.

There is no server, no database, no logins, and nothing to pay for. It is a static website. You change a file, push it to GitHub, and the live site updates itself about a minute later.

## Everything you edit is in one folder

All of the words, links, photos, and lists on this site live in `src/data/` as plain JSON files. You do not need to open the code to change what the site says.

| File | What it controls |
| :--- | :--- |
| `src/data/site.json` | Club name, Discord invite, Join Us link, footer |
| `src/data/home.json` | Home page heading, About section, photo gallery, card carousel |
| `src/data/screenings.json` | The anime lineup, plus meeting time, start date, and room |
| `src/data/buildings.json` | Campus buildings and their map coordinates |
| `src/data/subgroups.json` | The five subgroups: leader, meeting time, description |
| `src/data/activities.json` | The Activities section and every activity card |
| `src/data/partners.json` | Partner logos and the Sony screening showcase |
| `src/data/kamecon.json` | KameCon description, links, photos, and vendor list |
| `src/data/terpcon.json` | TerpCon date, time, location, vendors, featured artists |

Open [docs/EDITING.md](docs/EDITING.md) for step by step instructions on each one. If you only want to update content, that guide is the only thing you need to read.

## Running it on your own computer

Install Node.js 20 or newer from [nodejs.org](https://nodejs.org), then:

```sh
npm install
npm run dev
```

That gives you a live preview at `http://localhost:4321` which refreshes as you type. `Ctrl+C` stops it.

Run `npm run build` before you push. If it finishes without errors you are safe. If it fails, the cause is usually a missing comma or a missing quote mark in a JSON file you just edited.

## Where everything lives

```text
public/
  CNAME               The custom domain. Leave this alone or tas.umd.edu breaks.
  images/             Every image on the site, sorted into folders.

src/
  data/               All editable content. This is the folder you want.
  pages/              One file per page. The filename becomes the URL.
    index.astro         the home page
    about.astro         /about
    meetings.astro      /meetings
    kamecon.astro       /kamecon
    terpcon.astro       /terpcon
  components/         Reusable pieces: header, footer, card carousel, icons.
  sections/           The home page hero wrapper.
  layouts/            BaseLayout.astro, the shared HTML shell every page uses.
  animations/         The GSAP scroll and menu animations.
  styles/global.css   Colors, fonts, and spacing, defined as variables at the top.
  utils/              Small helpers.
```

The files in `src/pages` and `src/components` read their text and images from `src/data`. That means you can change almost anything on the site without touching a single line of code.

## How it goes live

Push to the `main` branch. A GitHub Action builds the site and publishes it to GitHub Pages, and tas.umd.edu picks it up a minute or two later. You can watch it run in the Actions tab.

If a deploy fails, open the failed run and read the step that broke. It is almost always a typo in whatever file was edited last.

## Things that are already broken

These were already the case before this cleanup, so you are not going crazy.

The nav menu and the home page link to `/subgroups` and `/contact`, but neither page was ever built, so both links go nowhere. You can remove them from `src/data/home.json` and `src/components/navigation/NavigationMenu.astro`, or build the pages.

`src/layouts/BaseLayout.astro` asks for `/favicon.svg`, but there is no favicon in `public/`, so the site has no icon in the browser tab. Add a `favicon.svg` to `public/` and it starts working.

The `/about` page still exists, but nothing links to it, because the About item in the nav points at a section on the home page instead. Keep it or delete it.

## Passing it on

The cleanest option is to move this repo into a GitHub organization owned by the club. After that you never transfer it again. You add the next president as an owner and remove yourself. Otherwise open Settings, scroll to the bottom, and transfer the repo to their account.

Before you hand it over:

1. Check that Settings then Pages still lists `tas.umd.edu` as the custom domain.
2. Make sure whoever manages the `umd.edu` DNS knows who the new contact is.
3. Sit with the new person while they make one small edit and push it, so they have watched it go live once.
