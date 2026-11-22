# Quiet as a Mouse — V1.7

A microphone-powered classroom meadow by CadoCodes. This ZIP is the complete
online project, including all JavaScript modules, CSS, images, and fonts.

## Animal-count goals

Open **Goals**, choose **Animal count**, and set a target (1–210) and time limit
(1 second–24 hours). The default is 10 new animals in 5 minutes.

- The goal records the highest number of new visitors present together during
  the challenge. It is a maximum/peak count, not a total of separate arrivals.
- For example: reach 12 new visitors, then finish with only 7. Your best is still
  12, so a target of 10 is met.
- Visitors already in the meadow when you start are excluded for that entire
  goal, including if those same species later leave and return. The count covers
  the whole scrolling meadow and water, independent of camera position.
- Reaching the target does not stop the countdown. It keeps running and can
  record a higher best until the full time limit ends.
- Noise can make animals flee but never lowers the recorded best. The animal
  goal's countdown keeps running through noise.
- The goal uses real microphone play. Calibration and microphone-free preview
  do not count. Pausing listening, losing microphone access, or leaving the page
  pauses progress. Reopening restores the goal paused.
- **Pause goal** preserves the goal so you can resume it. **End goal** finishes it
  early and keeps the result: success if your recorded best reached the target,
  otherwise target not reached. A completed goal cannot be awarded twice.
- **Reset this goal** clears the current goal and lets you change its options.
  After a finished goal, this button is called **Set a new goal**.
  It does not remove your meadow visitors or reset your completed-goal count.
- One goal runs at a time. Choose **Show goal on screen** to display its time,
  best/target, current new-visitor count, and status.

## Quiet goals and timers

The existing **Quiet time** goal remains available: choose 1–60 minutes of
accumulated quiet time. Noise pauses its progress without erasing it. Pause,
resume, end early, and reset work here too. Ending before the required quiet time
is reached records an unfinished target.

Goals no longer award decorations or other items. Prior completion totals and
already-earned scenery are preserved when upgrading, but further completions do
not unlock or add any decorations. The reward gallery is removed from Goals.

**Open timer** at the bottom of Goals opens the same independent countdown as the
clock toolbar button. Set any whole-second duration from 1 second to 24 hours.
It does not require a microphone, is unaffected by noise, and pauses when you
leave the page. It shows a quiet “Time’s up!” message without an alarm.

## Animals fleeing

One loud burst removes a small number based on the current visitor count:

| Visitors present | Visitors that flee |
| ---: | ---: |
| 10 | 1–2 |
| 50 | 2–3 |
| 100 | 4–5 |
| 150 | 6–7 |
| 210 | 9–10 |

The game chooses either the lower or upper number with equal probability,
limited to the number present. This is floor(4.5% of visitors), with a minimum of
one, plus either zero or one. No animals means zero flee. Continuous noise does
not repeatedly empty the meadow: two quiet seconds re-arm the next scare.
Species, rarity requirements, chance checks, artwork, and animations are kept.
There are 210 species across nine game rarity tiers.

## Other tools kept from V1.6.1

- Six equal-size toolbar buttons in a 2-column, 3-row grid at the top right.
- Supplied Settings, Images, Timer, and dog-shaped Animals icons are embedded
  directly in the page, so missing image folders cannot break those buttons.
  Original icon files are included for editing.
- Up to 10 movable text boxes, 15 font choices, adjustable size/color/background.
- Import, move, and scale up to 5 PNG/JPG/WebP/GIF images. GIFs become still images.
  Images save on the same browser and device; they are not uploaded to a server.
- Autoscroll, the scrolling meadow/water panorama, and animated animal behavior.
- Controls hide after two seconds without mouse, touch, or keyboard activity.
  Open panels and focused controls keep them visible; text/images/timers remain.
- Noise Limit ranges from −100 to 200; higher values allow more noise. It is a
  game scale, not a decibel measurement. Calibration adapts it to your room.
- **Take a peek without a microphone** shows 10 different randomly chosen
  Ultra-Common animals. These cannot count toward goals or replace a saved visit.

## Progress and privacy

Listening uses only the sound level; audio is never recorded or uploaded. The
microphone stops when listening is paused or the page is hidden. Visitors,
quiet progress, goals, text, images, and settings are saved in this browser.
Closing or switching tabs pauses rather than removes the saved meadow.

Use **Settings → Reset progress** to clear the meadow, quiet timers, and current
goal. A confirmation appears first. Text, imported images, countdown, settings,
completed-goal total, and existing scenery stay. A forced crash can lose the
most recent unsaved seconds. Private browsing, clearing site data, or changing
browser/device/domain can remove or separate saves. Concurrent game tabs can
write over each other's saved state; use one active tab for a classroom.

## Updating GitHub and Cloudflare

1. Download **Quiet-as-a-Mouse-V1.7-Online.zip** and extract it.
2. In the GitHub repository connected to Cloudflare Pages, upload the extracted
   files and folders into the same folder as the existing `index.html`, replacing
   matching files. Keep their exact names and folder structure.
3. Commit the update and wait for the Cloudflare production deployment to finish.
4. Reload the website. The title and version badge should say **V1.7**. If the
   browser keeps an older page, close and reopen it or perform a hard refresh.

Do not upload the ZIP itself as the website, and do not rename the page to
`index(2).html`. This is a static site; no install or build command is required.
Keep your existing Pages deployment/root directory settings. This download has
not been published to your GitHub repository or Cloudflare site automatically.

## Offline text version

**Quiet-as-a-Mouse-V1.7-Offline.txt** contains one complete self-contained HTML
page under 800,000 characters. Copy all the text into Code Beautify's HTML Viewer
and choose **Run / View**, or save it with an `.html` extension and open it in a
modern browser. Images, fonts, styles, animal artwork, and code are embedded.
Microphone access and saving still depend on browser and preview permissions.
The standalone preview and countdown can work without a microphone. Roboto and
Open Sans use embedded regular-weight Latin subsets; other fonts/characters use
system fallbacks. The background and small images are compressed for size.

## Verification

Automated checks cover simultaneous peak counts, exclusion of starting visitors,
12→7 success at the deadline, early ending above/below the target, pause and
restore, no new rewards, old quiet-goal migration, 1-second–24-hour timing, fleeing
counts and cooldown, malformed saves, and unchanged rarity data. Offline checks
compare all 210 species/art and 10,000 gameplay steps with the online modules.
Browser checks covered 12→7 success at the deadline, early pass/fail, pause and
reload, old quiet-goal completion without new scenery, timer access, input limits,
and 210→200 visitors after one loud burst. Goal panels were checked at phone,
small-phone, tablet, landscape, and desktop sizes. Browser checks use synthetic
audio in isolated test fixtures for repeatable goal
and fleeing scenarios; those fixtures and audio substitutes are not included in
this download. Real microphone input and physical iPad/Android hardware were not
available for testing here.
