# Terrapin Anime Society Website

This repository contains the source code for tas.umd.edu. If you are taking over maintenance of the club website, this guide explains how it is organized and how to keep it updated.

The site is entirely static. There is no server, database, user accounts, or hosting costs. To make a change you edit a file, commit it to GitHub, and push it to the `main` branch. The website updates itself a minute or two later.

## Making a change

There are two ways to edit the site, and either one is fine.

The first is to edit directly on GitHub, which requires no installation and is the fastest way to make small updates. Open the repository on github.com, click into the file you want to change, and click the pencil icon in the upper right of the file view. Make your change, then scroll down, write a short description of what you did, and click Commit changes. The site rebuilds and goes live on its own within a minute or two.

The second is to edit on your own computer, which is better for larger changes because you can preview the site before publishing anything. That process is described under Running the site locally.

## Updating site content

Most of the website's content is stored as JSON files in `src/data/`. In most cases you can update text, links, images, and other information without modifying any of the site's code.

| File                       | Purpose                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `src/data/site.json`       | Discord invite, Join Us link, navigation menu, page titles, footer |
| `src/data/home.json`       | Home page heading, About section, gallery, and card carousel       |
| `src/data/about.json`      | The `/about` page                                                  |
| `src/data/screenings.json` | Anime schedule, start date, and the meeting location               |
| `src/data/subgroups.json`  | Subgroup leaders, meeting times, and descriptions                  |
| `src/data/activities.json` | Activities section and activity cards                              |
| `src/data/partners.json`   | Partner logos and Sony screening showcase                          |
| `src/data/kamecon.json`    | KameCon description, links, photos, and vendors                    |
| `src/data/terpcon.json`    | TerpCon date, time, location, vendors, and featured artists        |

Every field in every one of these files is used by the site. If you change a value there, it changes on the website. Nothing in `src/data/` is decorative.

For instructions on each of these files, see `docs/EDITING.md`. If you are only updating website content, that guide is all you need.

## Finding the text you want to change

You do not need to memorize which file holds what. The quickest approach is to search for text you can already see on the live website.

On GitHub, open the repository, press the `/` key, and type a sentence from the site. In VS Code, press Ctrl and Shift and F together, or Cmd and Shift and F on a Mac, and do the same. To search inside a file you already have open, press Ctrl and F.

For example, if you want to change the meeting time on the home page, search for the time exactly as it appears on the site. The results will point you to the file and the line that produces it. This works for almost any text, link, or image on the website, and it is much faster than opening files one at a time.

## Editing JSON without breaking the site

The content files use a format called JSON. It is only text, but it is strict about punctuation, and nearly every failed build comes down to one of three rules.

Text goes inside double quotes, so `"leader": "Annie"` is correct and `"leader": Annie` is not. Items in a list are separated by commas, and the last item in a list has no comma after it. Finally, do not delete a `{`, `}`, `[`, or `]` unless you are deliberately removing a whole block.

The safest way to add something new is to copy an existing block, paste it directly below, and change the values inside it. The punctuation is then already correct.

If a build fails after you edit a JSON file, look at that file first. It is almost always a missing comma or a missing quotation mark.

## Running the site locally

Install Node.js version 20 or newer, and Git, then run:

```bash
git clone https://github.com/Kcyle/terrapinanimesocietyweb.git
cd terrapinanimesocietyweb
npm install
npm run dev
```

The development server runs at `http://localhost:4321` and refreshes automatically whenever you save a change. Press Ctrl and C to stop it.

Before pushing anything, run:

```bash
npm run build
```

If the build finishes without errors, the site is ready to deploy. If it fails, the cause is usually a missing comma or quotation mark in a JSON file.

To publish your changes:

```bash
git add .
git commit -m "Update screening schedule"
git push
```

If you would rather not use commands, GitHub Desktop lets you commit and push by clicking buttons instead.

## Adding images

Images live in `public/images/`, sorted into folders by purpose: Backgrounds, Photos, Cards, Characters, Vendors, Artwork, and Icons.

To add a new image, put the file in the folder that fits, then reference it in the JSON without the word `public` in the path. An image saved at `public/images/Photos/newphoto.webp` is written in the JSON as `/images/Photos/newphoto.webp`. Leaving `public` in the path is the most common mistake people make here.

Save images in `.webp` format when you can. They look the same as a JPG or PNG but are much smaller, which keeps the site quick on phones.

Avoid deleting images unless you are sure they are no longer used anywhere. An image may be referenced by a page you have not looked at, and removing it leaves a broken picture behind. If you are unsure, search the repository for the filename first.

## Changing colors and fonts

Colors, fonts, and spacing are defined once at the top of `src/styles/global.css` as variables, on the lines that begin with `--`. Changing a value there updates it everywhere on the site, so you do not have to find the same color in several files.

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

Every file in `src/pages/` becomes a page on the website automatically, and its filename determines its address, so `about.astro` is served at `/about`. There is no separate list of pages to keep in sync.

## Deployment

Pushing to the `main` branch starts a GitHub Action that builds the site and publishes it to GitHub Pages. Once it finishes, tas.umd.edu updates shortly afterward.

The live website is built from `main`, so avoid making experimental changes directly on that branch unless you are comfortable reverting them. If you want to try something risky, create a separate branch first.

To check whether a deployment worked, open the Actions tab in the repository. A green check means the site published. A red cross means the build failed, in which case the live site is left on its previous version rather than being taken down.

If a deployment fails, click the failed run and read the step that broke. Most failures are a formatting mistake in whichever file was edited last.

The deployment workflow itself lives in `.github/workflows/`. Unless you are changing how the site is deployed, you should not need to edit anything in that folder.

If the live site does not seem to update, wait a minute and refresh. Browsers often serve a cached copy of the previous version, which makes a successful deployment look like it did nothing. Pressing Ctrl and Shift and R forces a fresh copy.

## Undoing a mistake

Nothing here is permanent, and a failed build will never take the live site down. The previous version stays online until a new build succeeds.

Every commit is stored in GitHub, so any earlier version of the website can be restored. A bad edit cannot lose the site.

To undo a change you have already published, open the Commits list on GitHub, click the commit you want to reverse, and choose Revert. That creates a new commit restoring the previous version, and the site redeploys on its own.

## Files you should never delete

Do not remove any of these unless you know exactly why. They are the files most likely to break the site or the domain if they go missing.

| File                  | Why it matters                                           |
| --------------------- | -------------------------------------------------------- |
| `public/CNAME`        | Tells GitHub the site answers to tas.umd.edu             |
| `.github/workflows/`  | Contains the workflow that builds and publishes the site |
| `package.json`        | Lists the packages the site needs in order to build      |
| `package-lock.json`   | Pins the exact versions of those packages                |
| `astro.config.mjs`    | Core build configuration                                 |

## Dependencies

This project uses Astro along with the Node packages listed in `package.json`. You do not need to update dependencies just to edit the website. If GitHub opens automated pull requests suggesting package updates, they are safe to ignore while you are only changing content.

If you do update a package, run `npm run build` afterward and confirm the site still builds before you push.

## Known issues

The navigation menu and the home page both link to `/subgroups` and `/contact`, but neither page was ever built, so those links go nowhere. You can either remove the links or create the pages.

`src/layouts/BaseLayout.astro` references `/favicon.svg`, but there is no favicon in `public/`, so the site has no icon in the browser tab. Adding a `favicon.svg` file to `public/` will fix it.

The `/about` page still exists, but nothing links to it, because the About item in the navigation points at a section on the home page instead.

## The tas.umd.edu domain

The domain is the one part of this project the club does not control on its own, so it is worth reading this section before you need it.

The DNS record that points tas.umd.edu at GitHub lives on university systems, not in this repository. Nothing you change here can fix it. At the moment that record is a CNAME aimed at `kcyle.github.io`. GitHub then compares the incoming domain against the `public/CNAME` file in this repository, which contains the single line `tas.umd.edu`, and serves the site. Both halves have to agree or the domain stops working.

That gives you a simple way to tell the two apart. If GitHub Actions is deploying successfully but tas.umd.edu will not load, the problem is almost certainly the university's DNS configuration rather than the website. You can confirm the GitHub side under Settings, then Pages, where the custom domain should appear with a green check and Enforce HTTPS turned on. You can check the university side by running:

```bash
nslookup tas.umd.edu
```

It should report a canonical name ending in `.github.io`.

There is a catch when the repository changes hands. The DNS record points at one specific GitHub account, so if the repository is transferred to a different account, the record still points at the old one and tas.umd.edu breaks even though the website itself is fine. Someone at the university has to repoint the record before the domain works again.

This is the main reason to move the repository into a GitHub organization owned by the club. You ask the university to repoint the record once, at the organization, and it never has to change again regardless of how many times the presidency turns over. Handing the repository from one president to the next instead means asking the university for a DNS change every year.

DNS for anything ending in umd.edu is handled by the Division of Information Technology through the IT Service Desk. The request form, used both for a new domain and for renewing or changing an existing one, is at:

https://itsupport.umd.edu/hosting?id=sc_cat_item&sys_id=70ca6f40dbaab740965bd5ab5e9619b7

General documentation on university web addresses and hosting is at:

https://itsupport.umd.edu/itsupport/?id=kb_article_view&sysparm_article=KB0015063

A university hostname given to a student organization is normally sponsored by a department or a faculty advisor rather than by a student directly. In practice this means the club's faculty advisor will most likely have to submit the request, or at least approve it, before the Division of IT will act on it. This is rarely instant, so start it early rather than in the week you need it.

The most useful thing an outgoing officer can pass on is the answer to two questions: which department or advisor sponsors the tas.umd.edu record, and what ticket number was used to create it. Write both down somewhere the club keeps permanently. That is the information that tends to get lost between officers, and without it the next person has to start the conversation with the university from nothing.

Sponsorship rules and renewal timing are set by the university and do change, so confirm the current process through the links above rather than assuming last year's process still applies.

## Moving the repository to a club organization

This is the recommended long term setup. It lets several officers hold access at once, and it means the university never has to touch DNS again. It is worth doing while someone who understands the site is still around.

The reason it is worth the effort is that the DNS record has to point at whoever owns the repository. If the repository is handed to each new president in turn, the university has to change that record every year, and each of those requests needs advisor approval and can stall. If the record points at an organization owned by the club instead, you ask for that change once and it stays correct. Officers are then added and removed inside the organization, which needs no university involvement at all.

Do this during a quiet week rather than in the days before an event.

Start by creating the organization at github.com/organizations/plan and choosing the Free plan, which allows unlimited public repositories and unlimited members at no cost. Choose the name carefully, because the organization name becomes the DNS target. An organization called `terrapinanimesociety` means the record points at `terrapinanimesociety.github.io`. Renaming the organization later would break the domain again, so pick a name the club can keep.

Next, add the other officers. In the organization, open People, then Invite member. Give the current president the Owner role. Add other officers as members, then create a team such as Web and give that team Write access to the repository. Adding a new officer after that is just a matter of adding them to the team. Always keep at least two Owners, because if the only owner graduates and loses access to their account, nobody can administer the organization.

Request the DNS change before you transfer anything. Submit the request using the form linked in the previous section, and have the faculty advisor approve or submit it. Ask for something along these lines:

> Please update the DNS record for tas.umd.edu. It is currently a CNAME pointing to kcyle.github.io. It needs to point to terrapinanimesociety.github.io instead, because the website repository is moving to a GitHub organization owned by the student group.

Ask them when the change will actually be applied and wait for that answer before you go further. Requesting the change first is what keeps the gap short.

Then transfer the repository. In the repository, open Settings, then General, scroll to the Danger Zone, and choose Transfer ownership, selecting the organization as the new owner. The `public/CNAME` file is committed to the repository, so it travels with it and that half of the setup stays correct on its own.

Reconfigure Pages immediately after the transfer rather than leaving it for later. In the transferred repository, open Settings, then Pages, set the source to GitHub Actions, and enter tas.umd.edu as the custom domain. Setting the custom domain also claims it on GitHub, which stops anyone else pointing their own site at the address while the record is in transition. Then open the Actions tab and run the deployment workflow once so the site rebuilds under its new owner.

Finally, once the university confirms the DNS change has been applied, run `nslookup tas.umd.edu` again. The canonical name should now be the organization rather than `kcyle.github.io`. Load the site in a browser to confirm, then go back to Settings, then Pages, and turn on Enforce HTTPS.

There may be a short period after the transfer where the record still points at the old account. The site may keep serving during that window, but do not count on it. Keep the gap between the transfer and the DNS change as short as you can. There are no repository secrets to migrate, because the site is static and does not need any.

## Adding a backend later

The site is static at the moment, which is why it is free and needs no maintenance. If a future officer needs real functionality such as ticket sales, RSVPs, or a signup form, it can be added without throwing the site away.

The limitation to understand first is that GitHub Pages only serves files. It cannot run server code. Astro supports server routes in `src/pages/api/`, but those will not run on GitHub Pages. An earlier version of this site had exactly that problem, and the affected feature quietly did nothing once deployed.

The approach that does work is Supabase, a hosted database with a free tier. The visitor's browser talks to it directly, so it works on a static site with no server of your own. An earlier version of this website used precisely that setup to run maid cafe ticketing, including a live seat map.

To add it, create a free account and a new project at supabase.com, open the SQL Editor in your project, and create your tables. Turn on Row Level Security on every table, which is covered below and is not optional. Go to Settings, then API, and copy the Project URL and the anon public key. Install the client library with `npm install @supabase/supabase-js`. Store the two values as `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, since Astro only exposes a variable to the browser when its name begins with `PUBLIC_`. Then add the same two values as repository secrets under Settings, then Secrets and variables, then Actions, and reference them in the build step of `.github/workflows/deploy.yml`. Without that last step the deployed site will not have them even though it works on your own computer.

The security point that matters is this. The anon key is designed to sit in a browser and is safe to publish, but it is only safe because Row Level Security controls what it is allowed to do. If you create tables and leave Row Level Security off, anyone who opens the browser console can read, change, and delete everything in your database. Turn it on and write policies before you put any real data in.

If you genuinely need server side code, for example to process payments or use a private API key that must never reach a browser, GitHub Pages is the wrong host. Move the site to Vercel or Netlify, both of which run Astro server routes and both of which have free tiers. The site code itself does not need to change.

The old maid cafe database schema was not thrown away. It is still in this repository's history, so if you want to restore ticketing rather than design it from scratch, you can recover the original Supabase schema with:

```bash
git show 518c8c1:maidcafe-schema.sql > maidcafe-schema.sql
```

That file contains the reservations table, the seat table, and a function that stops two people booking the same seat at the same time. It is a reasonable starting point even if you end up building something different.

## Passing the project on

The next maintainer needs write access to this repository. They cannot publish anything without it, and it is the first thing people forget.

The simplest arrangement is to transfer the repository to a GitHub organization owned by the club, as described above. If you do that, add the next officer as an Owner or maintainer before you remove yourself, otherwise nobody is left with access. Officers can then be added and removed without transferring the repository again. To transfer directly to another personal account instead, use Settings, then Transfer ownership.

Before handing the project over, give the new maintainer write access and confirm they can actually push. Open Settings, then Pages, and check that tas.umd.edu is still listed as the custom domain. Read the domain section above, because if ownership of the repository changes then the university has to repoint the DNS record, and this is the most common way a handoff goes wrong. Write down who sponsors the tas.umd.edu record at the university and pass that on with the repository. Finally, have the new maintainer make a small change and push it while you are still there, so they see the whole deployment process once before you leave.

## Getting help

If you need to change the site's layout or functionality, the Astro documentation at docs.astro.build is the best place to start. The animations use GSAP, documented at gsap.com/docs. Supabase, if you ever add it, is documented at supabase.com/docs.

Most routine updates only require editing the files in `src/data/` and never require touching the framework itself.

## A checklist before you make changes

1. Pull the latest version of the repository.
2. Make your edits.
3. Run `npm run build`.
4. Commit and push.
5. Wait for the GitHub Action to finish.
6. Refresh tas.umd.edu and check that your changes are there.
