# Terrapin Anime Society Website

This is the code behind [tas.umd.edu](https://tas.umd.edu). If you just took over the club, this page should tell you everything you need to keep the site running.

The good news up front: there is no server to babysit, no database, no logins, and nothing to pay for. It's a plain static website. You change a file, push it to GitHub, and about a minute later the live site updates itself.

## If you only want to change what's on the site

You probably don't need to touch code at all. The things people actually ask you to update (which anime are screening, the meeting time, the room, photos, the text on a page) all live in a few obvious files. Open [docs/EDITING-GUIDE.md](docs/EDITING-GUIDE.md) and follow it. Most of it you can do straight from github.com in your browser without installing a single thing.

The one trick worth learning: press `/` on GitHub, or `Ctrl+Shift+F` in VS Code, and paste in the exact sentence you see on the live site. It jumps you straight to the file that produces it. That works for basically any text anywhere on the site, and it will save you more time than anything else in this README.

## Running it on your own computer

Install Node.js 20 or newer from [nodejs.org](https://nodejs.org), then:

```sh
npm install
npm run dev
```

That gives you a live preview at `http://localhost:4321` that refreshes as you type. `Ctrl+C` stops it.

Before you push anything, run `npm run build`. If it finishes clean, you're fine. If it fails, nine times out of ten it's a missing comma or a missing quote mark in one of the `.json` files you just edited.

## Where everything lives

```text
public/
  CNAME               The custom domain. Leave this alone or tas.umd.edu breaks.
  images/             Every image on the site, sorted into folders.

src/
  pages/              One file per page. The filename becomes the URL.
    index.astro         the home page
    about.astro         /about
    meetings.astro      /meetings
    kamecon.astro       /kamecon
    terpcon.astro       /terpcon
  data/               The two files you'll actually open. See below.
  components/         Reusable pieces: header, footer, card carousel, icons.
  sections/           The home page hero wrapper.
  layouts/            BaseLayout.astro, the shared HTML shell every page uses.
  animations/         The GSAP scroll and menu animations.
  styles/global.css   Colors, fonts, spacing. All variables at the top.
  utils/              Small helpers.
```

The two files you'll open constantly:

`src/data/screenings.json` holds the anime lineup, and at the bottom of that same file, the meeting time, the start date, and the room number. Changing the semester's schedule is really just editing this one file.

`src/data/umd-buildings.json` is the list of campus buildings with their map coordinates. The meetings page uses it to drop the pin on the map. If you move the meeting to a building that isn't in this list, add it here or the map won't find it.

For images, drop the file into the right folder under `public/images`, then refer to it in the code without the word "public". So `public/images/Photos/newphoto.webp` gets written as `/images/Photos/newphoto.webp`. Save things as `.webp` when you can, they look the same and load much faster.

## How it goes live

Push to the `main` branch. That's the whole process. A GitHub Action builds the site and publishes it to GitHub Pages, and tas.umd.edu picks it up a minute or two later. You can watch it happen in the Actions tab.

If a deploy ever goes red, click into the failed run and read the step that broke. It's almost always a typo in whatever file was edited last.

## Things that are already broken, so you don't go hunting

Being straight with you about what you're inheriting:

The nav menu and the home page both link to `/subgroups` and `/contact`, but neither page was ever built, so those links go nowhere. Either build the two pages or pull the links out. They're in `src/components/navigation/NavigationMenu.astro` and `src/components/HeroContent.astro`.

`src/layouts/BaseLayout.astro` asks for `/favicon.svg`, but there's no favicon in `public/`, so the site has no icon in the browser tab. Drop a `favicon.svg` into `public/` and it will just start working.

There's an `/about` page that still exists, but nothing links to it anymore, because the "About" item in the nav points at a section on the home page instead. Keep it or delete it, your call.

## Passing it on

When your term ends, the cleanest move is to put this repo inside a GitHub organization owned by the club, one time. After that you never transfer anything again, you just add the next president as an owner and remove yourself. If you'd rather keep it simple, go to Settings, scroll to the bottom, and transfer the repo straight to their account.

Whichever way you go, do these three things before you hand over the keys:

1. Check that Settings then Pages still has `tas.umd.edu` set as the custom domain.
2. Make sure whoever manages the `umd.edu` DNS knows who the new contact is.
3. Sit with the new person while they make one tiny edit and push it, so they've watched the whole thing go live once with their own eyes. That single run through is worth more than this entire README.
