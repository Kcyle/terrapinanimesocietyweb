# KAMECON changelog

## Update 4: Cosplay meetups and Geek Comedy Tour Facebook link

Built on top of `src_65f8a3.zip`. Cosplay meetups follow **Design A** (timeline). The vendor-list change from the previous round is intentionally **not** included in this version.

### Files changed

| File | Status |
| --- | --- |
| `pages/kamecon/schedule.astro` | edited |
| `data/kamecon-schedule.json` | edited |
| `CHANGELOG-kamecon.md` | edited (this file) |

### `pages/kamecon/schedule.astro` (schedule page)

- **New "Cosplay meetups" section** on the Cosplay tab, below the sign-up and ground-rules cards. It reuses the Main stage timeline look (glowing line, diamond markers, cyan times), with the fandom in large type and "Leader" or "Leaders" underneath. The Cosplay Contest row is highlighted in red with a "Contest" tag. Times use real `<time>` elements and read as "to" for screen readers.
- **Facebook button** on the "Panel #4: Geek Comedy Tour" row, same shape as the Instagram buttons but in blue. Opens in a new tab; screen readers hear "Facebook for Panel #4: Geek Comedy Tour (opens in a new tab)".
- The link button label is now taken from the data (`linkLabel`), defaulting to "Instagram", so the eight Instagram buttons are unchanged.

### `data/kamecon-schedule.json` (schedule content)

- Added `cosplay.meetups` (14 entries from your screenshot): fandom, start, end, and `leaders`. To edit a meetup, change its entry here.
  - Spelling fixed: "Assassination Classroom".
  - One Piece leader is **Nikolai** only.
  - The two Nikolai and Jo rows (4:30 to 5:00 and 5:00 to 5:30) are one **Cosplay Contest**, 4:30 PM to 5:30 PM (`"contest": true`).
  - Times assume AM/PM from 11:00 AM through 8:00 PM; there are no meetups at 1:00, 2:00 or 6:00 PM.
- The Cosplay "Open" time was left as is (4:30 PM to 5:30 PM).
- Added `link` (https://www.facebook.com/groups/53638073183) and `linkLabel: "Facebook"` to the Geek Comedy Tour stage item.

### Not changed

Everything else in `src/` is identical to `src_65f8a3.zip`. No vendor files were added or edited.

---

## Update 2: parking info, "site will update" notice, stage links

Built on top of `src_c96f79.zip`. Main page and parking popup follow **Design A**, the stage schedule follows **Design B**.

### Files changed

| File | Status |
| --- | --- |
| `pages/kamecon.astro` | edited |
| `pages/kamecon/schedule.astro` | edited |
| `data/kamecon-schedule.json` | edited |
| `CHANGELOG-kamecon.md` | edited (this file) |

### `pages/kamecon.astro` (main page)

- **Parking popup (full text).** Replaced the "will be posted soon" placeholder with the parking info **word for word** from your screenshot, in the same cyberpunk popup style (nothing shortened):
  - *Free parking options* (blue FREE tag): "Nearest **free** parking to STAMP:", Regent's Drive Garage card (Address: Lot B, College Park, MD 20742; 7 minute walk from STAMP), the note about other free lots about a 10 minute walk away, "There are two ways to identify parking lots available for free parking on Sunday." with both bullets (the UMD parking map bullet carries its full "Link: https://transportation.umd.edu/..." line, opens in a new tab), and the "Lots 1B, 1D, 1F ..." callout.
  - *Paid parking options* (red PAID tag): "Nearest parking garage to STAMP (**PAID** parking right next to the building)", Union Lane Garage card (Address: Union Lane Garage, College Park, MD 20740; Paid parking through credit card, cash, or Parkmobile App, $4/hour, ($20 max)).
- **Popup header stays put.** The popup title and the close (X) button now sit in a fixed header, and only the content scrolls underneath. Before, on phones the floating X covered text as you scrolled. Applies to all popups (Tickets, Parking, Harassment Policy).
- **"Site will update" notice.** New "Stay tuned" notice under the main buttons: "This site will be updated as more info about KAMECON is released." Cut-corner red bar with a pulsing dot (the pulse turns off for "reduce motion").
- **Popup system extended** so more content can be added without new code: section tags (`badge`), info cards (`card`), a lead-in line (`lead`), a lead-in with bold words (`html`), list items that carry a link, and a blue list style (`info`). Edit the `POPUPS` list at the top of the file.

### `pages/kamecon/schedule.astro` (schedule page)

- **Instagram buttons on the stage list.** Any act with a `link` in the data file gets an "Instagram" button next to its tag. Opens in a new tab. Screen readers hear "Instagram for [act name] (opens in a new tab)" instead of the same label eight times. Keyboard focus shows a visible ring. On phones the button and tag sit under the act name.

### `data/kamecon-schedule.json` (schedule content)

- Added `link` to eight acts: Cinema Symphony Orchestra, Lucky Clover Idols, YumeStars, Peach Tea Punch, JJAM, Lenana Split, VIVIDS, Skyansam.
- Renamed (matching the names on your Instagram links): Lenana.ueu -> **Lenana Split**, Rosaly / Shaina -> **VIVIDS**, DJ Sam -> **Skyansam**. The 7:50, 8:45 and 9:15 PM slots and times were kept. Revert in the JSON if any of these pairings is wrong.
- To add a link to another act later, add `"link": "https://..."` to its entry.

### Not changed

Everything else in `src/` is identical to `src_c96f79.zip`.

---

## Update 1: Tickets popup, Event Schedule bar, countdown, start.gg, controller note

Built on top of `src_1.zip`. Only the files below changed.

## Files changed

| File | Status |
| --- | --- |
| `pages/kamecon.astro` | edited |
| `pages/kamecon/schedule.astro` | edited |
| `data/kamecon-schedule.json` | edited |
| `CHANGELOG-kamecon.md` | new (this file) |

## `pages/kamecon.astro` (main KAMECON page)

- **Tickets popup.** The Tickets button now opens a "Tickets coming soon." popup, same style as Parking. It is a `<button data-modal-open="tickets">`; the old empty link is gone. The `TICKETS_URL` constant was removed; the real ticket link is kept in a comment so it is easy to swap back in when tickets go on sale.
- **Event Schedule featured bar (Demo B).** Event Schedule is now a wide neon-blue bar with cut corners under the Tickets button: Orbitron title, "Stage · Cosplay · Arcade" sub-line, "See the lineup" tag, `>>` arrow. Still a normal link to `/kamecon/schedule`.
- **Nav layout.** The nav is now a column: Tickets, then the Event Schedule bar, then a row with Parking, Harassment Policy and Contact. Popup buttons are wired by id (`parking`, `policy`, `tickets`) instead of list position, so adding or removing popups no longer shifts other buttons.
- **Countdown timer (neon digital readout).** New countdown under the date: Days : Hours : Minutes : Seconds until **Nov 15, 2026, 11:00 AM EST** (`2026-11-15T11:00:00-05:00`). Large Orbitron digits in neon blue inside a cut-corner panel with red corner brackets and red blinking colons. At start it switches to "KAMECON is happening now!", and after 10:00 PM EST to a thank-you message. Change `EVENT_START` and `EVENT_END` at the top of the file to adjust. The timer is hidden without JavaScript, is not announced every second by screen readers, the colon blink turns off for "reduce motion", and the digits are fixed-width so they do not jitter. Verified down to 320px wide.
- **Mobile layout.** Under 480px, Tickets and the Event Schedule bar go full width, the countdown boxes share the row evenly, and Parking / Harassment Policy sit side by side with Contact below.
- Kept your existing "Tickets coming soon" line above the buttons.

## `pages/kamecon/schedule.astro` (schedule page)

- **Arcade: controller notice.** New "Required" alert at the top of the Arcade section: "Bring your own controller. You must bring your own controller to enter any tournament."
- **Arcade: start.gg button.** New "Register on start.gg" button at the top of Tournaments. Opens https://www.start.gg/tournament/umd-kamecon-26-terpin-out/details in a new tab. Chamfered red button, keyboard-focus ring, full width on phones.

## `data/kamecon-schedule.json` (schedule content)

Stage schedule updated from your screenshot:
- Panel #3 title: `TBD` -> `WGSS (TBD)` (the "??" from the sheet was dropped).
- Comedy panel: `Panel: Comedy` -> `Panel #4: Geek Comedy Tour`.
- DJ Sam now has an end time: 9:15 PM - 9:45 PM.
- Other stage times already matched the screenshot.

Arcade additions (text for the new notice and button): `controllerNote`, `registerLabel`, `registerUrl`.

Your own edits in `src_1.zip` were kept (cleared group notes and station hosts, "VR powered by XR Club", "Beat Saber (Modded)", "Tickets coming soon" line).

## Not changed

Everything else in `src/` is identical to `src_1.zip`.
