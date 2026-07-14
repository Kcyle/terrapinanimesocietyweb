# Editing Guide

Everything in here can be done by someone who has never written a line of code. If you can edit a Google Doc, you can do all of this. Most of it is just typing into a text file and hitting save.

## Two ways to make a change

**From your browser, which is what you'll do most of the time.**

Open the repo on github.com, click into the file you want, click the little pencil icon in the top right, make your change, then hit "Commit changes" at the top. Give it a minute or two and it's live on tas.umd.edu. You don't have to install anything.

**From your computer, which is better for anything bigger.**

Run `npm install` once, then `npm run dev`, and you get a live preview at `http://localhost:4321` that updates as you type. When you're happy with it, commit and push to `main`.

**The trick that saves you the most time:** press `/` on GitHub, or `Ctrl+Shift+F` in VS Code, then paste in the exact sentence you can see on the live site. It takes you straight to the file and the line that produces it. Use this instead of digging through folders.

## Changing the screening schedule

**File:** [`src/data/screenings.json`](../src/data/screenings.json)

This one file controls the anime lineup on both the home page and the meetings page, plus the meeting time and where it's held. Each show is a block that looks like this:

```json
{
  "malId": 44511,
  "title": "Chainsaw Man",
  "synopsis": "Denji is a teenage boy living with a Chainsaw Devil...",
  "image": "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
  "episodes": 12,
  "score": 8.5
}
```

All of that comes straight off the show's [MyAnimeList](https://myanimelist.net) page. The `malId` is the number sitting in the MAL URL (`myanimelist.net/anime/44511/...`). For `image`, right click the poster on MAL and choose "Copy Image Address". The rest you can read off the page.

To add a show, copy an existing block, paste it inside the `"screenings": [ ... ]` list, and change the values. Make sure there's a comma between blocks. To drop a show, delete its block and its comma.

Scroll to the **bottom** of the same file and you'll find the meeting details:

```json
"startDate": "2025-02-08",
"meetingTime": "5-7 PM",
"location": {
  "buildingCode": "STP",
  "roomNumber": "0200"
}
```

`startDate` is when the first screening of the semester happens, written as year, month, day. `meetingTime` shows up on the site exactly as you type it. `buildingCode` has to match a building in the file described next, and `roomNumber` is just the room.

## Moving the meeting to a different building

**File:** [`src/data/umd-buildings.json`](../src/data/umd-buildings.json)

The meetings page shows a little campus map with a pin on it. The pin location comes from this file. If you put a `buildingCode` in `screenings.json` that isn't listed in here, the map won't know where to go, so add the building first:

```json
{
  "code": "STP",
  "name": "Adele H. Stamp Student Union",
  "shortName": "Stamp",
  "lat": 38.9882,
  "lng": -76.9447
}
```

To get `lat` and `lng`, find the building on [Google Maps](https://maps.google.com), right click it, and copy the two numbers it gives you.

## Changing the words on a page

Every page is one file inside [`src/pages/`](../src/pages), and the text you see on the site is written right there in plain English. Open the file that matches the page and type over it.

The home page is a little different. `src/pages/index.astro` is mostly a shell, and the actual words (the big heading, the club description, the buttons, the About blurb) live in [`src/components/HeroContent.astro`](../src/components/HeroContent.astro). If you're hunting for home page text, look there.

The rest are straightforward: `about.astro`, `meetings.astro`, `kamecon.astro`, `terpcon.astro`.

Honestly though, don't bother remembering which file is which. Just use the search trick at the top of this page.

## KameCon vendors

The vendor list is near the top of [`src/pages/kamecon.astro`](../src/pages/kamecon.astro). It's a plain list, one line per vendor. Copy an existing line and change the name, the link, and the description to add a new one.

## Discord and club links

The Discord invite shows up in a couple of places, so search for `discord.gg` and you'll find them all. Same idea for the "Join Us" button, search for `terplink.umd.edu`. The partner club logos on the home page are in [`src/components/PartnersSection.astro`](../src/components/PartnersSection.astro).

## Photos and images

Everything lives in [`public/images/`](../public/images), sorted into folders by what it's for: `Backgrounds`, `Photos`, `Cards` (the carousel on the home page), `Characters`, `Vendors`, `Artwork`, and `Icons`.

To add one, drop the file into whichever folder fits, then point at it in the code **without** the word "public" in the path. A file saved at `public/images/Photos/newphoto.webp` gets written in the code as `/images/Photos/newphoto.webp`. That trips up everybody the first time.

Save your images as `.webp` if you can. They look identical and they're a fraction of the size, which keeps the site from feeling sluggish on phones.

## Colors and fonts

**File:** [`src/styles/global.css`](../src/styles/global.css)

The site's colors, fonts, and spacing are all defined as variables at the very top of this file (the lines that start with `--`). Change one there and it updates everywhere that uses it, so you're not hunting down the same color in twelve places.

## One thing to do before you publish

If you edited on your computer rather than in the browser, run this first:

```sh
npm run build
```

If it finishes without complaining, you're good to push. If it throws an error, don't panic, it's almost always a missing comma or a missing quote mark in a `.json` file. Go look at whatever you edited last.
