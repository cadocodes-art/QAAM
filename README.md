# Quiet as a Mouse — V1.6 · Classroom Tools

This is the complete online project, based on V1.5.1.
It keeps CadoCodes’ welcome screen, logo, panorama, text tools, and hosting setup.

## New in V1.6

The top-right toolbar now contains six equal-size circular buttons in two columns
and three rows: Settings / Text, Images / Timer, Goals / Animals. The Images,
Timer, and Settings icons use the pictures supplied by CadoCodes. The animal
collection has moved out of the bottom-center position. Touch targets remain at
least 48 pixels across, including landscape layouts.

All six buttons, Autoscroll, bottom controls, and image/text move handles hide
after two seconds without input. Move your mouse to reveal them. On touchscreens,
the first tap reveals the controls. Open menus, held drags, and keyboard focus
keep controls available. Imported images, text, and a displayed timer stay visible.

### Import, scale, and move images

1. Open **Images → Import images**. Choose up to five PNG, JPG, WebP, or GIF files.
2. Select a thumbnail to edit it. The Scale slider preserves proportions;
   100% means the largest size that fits the screen. Positions have sliders too.
3. Close the panel and drag the handle above the image to move it. A focused
   handle also moves with arrow keys (hold Shift for a larger step).
4. Tap the image to reopen its editor. **Remove this image** frees a space.

Images are local to this browser and website. They are not sent to a server or
included in other visitors’ games. They save separately from text and game
progress and remain after **Settings → Reset progress**. Clearing site data or
switching browsers/devices/domains does not carry them across. If browser storage
fails, the panel explains that images last only for the current visit.

Each source image may be up to 20 MB. Images are fitted within 2048 × 2048 pixels
for storage, retaining their proportions and transparency. Animated GIFs become
still images. HEIC and other unsupported formats should first be exported as
PNG or JPG. Uploaded images do not scroll with the scenery and stay within the
screen when it is resized.

### Classroom timer

Open **Timer**, enter hours/minutes/seconds, and press **Start timer**. Durations
can be any whole number of seconds from **00:00:01 to 24:00:00**, inclusive.
Minutes and seconds must be 0–59; 24 hours requires both to be zero.

- The countdown runs independently of microphone listening, noise levels, and
  classroom quiet goals. Pausing the meadow does not pause this separate timer.
- **Pause timer / Resume timer** preserve remaining time. **Reset timer** returns
  to its last started duration and stops it. Change the fields to start a new
  duration. Inputs are disabled while it is running.
- **Show timer on screen** controls the countdown card. It remains visible when
  the toolbar hides. At zero, it displays **Time’s up!** with no alarm sound.
- Leaving the page pauses and saves the timer. Reopening restores it paused;
  resume it from the Timer panel. It earns no offline time. A forced browser or
  device crash can lose the latest unsaved second.
- Settings’ **Reset progress** keeps the timer. Use **Reset timer** separately.

Upload the entire extracted project, including the new `icons/` directory and
all six new files: `classroom-tools.css`, `image-model.mjs`, `image-store.mjs`,
`image-overlays.mjs`, `timer-model.mjs`, and `countdown.mjs`.

## V1.6 verification

Browser checks covered six simultaneous image selections (five accepted, one
skipped), damaged-image errors, scale and position controls, pointer dragging,
removal, saved image restoration, a one-second timer, a 24-hour timer, invalid
24-hour-plus-one-second input, timer pause/reload, and automatic control hiding
while images and countdown remain visible. The supplied icons were checked in
the toolbar. Layouts were reviewed at desktop, tablet, phone, small-phone, and
landscape sizes. These checks did not use physical iPad/Android hardware.

Automated checks cover every supported timer duration (1–86,400 seconds),
completion exactly once, paused restoration, malformed saved image records,
the five-image limit, proportional sizing, and movement bounded to five viewport
sizes. Existing species, artwork, rarity, and saved-visit model are preserved.

## New in V1.5.1: pause instead of losing visitors

- **Pause** appears while listening. It releases the microphone and freezes
  the meadow, quiet timers, and Autoscroll without clearing your visitors.
- **Resume listening** reconnects the microphone and continues the same meadow.
- Switching tabs, minimizing, leaving the page, or a microphone interruption
  pauses and saves the visit. Returning never starts the microphone by itself.
- Reopening or refreshing the site restores the saved visitors, animal positions,
  continuous quiet timers, chance-check progress, and camera position. The game
  opens paused. No quiet time or animals are earned while away.
- Saved microphone calibration is reused when resuming, so the quiet timers are
  not wiped by startup calibration. Use Recalibrate microphone if the room or
  input device has changed; calibration itself also preserves progress.
- A microphone error or the separate microphone-free preview cannot erase your
  saved visit. Preview animals are never added to the saved collection.
- Loud sounds during active listening still scare away 1–2 animals as before.

Open **Settings → Reset progress** to start over. A confirmation explains that
Reset removes visitors, clears quiet timers, and resets the current classroom
goal. It keeps earned decorations, completed-goal totals, text boxes, Noise Limit,
and other settings. Cancel leaves everything unchanged. Reset is saved too,
so the cleared visitors do not return after a reload.

Progress is saved in this browser on this website, including automatically every
two seconds during listening, when visitors change, and when pausing/leaving.
Normal closing/reopening keeps it. A forced app/device crash can lose the latest
unsaved seconds. Clearing site data, private-browsing cleanup, or changing browsers,
devices, or domains does not carry the save across. If storage is blocked the
Settings panel explains that only the open page can retain progress.

V1.5 did not save animal visits; V1.5.1 starts preserving visits made in this
version. Existing text, settings, challenge progress, and rewards are retained.
After reopening, a paused classroom goal can be resumed from the Goals panel.

The new `visit-state.mjs` file must be uploaded with the rest of the project.

## Classroom challenges

1. Enter the meadow and open the circular **trophy / GOALS** button.
2. Choose **1–60 minutes** of accumulated quiet time (default: 10 minutes).
3. Choose **Start challenge**. If needed, the game starts the microphone flow.
4. Quiet time adds up using the sound bar’s quiet threshold. Noise pauses the
   goal; it does not erase time already earned. These are separate from the
   continuous quiet timers and probability checks used for animal arrivals.
5. Pause/resume the challenge in the Goals panel, or reset its progress to
   choose a different target. You can also hide its on-screen progress card.
6. Each of the first three completed goals earns a decoration: **wildflower
   patches**, then a **meadow log**, then **garden stones**. Each reward unlocks
   once. Later goals still celebrate and count toward your completed total.
7. Use the reward buttons to show or hide earned decorations. A few small
   starter flowers are always present for visiting butterflies and bees.

Completion has a gentle visual message only—no sound. Decorations and challenge
progress save locally in this browser on this website. Reloading always pauses
the challenge. Resume it from Goals. Progress is saved periodically and when
leaving the page; abrupt browser/device shutdown may lose the last few seconds.
No time is earned during calibration, microphone-free preview, microphone
interruption, a paused challenge, or time away from the page. Closing or hiding
the page never awards offline time. Blocked storage is explained in the panel.

## Noise Limit: −100 to 200

The former Microphone sensitivity control is now **Noise Limit**, from **−100
through 200** in steps of 1. **Higher numbers allow more noise.** −100 is the
quietest limit; 200 is the most forgiving. The default stays 50.

Existing sensitivity settings are converted automatically (`Noise Limit =
100 − old sensitivity`) to keep the same effective threshold for your room.
New Noise Limit settings take priority on later visits. Recalibration still
adapts the threshold to your room. These are game settings, not decibels.
The sound bar, classroom goal, and animal quietness checks use the same base
limit; rare tiers still require quieter sound levels.

## More animal behavior

- Rabbits and hares slow down, lower their heads to nibble, and lift them again.
  Their ears, face, and whiskers stay attached to the same head joint.
- Flying birds descend onto the meadow, unfold their feet, fold their wings,
  rest briefly, and take off again. They choose a landing spot on land.
- Butterflies, moths, and bees visit the meadow’s flowers, pause with gentler
  wing motion, and fly away again.
- Other land animals take occasional resting pauses with subtle breathing.
- Aquatic animals vary their cruising speed while continuing fin/tail motion.
  Stationary shellfish stay settled.

Each animal follows its own timing. Loud scares interrupt these behaviors.
Reduce motion still disables decorative body and joint motion. Camera scrolling,
animal entrances, all 210 species, spawn odds, and the 1–2 animal scare rule remain.
The microphone-free preview includes rabbits, butterflies, birds, and swimmers
so you can watch the new behaviors without connecting a microphone. Allow time
for arrivals and for each animal to settle into a behavior.

## V1.5.1 verification

Save/restore tests cover all 210 species, quiet timers, spawn-check progress,
startle cooldown, camera position, animation state, malformed saves, and reset.
Browser checks verified manual Pause/Resume, frozen animal positions and timers,
reload, closing/reopening the game tab, simulated tab-away and microphone
interruptions, denied microphone access, and preview isolation. Reset and Cancel
were checked; a reload after Reset retained text, Noise Limit, completed-goal
counts, and decorations while clearing visitors and the current goal.
Microphone checks used synthetic input. Physical-device browser shutdown and
physical iPad/Android hardware were not tested for this release.

## V1.5 verification

Checked goal accumulation, loud/quiet gating, calibration and microphone gates,
pause/resume, completion exactly once, all three rewards, malformed saved data,
and restoring progress paused. Browser checks use synthetic sound input rather
than a real microphone. Visual checks cover desktop, tablet, phone, small phone,
and landscape viewport sizes. This is not testing on physical iPad/Android hardware.

Behavior simulation checks cover all 210 species, land-safe resting destinations,
bounded motion, and valid joint poses; all 210 SVG illustrations parse correctly.
Rarity and scare logic are checked against the previous release.

New modules: `challenge-model.mjs`, `challenges.mjs`, `challenges.css`,
`meadow-decor.mjs`, `animal-behavior.mjs`, and `noise-limit.mjs`. Upload these with the other files.

## Controls disappear after two seconds

After entering the meadow, buttons, Autoscroll controls and text-box move handles
fade away after two seconds without input. Move the mouse to bring them back.
On an iPad or phone, tap once to reveal the controls, then tap the button you want.
Keyboard input and wheel scrolling also reveal them.

Text messages, the sound bar, visitor count and quiet timer remain visible.
Animals, the microphone and Autoscroll continue while the controls are hidden.
The welcome screen and open menus/editors stay visible. Controls also stay
available during a held drag or while a keyboard user has a control focused.
Hidden controls cannot be clicked or reached accidentally. Reduced motion
removes the fade animation.

The badge says **V1.6 · CLASSROOM TOOLS**.

## Text boxes in V1.4

1. Click or tap the circular **Tt / TEXT** button beneath Settings.
2. Choose **+ Add text box**. You can keep up to **10** boxes on screen.
3. Write your message, then choose its font, size, color and light background.
4. Close the panel. Drag a box by its move handle; tap its text to edit again.
5. Choose **Remove this box** to remove the selected box and free a slot.

Text stays fixed on the screen while you scroll the meadow or use Autoscroll.
Autoscroll pauses while the text panel is open or a box is being dragged,
and resumes after the usual three-second interaction pause. The microphone
and animal simulation continue while editing.

Keyboard: Tab to a box's move handle and use the arrow keys (Shift for larger
steps). The editor also has horizontal and vertical position sliders. Boxes
stay inside the screen after resizing or rotating your device. Long messages
wrap and can be scrolled inside their box. Each box supports 1,000 characters.

Messages, positions and styling save automatically in this browser on this
website. They remain after reloading and after updating the game at the same
address. They do not sync between devices, browsers, or different domains;
clearing site data removes them. If saving is unavailable, the editor says so
and the text still works for the current visit. No text is uploaded.

### The 15 font choices

Arial, Helvetica, Times New Roman, Georgia, Verdana, Tahoma, Trebuchet MS,
Calibri, Cambria, Garamond, Courier New, Impact, Comic Sans MS, Roboto,
and Open Sans.

Roboto and Open Sans are included in the fonts/ folder and served by your
own website; no request to Google Fonts is needed while playing. Their SIL
Open Font License files are included. The other 13 use the device's installed
fonts, with similar fallbacks if missing. A font choice remains saved even on
a device that needs its fallback. No proprietary system fonts are redistributed.

## New in V1.3.3

- Land visitors walk, hop, or crawl in from a side of the screen.
- Aquatic visitors swim or drift in from a side and remain in the water.
- Flying visitors enter from a side or descend from above.
- Arrivals no longer fade in. The existing startled departure behavior remains.
- If you are looking away from an animal's habitat, it enters that habitat
  off camera. Scroll over to find it; it will not cross the wrong habitat.

## Autoscroll

Use the **Autoscroll** checkbox at the top center of the game. The camera travels
back and forth across the panorama, slowing and turning around at each end.
Use its **Speed** slider to select 0.25x through 3x speed. Default is off, at 1x.
The checkbox and speed are remembered on this device.

Dragging, swiping, scrolling the wheel, or using the arrow controls pauses
Autoscroll while you interact and for about three seconds afterward. It also
pauses while a dialog is open or the tab is hidden. Uncheck it to stop it.
Autoscroll works in the microphone-free preview too.

## Spawn balance retained from V1.3.2

| Tier | Continuous quiet required | Chance per eligible check |
|---|---|---|
| Ultra-Common | 15 seconds | 1 in 6 |
| Common | 45 seconds | 1 in 15 |
| Uncommon | 1 minute | 1 in 24 |
| Rare | 2 minutes | 1 in 45 |
| Epic | 3 minutes | 1 in 90 |
| Legendary | 4 minutes | 1 in 150 |
| Mythic | 6 minutes | 1 in 300 |
| Godly | 8 minutes | 1 in 600 |
| Face-image tier | 10 minutes | 1 in 1,500 |

Checks still happen every 5 seconds. Each tier first requires continuous quiet
at its existing sound threshold, then rolls its chance on each eligible check.
Passing the timer makes a tier eligible; it does not guarantee an arrival.
A sound above a tier's quiet threshold resets that tier's timer.

The 210 animals, V1.3.1 animations, scenery, microphone/settings behavior, and
one-or-two-visitors-per-loud-burst rule are preserved.

## Animation features from V1.3.1

- Clearer anchored leg strides, insect knee bends, tail sways and wingbeats.
- Missing tail joints and fixed limb details now move with their body parts.
- Flying animals keep their legs tucked; ground birds occasionally stretch wings.
- Visible discovered animals also animate in the collection sidebar.
- If Reduce motion is enabled, use the on-screen **Animal animation is off. Enable**
  button, or turn Reduce motion off in Settings. Your accessibility preference is
  preserved until you choose to enable the animation.

## Animal designs

The V1.3 designs are preserved. All 210 roster entries have been reviewed for identifying features. The new
illustrations keep the soft, flat cartoon style while using more appropriate
body proportions, faces, feet, tails, wings, and markings.

Examples include patterned flying butterflies, compact rabbits with long ears
and powerful hind feet, distinct bird bills and plumage, webbed seal flippers,
armadillo armor, giraffe necks, elephant trunks, and different cat markings.

Animals use appropriate movement groups: fluttering/flying, hopping, walking,
waddling, crawling, slithering, paddling, swimming, or pulsing. Starting,
stopping, and turning are eased. Wings and limbs pivot at their attachments.
The Reduce motion setting freezes decorative joint motion and hopping.

The rarity values above are unchanged from V1.3.2. Sound thresholds and the
5-second check interval are unchanged.

## Preview every animal

After publishing, open **animal-preview.html** on your site to inspect every
animal. You can search by name, filter movement groups, and pause animations.
For your existing site that is:

https://qaam-school-noise.com/animal-preview.html

This optional creator preview reveals all animal names. The actual game's
collection still hides names until visitors arrive.

**ANIMAL-REVIEW.md** contains the species-by-species design notes and research
links. Broad group names and domestic animals use a representative form;
sex, age, breed, and individual coloration can differ in real animals.

## Upload the update

1. Download **Quiet-as-a-Mouse-V1.6.zip** and choose Extract All.
2. Open the extracted folder and select all files and the fonts folder inside it.
3. Upload those files to the top level of your existing QAAM GitHub repository.
4. Replace matching files and include every new `.mjs`/`.css` file, all PNGs, and the `fonts` folder.
5. Commit to the branch connected to your Cloudflare production site.
6. Wait for that deployment to finish, then reload the site. On Windows,
   Ctrl+F5 requests a fresh page. Check that the top-left badge says V1.5.1.

Upload the files themselves, not the ZIP or an enclosing folder. Keep the
homepage filename exactly `index.html`. No build or package installation is
needed. Keep your existing working Cloudflare settings.

Keep the `fonts` folder intact beside `index.html`. Upload its contents as a
folder, not loose files. This ZIP contains normal source files and assets.

## File guide

- `welcome-screen.css`, `cadocodes-logo.png`: welcome screen and creator logo.
- `index.html`, `style.css`, `game.mjs`: game interface, sound, and movement.
- `controls-visibility.mjs`, `controls-visibility.css`: two-second control hiding and wake interactions.
- `text-boxes.mjs`, `text-model.mjs`, `text-boxes.css`: text tools, limits, placement and styling.
- `fonts/`: Roboto and Open Sans font files and their licenses.
- `data.mjs`, `core.mjs`: roster, V1.3.2 rarity values, and existing scare rules.
- `travel.mjs`: offscreen entrance paths and back-and-forth Autoscroll.
- `art.mjs`: illustration selection.
- `mammal-art.mjs`, `bird-art.mjs`, `invertebrate-art.mjs`, `aquatic-art.mjs`:
  animal drawings.
- `animal-motion.mjs`, `motion-profile.mjs`, `insect-motion.mjs`: joint poses,
  movement types, and insect leg motion.
- `panorama.mjs`, `panorama.png`: scrolling scenery and shoreline boundaries.
- `face.png`: rarest-tier image.
- `animal-preview.html`, `animal-preview.mjs`: optional creator preview.
- `ANIMAL-REVIEW.md`: appearance audit and references.
- `_headers`, `.nojekyll`: hosting configuration.

Old unused files may remain in the repository; the new game will not load them.

## Microphone and verification

Use the published HTTPS site in a browser with microphone support and allow
access when starting. Audio is processed on the device, never recorded or
uploaded. The main game's preview works without a microphone.

Animal artwork was reviewed during V1.3/V1.3.1. V1.5 preserves those designs
and adds rabbit head joints and feet for grounded flying birds. Automated checks cover
roster coverage, SVG validity, joint poses, movement profiles, shoreline bounds,
rarity timers/chances, and the one-or-two-animal scare rule. V1.3.3 checks also
cover offscreen starts, continuous habitat-safe entrance paths, Autoscroll speed
and both-end reversal, saved controls, and manual-input/dialog/tab pauses.
V1.4 was checked in headless Chrome with desktop, tablet and phone viewport
sizes, including mouse/keyboard dragging and emulated touch input. Text checks
cover all 15 choices, bundled font loading, the 10-box limit, editing/removal,
reload persistence, safe plain text, scrolling, and unavailable/corrupt storage.
Auto-hide checks cover the two-second timeout, mouse/touch/keyboard wake-up,
open menus, held dragging and continued Autoscroll.
Physical iPad/Android devices and real microphone hardware were not tested.
