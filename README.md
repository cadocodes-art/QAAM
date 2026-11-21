# Quiet as a Mouse - V1.4 Auto-Hide

V1.4 adds classroom text boxes. The game title, top-left badge, animal preview
page, and ZIP filename all show **V1.4**.

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

The badge says **V1.4 · AUTO-HIDE** to distinguish this build from the earlier
V1.4 text-box release.

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

https://qaam.pages.dev/animal-preview.html

This optional creator preview reveals all animal names. The actual game's
collection still hides names until visitors arrive.

**ANIMAL-REVIEW.md** contains the species-by-species design notes and research
links. Broad group names and domestic animals use a representative form;
sex, age, breed, and individual coloration can differ in real animals.

## Upload the update

1. Download **Quiet-as-a-Mouse-V1.4-AutoHide.zip** and choose Extract All.
2. Open the extracted folder and select all files and the fonts folder inside it.
3. Upload those files to the top level of your existing QAAM GitHub repository.
4. Replace matching files and include every new `.mjs`/`.css` file, both PNGs, and the `fonts` folder.
5. Commit to the branch connected to your Cloudflare production site.
6. Wait for that deployment to finish, then reload the site. On Windows,
   Ctrl+F5 requests a fresh page. Check that the top-left badge says V1.4.

Upload the files themselves, not the ZIP or an enclosing folder. Keep the
homepage filename exactly `index.html`. No build or package installation is
needed. Keep your existing working Cloudflare settings.

Keep the `fonts` folder intact beside `index.html`. Upload its contents as a
folder, not loose files. This ZIP contains normal source files and assets.

## File guide

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

Animal artwork was rasterized and visually reviewed during V1.3/V1.3.1 and is
unchanged in this update. Automated checks cover
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
