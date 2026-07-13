# Editing Guide

Plain-English instructions for updating the site's content. **You do not need to be a programmer to use this guide** - most updates are typing into a text file.

## Two ways to make an edit

**Option A - Edit directly on GitHub (easiest for small text or data changes)**

1. Open the repository on [github.com](https://github.com/Kcyle/terrapinanimesocietyweb).
2. Click into the file you want to change (paths are given below).
3. Click the edit (pencil) icon in the top-right of the file.
4. Make your change, then click **Commit changes** at the top.
5. The site rebuilds and goes live in about 1-2 minutes.

**Option B - Edit on your computer (better for bigger changes)**

Run `npm install` once, then `npm run dev`, and preview at `http://localhost:4321` while you edit. When you're happy, commit and push to `main`.

> **Tip - finding anything fast:** In VS Code press `Ctrl+Shift+F` (or on GitHub, press `/`) and type the exact words you see on the live site. That search takes you straight to the file and line that produces it. This is the fastest way to locate any piece of text.

---

## The screening schedule (`/meetings` and the home page)

**File:** [`src/data/screenings.json`](../src/data/screenings.json)

This one file controls the anime lineup shown on the home page and the meetings page, plus the meeting time and location.

Each anime is one block like this:

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

- `malId` - the anime's ID on [MyAnimeList](https://myanimelist.net). Open the anime's MAL page and copy the number from its URL (`myanimelist.net/anime/44511/...`).
- `title`, `synopsis`, `episodes`, `score` - shown on the card. Copy these from the MAL page.
- `image` - the poster image URL. Right-click the poster on MAL and choose "Copy Image Address".

**To add an anime:** copy an existing block, paste it inside the `"screenings": [ ... ]` list, and change the values. Put a comma between blocks. **To remove one:** delete its block (and the comma).

At the **bottom** of the same file are the meeting details:

```json
"startDate": "2025-02-08",
"meetingTime": "5-7 PM",
"location": {
  "buildingCode": "STP",
  "roomNumber": "0200"
}
```

- `startDate` - the date the first screening starts (format `YYYY-MM-DD`).
- `meetingTime` - shown as-is, e.g. `"5-7 PM"`.
- `location.buildingCode` - a UMD building code (see next section).
- `location.roomNumber` - the room, e.g. `"0200"`.

---

## The meeting location on the map

The meetings page shows the location on a UMD map. Building codes and their map pins come from:

**File:** [`src/data/umd-buildings.json`](../src/data/umd-buildings.json)

If you set a `buildingCode` in `screenings.json` that isn't listed here, add it:

```json
{
  "code": "STP",
  "name": "Adele H. Stamp Student Union",
  "shortName": "Stamp",
  "lat": 38.9882,
  "lng": -76.9447
}
```

Get the `lat`/`lng` by finding the building on [Google Maps](https://maps.google.com), right-clicking it, and copying the two numbers.

---

## Text on a page

Each page is a single file in [`src/pages/`](../src/pages). Open the one that matches the URL and edit the text between the tags. The text you see on the site is written right there in plain English.

| Page on the site   | File to edit                                             |
| :----------------- | :------------------------------------------------------ |
| Home               | [`src/pages/index.astro`](../src/pages/index.astro) and [`src/components/HeroContent.astro`](../src/components/HeroContent.astro) |
| About              | [`src/pages/about.astro`](../src/pages/about.astro)     |
| Meetings           | [`src/pages/meetings.astro`](../src/pages/meetings.astro) |
| KameCon            | [`src/pages/kamecon.astro`](../src/pages/kamecon.astro) |
| TerpCon            | [`src/pages/terpcon.astro`](../src/pages/terpcon.astro) |

Remember the search tip: type the exact sentence you want to change into `Ctrl+Shift+F` and it will jump you to the right spot.

The list of vendors for KameCon is a list near the top of [`src/pages/kamecon.astro`](../src/pages/kamecon.astro) - copy an existing `{ name: ..., social: ..., description: ... }` line to add a vendor.

---

## Club links (Discord, TerpLink, etc.)

- **Main Discord invite** appears in [`src/components/navigation/DiscordLink.astro`](../src/components/navigation/DiscordLink.astro) and [`src/components/HeroContent.astro`](../src/components/HeroContent.astro) - search for `discord.gg`.
- **TerpLink "Join Us" link** - search for `terplink.umd.edu`.
- **Partner clubs** shown on the home page - [`src/components/PartnersSection.astro`](../src/components/PartnersSection.astro).

---

## Images and photos

**Folder:** [`public/images/`](../public/images) - organized by purpose:

| Folder         | Used for                                  |
| :------------- | :---------------------------------------- |
| `Backgrounds/` | Large background images behind sections   |
| `Photos/`      | Event and cosplay photos                  |
| `Cards/`       | Home-page card carousel images            |
| `Characters/`  | Character artwork                         |
| `Vendors/`     | KameCon vendor logos                      |
| `Artwork/` and `Icons/` | Misc artwork and small icons     |

**To add an image:** drop the file into the matching folder, then reference it in code by its path **without** the word `public`. A file at `public/images/Photos/newphoto.webp` is written as `/images/Photos/newphoto.webp`.

**Tip:** use `.webp` images where possible - they look the same but load much faster, which keeps the site quick.

---

## Colors and fonts

**File:** [`src/styles/global.css`](../src/styles/global.css) - site-wide colors, fonts, and spacing live at the top as CSS variables (lines starting with `--`). Change a value there and it updates everywhere it's used.

---

## Before you publish

If you edited on your computer, run this once to make sure nothing is broken:

```sh
npm run build
```

If it finishes without errors, you're safe to commit and push. If it reports an error, it usually means a missing comma or quotation mark in a `.json` file - double-check your last edit.
