# Terrapin Anime Society Website

This repository contains the source code for **tas.umd.edu**. If you're taking over maintenance of the club website, this guide explains how it's organized and how to keep it updated.

The site is entirely static. There is no server, database, user accounts, or hosting costs. To make changes, edit the appropriate files, commit them to GitHub, and push to the `main` branch. The website will usually update within a minute or two after deployment.

You do not need to be a programmer to maintain this site. Most updates are a matter of changing text inside a file and saving it.

## Making a change

There are two ways to edit the site. Pick whichever you're comfortable with.

**Option 1: Edit directly on GitHub.** This requires no installation and is the fastest way to make small updates.

1. Open the repository on **github.com** and click into the file you want to change.
2. Click the **pencil icon** in the upper right of the file view.
3. Make your change.
4. Scroll down, enter a short description of what you changed, and click **Commit changes**.

That's it. The site rebuilds and goes live on its own within a minute or two.

**Option 2: Edit on your own computer.** This is better for larger changes, because you can preview the site before publishing anything. See **Running the site locally** below.

## Updating site content

Most of the website's content is stored as JSON files in `src/data/`. In most cases, you can update text, links, images, and other information without modifying the site's code.

| File                       | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `src/data/site.json`       | Club name, Discord invite, Join Us link, and footer          |
| `src/data/home.json`       | Home page heading, About section, gallery, and card carousel |
| `src/data/screenings.json` | Anime schedule, meeting time, start date, and room           |
| `src/data/buildings.json`  | Campus buildings and map coordinates                         |
| `src/data/subgroups.json`  | Subgroup leaders, meeting times, and descriptions            |
| `src/data/activities.json` | Activities section and activity cards                        |
| `src/data/partners.json`   | Partner logos and Sony screening showcase                     |
| `src/data/kamecon.json`    | KameCon description, links, photos, and vendors              |
| `src/data/terpcon.json`    | TerpCon date, time, location, vendors, and featured artists  |

For detailed editing instructions, see `docs/EDITING.md`. If you're only updating website content, that guide is all you need.

## Finding the text you want to change

You do not need to memorize which file holds what. The fastest method is to search for the text you can already see on the live website.

- **On GitHub:** open the repository, press the **/** key, and type a sentence you see on the site.
- **In VS Code:** press **Ctrl + Shift + F** (**Cmd + Shift + F** on a Mac) and type the same thing.
- **Inside a single file:** press **Ctrl + F** to jump straight to a word.

For example, if you want to change the meeting time shown on the home page, search for the current time exactly as it appears on the site. The search results will point you to the exact file and line. This works for nearly any text, link, or image on the website, and it is far quicker than opening files one by one.

## Editing JSON without breaking the site

The content files use a format called JSON. It's just text, but it is strict about punctuation. Nearly every broken build comes down to one of these three rules.

1. **Text goes inside double quotes.** `"leader": "Annie"` is correct. `"leader": Annie` is not.
2. **Items in a list are separated by commas, and the last item has no comma after it.**
3. **Do not delete a `{`, `}`, `[`, or `]`** unless you are deliberately removing an entire block.

A safe way to add something new is to copy an existing block, paste it directly below, and change the values inside it. That way the punctuation is already correct.

If a deployment fails after you edit a JSON file, look at that file first. It is almost always a missing comma or a missing quotation mark.

## Running the site locally

Install **Node.js 20 or newer** and **Git**, then run:

```bash
git clone https://github.com/Kcyle/terrapinanimesocietyweb.git
cd terrapinanimesocietyweb
npm install
npm run dev
```

The development server will be available at `http://localhost:4321` and automatically refresh whenever you save changes. Press **Ctrl + C** to stop it.

Before pushing changes, run:

```bash
npm run build
```

If the build finishes successfully, the site is ready to deploy. If it fails, the cause is usually a missing comma or quotation mark in a JSON file.

To publish your changes:

```bash
git add .
git commit -m "Update screening schedule"
git push
```

If you'd rather not use commands, install **GitHub Desktop**, which lets you commit and push by clicking buttons instead.

## Adding images

All images live in `public/images/`, sorted into folders by purpose: `Backgrounds`, `Photos`, `Cards`, `Characters`, `Vendors`, `Artwork`, and `Icons`.

To add a new image, place the file in the folder that fits, then reference it in the JSON **without the word `public`** in the path. An image saved at `public/images/Photos/newphoto.webp` is written as `/images/Photos/newphoto.webp`. This is the most common mistake people make, so it's worth reading twice.

Save images in `.webp` format whenever possible. They look identical to a JPG or PNG but are far smaller, which keeps the site loading quickly on phones.

## Changing colors and fonts

Colors, fonts, and spacing are defined once at the top of `src/styles/global.css` as variables, on the lines beginning with `--`. Changing a value there updates it everywhere on the site, so you never have to hunt down the same color in multiple places.

## Project structure

```text
public/
  CNAME               Custom domain configuration
  images/             Images used throughout the site

src/
  data/               Site content and configuration
  pages/              Individual website pages
    index.astro       Home page
    about.astro       /about
    meetings.astro    /meetings
    kamecon.astro     /kamecon
    terpcon.astro     /terpcon
  components/         Reusable UI components
  sections/           Home page sections
  layouts/            Shared page layouts
  animations/         GSAP animations
  styles/global.css   Global styles and design variables
  utils/              Utility functions
```

Most pages and components read their content from the files in `src/data/`, so routine updates usually only require editing those JSON files.

Each file in `src/pages/` becomes a page on the website automatically, and its filename determines its address. `about.astro` is served at `/about`. There is no separate list of pages to maintain.

## Deployment

Pushing to the `main` branch automatically starts a GitHub Action that builds and publishes the site to GitHub Pages. Once the deployment finishes, `tas.umd.edu` updates shortly afterward.

To confirm a deployment worked, open the **Actions** tab in the repository. A green check mark means the site published successfully. A red X means the build failed and the live site was left unchanged.

If a deployment fails, click the failed run and read the step that broke. Most failures are caused by a formatting mistake in the last file that was edited.

## Undoing a mistake

Nothing you do here is permanent, and a failed build will never take the live site down. The previous version stays online until a new build succeeds.

To undo a change you already published, open the **Commits** list on GitHub, click the commit you want to reverse, and choose **Revert**. This creates a new commit that restores the previous version, and the site redeploys automatically.

## Known issues

The navigation menu and home page include links to `/subgroups` and `/contact`, but those pages do not exist. You can remove the links or create the missing pages.

`src/layouts/BaseLayout.astro` references `/favicon.svg`, but no favicon is included in `public/`. Adding a `favicon.svg` file will restore the browser tab icon.

The `/about` page still exists, but nothing links to it because the navigation points to the About section on the home page instead.

## Passing the project on

The simplest option is to transfer the repository to a GitHub organization owned by the club. Future officers can then be added or removed without transferring ownership again. If transferring directly to another account, use **Settings**, then **Transfer ownership**.

Before handing the project over, open **Settings**, then **Pages**, and confirm that `tas.umd.edu` is still listed as the custom domain. Make sure the person managing the `umd.edu` DNS records knows the new contact, and have the new maintainer make a small change and push it so they can see the deployment process from start to finish.

## Getting help

The site is built with **Astro**. If you need to change something beyond the content files, the official documentation at **docs.astro.build** is the best place to start. The animations use **GSAP**, documented at **gsap.com/docs**.
