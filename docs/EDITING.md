# Editing Guide

Everything on this site is written in plain JSON files inside `src/data/`. You do not need to know how to code. If you can edit a Google Doc, you can do all of this.

## How to make a change

You have two options.

**In your browser.** Open the repo on github.com, click into the file you want, click the pencil icon in the top right, type your change, then click Commit changes. The live site updates in a minute or two. Nothing to install.

**On your computer.** Run `npm install` once, then `npm run dev`, and you get a live preview at `http://localhost:4321` that updates as you type. Commit and push to `main` when you are happy with it.

## The rules of JSON

Every content file is JSON. There are only three rules, and breaking them is the only way to break the site.

1. Text goes inside double quotes: `"Annie"`.
2. Every item in a list needs a comma after it, except the last one.
3. Never delete a `{`, `}`, `[`, or `]` unless you are removing a whole block.

If the site fails to build, you almost certainly broke rule 1 or 2. Look at whatever you edited last.

## Which file do I open

| I want to change | Open this |
| :--- | :--- |
| Discord link, Join Us link, club name, footer | `src/data/site.json` |
| Home page heading, About text, photo gallery | `src/data/home.json` |
| The anime lineup, meeting time, room | `src/data/screenings.json` |
| Where the map pin drops | `src/data/buildings.json` |
| Subgroup leaders and descriptions | `src/data/subgroups.json` |
| The Activities section and its cards | `src/data/activities.json` |
| Partner logos and the Sony showcase | `src/data/partners.json` |
| KameCon page and vendor list | `src/data/kamecon.json` |
| TerpCon page, vendors, featured artists | `src/data/terpcon.json` |

## The screening schedule

Open `src/data/screenings.json`. This one file controls the anime shown on the home page and the meetings page, and the meeting details.

Each show is one block:

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

All of it comes off the show's page on [MyAnimeList](https://myanimelist.net). The `malId` is the number in the MAL address bar. For `image`, right click the poster on MAL and choose Copy Image Address.

To add a show, copy an existing block, paste it inside the `"screenings": [ ... ]` list, and change the values. To remove a show, delete its block and the comma that follows it.

At the bottom of the same file are the meeting details:

```json
"startDate": "2025-02-08",
"meetingTime": "5-7 PM",
"location": {
  "buildingCode": "STP",
  "roomNumber": "0200"
}
```

`startDate` is when the first screening of the semester happens, written as year, month, day. `meetingTime` appears on the site exactly as you type it. `buildingCode` has to match a building in `buildings.json`.

## Moving the meeting to a new building

Open `src/data/buildings.json`. The meetings page drops a pin on a campus map using this list. If you set a `buildingCode` in `screenings.json` that is not in this file, the map cannot find it, so add the building first:

```json
{
  "code": "STP",
  "name": "Adele H. Stamp Student Union",
  "shortName": "Stamp",
  "lat": 38.9882,
  "lng": -76.9447
}
```

To get `lat` and `lng`, find the building on Google Maps, right click it, and copy the two numbers.

## Subgroups

Open `src/data/subgroups.json`. Each subgroup has a leader, a meeting time, and a description. These change most often when leadership turns over.

```json
{
  "id": "animusic",
  "name": "Animusic",
  "tagline": "Anime Music & J-Music",
  "meets": "Saturdays 4-7pm",
  "leader": "Annie",
  "description": "Please check the Discord for updates.",
  "previewImage": "/images/Backgrounds/animusic.png",
  "photos": []
}
```

Change `leader` and `description` freely. Leave `id` alone, because the colors and layout for each subgroup are tied to it. If you leave `meets` as an empty string `""`, the meeting time line simply does not appear.

## KameCon and TerpCon vendors

Open `src/data/kamecon.json` or `src/data/terpcon.json`. The vendor list is a long list of blocks like this:

```json
{
  "name": "GinkgoMART",
  "social": "https://ginkgomart.bigcartel.com",
  "socialDisplay": "ginkgomart.bigcartel.com",
  "description": "Prints, keychains, buttons, and stickers"
}
```

`social` is the link people click. `socialDisplay` is the text they see. If a vendor has no website, leave both out and give only a `name` and a `description`.

The event details sit at the top of the same file, so the date, time, location, and the description paragraph are all in one place.

## Words on the home page

Open `src/data/home.json`. The big heading, the club description under it, the buttons, the About paragraph, and the photo gallery are all in here.

One field is different. `descriptionHtml` contains a link to the Discord written in HTML. You can safely change the words around it. Leave the parts that start with `<a` and `<span` alone.

## Photos and images

Every image lives in `public/images/`, sorted into folders: `Backgrounds`, `Photos`, `Cards`, `Characters`, `Vendors`, `Artwork`, and `Icons`.

To use a new image, drop the file into the folder that fits, then write its path in the JSON **without** the word public. A file saved at `public/images/Photos/newphoto.webp` is written as `/images/Photos/newphoto.webp`. This catches everyone the first time.

Save images as `.webp` when you can. They look the same and load much faster.

## Colors and fonts

Open `src/styles/global.css`. The colors, fonts, and spacing are defined as variables at the very top. Change one there and it updates everywhere it is used.

## Finding anything fast

Press `/` on GitHub, or `Ctrl+Shift+F` in VS Code, and paste in the exact sentence you see on the live site. It takes you straight to the file and the line that produces it. This is faster than guessing which file to open.

## Before you publish

If you edited on your computer, run `npm run build` first. If it finishes without errors, push it. If it fails, reread the three JSON rules at the top of this page and check your last edit.
