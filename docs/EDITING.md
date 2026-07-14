# Editing Guide

This guide covers every content file on the site and explains what each field does. The main README covers the basics of making a change, finding text, and publishing, so read that first if you have not.

Every file described here lives in `src/data/` and is plain text. You do not need to write any code to change what the website says.

## Before you start

The content files use JSON, which is strict about punctuation. Text goes inside double quotes, items in a list are separated by commas, and the last item in a list has no comma after it. The safest way to add anything new is to copy an existing block, paste it below, and change the values inside it.

If a build fails after you edit, check the file you just changed. It is nearly always a missing comma or quotation mark.

## The screening schedule

This lives in `src/data/screenings.json`, and it is the single file that controls the anime lineup on both the home page and the meetings page, along with the meeting details.

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

Every value comes from the show's page on MyAnimeList.

| Field      | Where it comes from                                                |
| ---------- | ------------------------------------------------------------------ |
| `malId`    | The number in the MyAnimeList address bar for that show            |
| `title`    | The show's title, written how you want it displayed                |
| `synopsis` | The description shown on the card                                  |
| `image`    | Right click the poster on MyAnimeList and choose Copy Image Address |
| `episodes` | Episode count                                                      |
| `score`    | The rating shown on MyAnimeList                                    |

To add a show, copy an existing block, paste it inside the `"screenings": [ ... ]` list, and change the values. To remove a show, delete its block along with the comma that follows it.

Near the top of the same file is the start date:

```json
"startDate": "2025-02-08"
```

This is the date of the first screening of the semester, written as year, month, day. The site counts forward from that date to work out which week each show plays, so it needs updating at the start of every semester.

## Where the meetings are held

This is the `location` block near the top of `src/data/screenings.json`, and it is what the meetings page displays.

```json
"location": {
  "building": "PARREN J MITCHELL ART-SOCIOLOGY",
  "address": "3834 Campus Dr, College Park, MD 20740",
  "rooms": [
    { "label": "Regular Meetings", "value": "Room 3207 (Classroom)" },
    { "label": "Special Events", "value": "Room 2203 (Lecture Hall)" }
  ]
}
```

If the club moves buildings, change `building` and `address`. The `rooms` list can hold as many entries as you need, and each one is a label with a value beside it, so you can add a third row or remove one without touching any code.

The photograph of the building next to this information is in `src/components/NowScreening.astro`. Search for `sociology.webp` to find it, and replace it with a picture of the new building if the club moves.

## The wording on the meetings page

Also near the top of `src/data/screenings.json`:

```json
"meetingsHeading": "Meetings",
"screeningsTitle": "This Week's Screening Options",
"screeningsSubtitle": "During each meeting, we will select an episode from two different anime series to watch"
```

These are the headings shown above the anime list, and you can rewrite them freely.

## The About page

This lives in `src/data/about.json` and fills the page at `/about`. It holds the heading, the opening description, the paragraphs of body text, the button label, and the two sets of photographs. The paragraphs are a plain list, so you can add one, remove one, or reorder them.

Note that nothing on the site currently links to this page, which is listed under Known issues in the main README.

## Subgroups

These live in `src/data/subgroups.json`. Each subgroup has a leader, a meeting time, and a description, and these change most often when club leadership turns over.

```json
{
  "id": "animusic",
  "name": "Animusic",
  "tagline": "Anime Music & J-Music",
  "meets": "Saturdays 4-7pm",
  "leader": "Annie",
  "description": "Check the Discord for updates.",
  "previewImage": "/images/Backgrounds/animusic.png",
  "photos": []
}
```

You can change the name, tagline, meeting time, leader, description, and images freely.

Leave `id` alone. Each subgroup's colors and layout are tied to its `id`, so changing it will break the styling for that section.

If you set `meets` to an empty value of `""`, the meeting time line disappears from the site rather than showing a blank label.

## Activities

These live in `src/data/activities.json`, which holds the Activities heading, the paragraph underneath it, and every activity card.

```json
{
  "id": "jeopardy",
  "name": "Anime Jeopardy",
  "feature": "Anime Edition",
  "description": "A trivia game featuring anime themed questions."
}
```

`feature` is the small label that appears above the description. It is optional, so if a card does not need one, leave the line out entirely. As with subgroups, leave `id` alone, because each card's appearance is tied to it.

## Partners

These live in `src/data/partners.json`, which fills the Partners section on the home page.

The `logos` list holds the partner organizations. Each one has a name, a link, an image, and a `position` of `left`, `center`, or `right`, which decides where it sits in the row.

Below that, `showcase` holds the sentence about the Sony partnership and the row of film posters beneath it. Each poster has a title, an image, and a status such as Screened or Upcoming. Setting `upcoming` to `true` styles that poster differently, and setting `featured` to `true` makes the middle poster stand out. To add a newly announced film, copy an existing poster block and change the values.

## KameCon and TerpCon

These live in `src/data/kamecon.json` and `src/data/terpcon.json`. The event details sit at the top of each file, so the date, time, location, description, and links are all in one place. Below them is the vendor list, where each vendor is one block:

```json
{
  "name": "GinkgoMART",
  "social": "https://ginkgomart.bigcartel.com",
  "socialDisplay": "ginkgomart.bigcartel.com",
  "description": "Prints, keychains, buttons, and stickers"
}
```

`social` is the address the link points to, and `socialDisplay` is the text visitors actually see. If a vendor has no website, leave both of those lines out and give only a name and a description.

`terpcon.json` also has a `featuredArtists` list, which fills the artwork gallery. Each entry pairs an artist with a piece of their artwork and a small avatar image.

Updating these two files each year is usually the largest single job on the site, so expect the vendor lists to be long.

## The home page

This lives in `src/data/home.json`, which contains the large heading, the club description below it, the buttons, the whole About section, the photo gallery, and the list of images in the rotating card carousel.

One field behaves differently from the rest. `descriptionHtml` is written in HTML rather than plain text, because it contains a link. You can rewrite the words around it safely, but leave the parts beginning with `<a` and `<span` alone, since they create the link and the highlighted channel name.

The `{discordUrl}` you see inside it is a placeholder. The site fills it in from `site.json` when it builds, so you do not need to paste the Discord address in twice. Leave it as it is.

## Club wide details

These live in `src/data/site.json`, which holds the things that appear on more than one page.

The Discord invite is here, and it is the only place it is stored, so changing `discordUrl` updates the button in the header and the link in the About paragraph together. The Join Us link that points at TerpLink works the same way.

The navigation menu is also here, under `nav`. Each entry has a label and a link, and an entry can have a `children` list to give it a dropdown. This is where you would rename an event, for example changing TerpCon 2026 to TerpCon 2027.

`pageTitles` sets the text shown in the browser tab for each page, and `metaDescription` is the sentence search engines display underneath the site name. The footer text is here too.

## Images

Images live in `public/images/`, sorted into folders by purpose: Backgrounds, Photos, Cards, Characters, Vendors, Artwork, and Icons.

To use a new image, put the file into the folder that fits, then reference it in the JSON without the word `public` in the path. An image saved at `public/images/Photos/newphoto.webp` is written as `/images/Photos/newphoto.webp`.

Save images as `.webp` when you can. They look the same as a JPG or PNG but are considerably smaller, which keeps the site fast on phones.

## Colors and fonts

These live in `src/styles/global.css`. The colors, fonts, and spacing used across the site are defined once as variables at the top of the file, on the lines beginning with `--`. Changing a value there updates it everywhere, so you never need to find and replace the same color in several files.

## Finding things quickly

Rather than guessing which file holds a piece of text, search for the text itself. Press `/` on GitHub, or Ctrl and Shift and F in VS Code, then paste in a sentence exactly as it appears on the live site. The results take you straight to the file and line that produces it.

## Before you publish

If you are working on your own computer, run `npm run build` before pushing. A successful build means the site is safe to publish. A failure almost always points back to punctuation in the last JSON file you touched.
