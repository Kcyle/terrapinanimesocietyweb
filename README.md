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

Avoid deleting images unless you are certain they are no longer referenced anywhere on the site. An image can be used by a page you haven't looked at, and removing it leaves a broken picture behind. If you're unsure, search the repository for the filename first.

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

.github/workflows/    Deployment configuration
```

Most pages and components read their content from the files in `src/data/`, so routine updates usually only require editing those JSON files.

Each file in `src/pages/` becomes a page on the website automatically, and its filename determines its address. `about.astro` is served at `/about`. There is no separate list of pages to maintain.

## Deployment

Pushing to the `main` branch automatically starts a GitHub Action that builds and publishes the site to GitHub Pages. Once the deployment finishes, `tas.umd.edu` updates shortly afterward.

The live website is built from the `main` branch. Avoid making experimental changes directly to `main` unless you're comfortable reverting them. If you want to try something risky, create a separate branch first.

To confirm a deployment worked, open the **Actions** tab in the repository. A green check mark means the site published successfully. A red X means the build failed and the live site was left unchanged.

If a deployment fails, click the failed run and read the step that broke. Most failures are caused by a formatting mistake in the last file that was edited.

The deployment workflow itself is stored in `.github/workflows/`. Unless you are changing how the site is deployed, you should not need to edit anything in that folder.

If the live site does not appear to update immediately, wait a minute and refresh the page. Your browser will sometimes serve you a cached copy of the previous version, which makes a successful deployment look like it did nothing. A hard refresh with **Ctrl + Shift + R** clears it.

## Undoing a mistake

Nothing you do here is permanent, and a failed build will never take the live site down. The previous version stays online until a new build succeeds.

Every commit is stored in GitHub, so any previous version of the website can be restored if something goes wrong. You are never one bad edit away from losing the site.

To undo a change you already published, open the **Commits** list on GitHub, click the commit you want to reverse, and choose **Revert**. This creates a new commit that restores the previous version, and the site redeploys automatically.

## Files you should never delete

Do not remove any of these unless you know exactly why you are doing it. They are the files most likely to break the site or the domain if deleted by accident.

| File                  | Why it matters                                          |
| --------------------- | ------------------------------------------------------- |
| `public/CNAME`        | Tells GitHub the site answers to `tas.umd.edu`          |
| `.github/workflows/`  | Contains the workflow that builds and publishes the site |
| `package.json`        | Lists the packages the site needs to build              |
| `package-lock.json`   | Pins the exact versions of those packages               |
| `astro.config.mjs`    | Core build configuration                                |

## Dependencies

This project uses Astro along with the Node packages listed in `package.json`. You normally do not need to update dependencies just to edit the website. If GitHub opens automated pull requests suggesting package updates, they are safe to ignore while you are only changing content.

If you do update a package, run `npm run build` afterward and confirm the site still builds before pushing.

## Known issues

The navigation menu and home page include links to `/subgroups` and `/contact`, but those pages do not exist. You can remove the links or create the missing pages.

`src/layouts/BaseLayout.astro` references `/favicon.svg`, but no favicon is included in `public/`. Adding a `favicon.svg` file will restore the browser tab icon.

The `/about` page still exists, but nothing links to it because the navigation points to the About section on the home page instead.

## The tas.umd.edu domain

The domain is the one part of this project the club does not control on its own, so it is worth understanding before you need it.

**The DNS is not in this repository.** The University of Maryland holds a DNS record that points `tas.umd.edu` at GitHub. That record lives on university systems, not here, and nothing you change in this repository can fix it. Today the record is a CNAME aimed at `kcyle.github.io`. GitHub then matches the incoming domain against the `public/CNAME` file in this repository, which contains the single line `tas.umd.edu`, and serves the site. Both halves have to agree or the domain stops working.

This gives you a simple diagnostic. **If GitHub Actions is deploying successfully but `tas.umd.edu` does not load, the problem is almost certainly the university's DNS configuration and not the website.** You can confirm the GitHub half under **Settings**, then **Pages**, where the custom domain should be listed with a green check and **Enforce HTTPS** enabled. You can check the university half by running:

```bash
nslookup tas.umd.edu
```

It should report a canonical name ending in `.github.io`.

**The trap when transferring the repository.** The DNS record points at a specific GitHub account. If you transfer this repository to a different personal account, the record will still be aimed at the old account, and `tas.umd.edu` will break even though the site itself is perfectly fine. Someone at the university has to update the record to point at the new owner before the domain works again.

This is the strongest argument for moving the repository into a **GitHub organization owned by the club**. You ask the university to repoint the record once, at the organization, and it never has to change again no matter how many times the presidency turns over. Doing it any other way means requesting a DNS change every single year.

**Where to request or renew the domain.** DNS for anything ending in `umd.edu` is handled by the **Division of Information Technology** through the IT Service Desk.

- The request form, used both for a new domain and for renewing or changing an existing one:
  https://itsupport.umd.edu/hosting?id=sc_cat_item&sys_id=70ca6f40dbaab740965bd5ab5e9619b7
- General documentation on university web addresses and hosting:
  https://itsupport.umd.edu/itsupport/?id=kb_article_view&sysparm_article=KB0015063

**Expect to need your advisor.** A university hostname granted to a student organization is normally sponsored by a department or a faculty advisor rather than by a student directly. In practice this means the club's faculty advisor will most likely have to submit the request, or at minimum approve it, before the Division of IT will act on it. Budget time for this. It is rarely instant, and it is the sort of request that stalls for weeks if you start it the week you need it.

**Do this now, not later.** The single most valuable thing an outgoing officer can hand over is the answer to two questions: which department or advisor sponsors the `tas.umd.edu` record, and what ticket number was used to create it. Write both down somewhere the club keeps permanently. That information is what actually gets lost between officers, and without it the next person has to restart the conversation with the university from nothing.

Sponsorship rules and renewal timing are set by the university and do change, so confirm the current process using the links above rather than assuming what worked last year still applies.

## Moving the repository to a club organization

This is the recommended long term setup, and it is worth doing once while someone who understands the site is still around. It lets several officers hold access at the same time, and it means the university never has to touch DNS again.

**Why it is worth the effort.** The DNS record has to point at whoever owns the repository. If you hand the repository to each new president in turn, the university has to change that record every single year, and every one of those requests needs advisor approval and can stall. If instead you point the record at an organization owned by the club, you ask for that change once and it is correct forever. Officers are then added and removed inside the organization, which needs no university involvement at all.

Do this during a quiet week, not in the days before an event.

**Step 1. Create the organization.** Go to **github.com/organizations/plan** and choose the **Free** plan, which allows unlimited public repositories and unlimited members at no cost.

Choose the name carefully. The organization name becomes the DNS target, so `terrapinanimesociety` would mean the record points at `terrapinanimesociety.github.io`. Renaming the organization later would break the domain again, so pick a name the club can live with permanently.

**Step 2. Add the other officers.** In the organization, open **People**, then **Invite member**. Give the current president the **Owner** role. Add other officers as members, then create a team such as **Web** and grant that team **Write** access to the repository. From then on, adding a new officer is a matter of adding them to the team.

Always keep at least **two Owners**. If the only owner graduates and loses access to their account, nobody can administer the organization.

**Step 3. Request the DNS change before you transfer anything.** Submit the request using the form linked in the domain section above, and have the faculty advisor approve or submit it. Ask for something along these lines:

> Please update the DNS record for `tas.umd.edu`. It is currently a CNAME pointing to `kcyle.github.io`. It needs to point to `terrapinanimesociety.github.io` instead, because the website repository is moving to a GitHub organization owned by the student group.

Ask them to tell you when the change will actually be applied, and wait for that answer before moving on. Requesting the change first is what keeps the outage short.

**Step 4. Transfer the repository.** In the repository, open **Settings**, then **General**, scroll to the **Danger Zone**, and choose **Transfer ownership**. Select the organization as the new owner.

The `public/CNAME` file is committed to the repository, so it travels with it and that half of the setup stays correct automatically.

**Step 5. Reconfigure Pages immediately after the transfer.** Do not leave this for later. In the transferred repository, open **Settings**, then **Pages**, set the source to **GitHub Actions**, and enter `tas.umd.edu` as the custom domain. Setting the custom domain also claims the domain on GitHub, which prevents anyone else from pointing their own site at it while the record is in transition.

Then open the **Actions** tab and run the deployment workflow once so the site rebuilds under its new owner.

**Step 6. Verify.** Once the university confirms the DNS change has been applied, run:

```bash
nslookup tas.umd.edu
```

The canonical name it reports should now be your organization rather than `kcyle.github.io`. Load `https://tas.umd.edu` in a browser to confirm, then return to **Settings**, then **Pages**, and enable **Enforce HTTPS**.

**What to expect in between.** There may be a short period after the transfer where the record still points at the old account. The site may continue to serve normally during that window, but do not rely on it. Keep the gap between the transfer and the DNS change as short as you can, and do not leave the domain unclaimed on GitHub, which is why Step 5 matters.

There are no repository secrets to migrate, because the site is static and needs none.

## Adding a backend later

This site is currently static, which is why it is free and requires no maintenance. If a future officer needs real functionality such as ticket sales, RSVPs, or a signup form, here is how to do it without throwing the site away.

**Understand the limitation first.** GitHub Pages only serves files. It cannot run server code. Astro supports server routes in `src/pages/api/`, but **those will not run on GitHub Pages**. An earlier version of this site had exactly that problem, and the affected feature silently did nothing in production. Do not spend a day debugging it.

**The approach that does work is Supabase.** Supabase is a hosted database with a free tier. The visitor's browser talks to it directly, so it works on a static site with no server of your own. A previous version of this website used precisely this setup to run maid cafe ticketing, including a live seat map.

To add it:

1. Create a free account and a new project at **supabase.com**.
2. Open the **SQL Editor** in your project and create your tables.
3. **Turn on Row Level Security on every table.** This step is not optional. See the warning below.
4. Go to **Settings**, then **API**, and copy the **Project URL** and the **anon public key**.
5. Install the client library with `npm install @supabase/supabase-js`.
6. Store the two values as `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`. Astro only exposes a variable to the browser when its name begins with `PUBLIC_`, so the prefix is required.
7. Add the same two values as repository secrets under **Settings**, then **Secrets and variables**, then **Actions**, and reference them in the build step of `.github/workflows/deploy.yml`. Without this the deployed site will not have them, even though it works on your own computer.

**The security point that matters.** The anon key is designed to sit in a browser and is safe to publish. It is only safe, however, because Row Level Security decides what that key is allowed to do. If you create tables and leave Row Level Security off, anyone who opens the browser console can read, edit, and delete everything in your database. Turn it on and write policies before you put any real data in.

**If you genuinely need server side code,** for example to process payments or to use a private API key that must never reach a browser, then GitHub Pages is the wrong host. Move the site to **Vercel** or **Netlify**, both of which run Astro server routes and both of which have free tiers. The site code itself does not need to change.

**Recovering the old system.** The previous maid cafe database schema was not thrown away. It is still in this repository's history. If you want to restore ticketing rather than design it from scratch, recover the original Supabase schema with:

```bash
git show 518c8c1:maidcafe-schema.sql > maidcafe-schema.sql
```

That file contains the reservations table, the seat table, and a function that prevents two people from booking the same seat at the same time. It is a reasonable starting point even if you build something different.

## Passing the project on

The next maintainer will need **write access** to this repository. They cannot publish anything without it, and this is the first thing people forget.

The simplest option is to transfer the repository to a GitHub organization owned by the club. If you do that, add the next officer as an **owner** or **maintainer** before removing yourself, otherwise nobody is left with access. Future officers can then be added and removed without transferring the repository again. To transfer directly to another personal account instead, use **Settings**, then **Transfer ownership**.

Before handing the project over:

1. Give the new maintainer write access, and confirm they can actually push.
2. Open **Settings**, then **Pages**, and confirm that `tas.umd.edu` is still listed as the custom domain.
3. Read the domain section above. If ownership of the repository changes, the university has to repoint the DNS record, or the domain will break. This is the most common way a handoff goes wrong.
4. Write down who sponsors the `tas.umd.edu` record at the university, and pass that on with the repository.
5. Have the new maintainer make a small change and push it, so they see the deployment process from start to finish before you leave.

## Getting help

If you need to change the site's layout or functionality, the **Astro** documentation at **docs.astro.build** is the best place to start. The animations use **GSAP**, documented at **gsap.com/docs**. Supabase, if you ever add it, is documented at **supabase.com/docs**.

Most routine updates only require editing the files in `src/data/`, and never require touching the framework itself.

## Before making changes

A short checklist worth following every time.

```text
✓ Pull the latest version of the repository
✓ Make your edits
✓ Run npm run build
✓ Commit and push
✓ Wait for the GitHub Action to finish
✓ Refresh tas.umd.edu and verify the changes
```
