# Quiet as a Mouse - V1.3

V1.3 focuses on animal appearance and movement. The game title, top-left badge,
animal preview page, and ZIP filename all show **V1.3**.

## Animal update

All 210 roster entries have been reviewed for identifying features. The new
illustrations keep the soft, flat cartoon style while using more appropriate
body proportions, faces, feet, tails, wings, and markings.

Examples include patterned flying butterflies, compact rabbits with long ears
and powerful hind feet, distinct bird bills and plumage, webbed seal flippers,
armadillo armor, giraffe necks, elephant trunks, and different cat markings.

Animals use appropriate movement groups: fluttering/flying, hopping, walking,
waddling, crawling, slithering, paddling, swimming, or pulsing. Starting,
stopping, and turning are eased. Wings and limbs pivot at their attachments.
The Reduce motion setting freezes decorative joint motion and hopping.

The panorama, 210-animal roster, rarity table, microphone controls, and
one-or-two-visitors-per-loud-burst rule from V1.2.1 remain in place.

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

1. Download **Quiet-as-a-Mouse-V1.3.zip** and choose Extract All.
2. Open the extracted folder and select all files inside it.
3. Upload those files to the top level of your existing QAAM GitHub repository.
4. Replace matching files and include every new `.mjs` file and both PNGs.
5. Commit to the branch connected to your Cloudflare production site.
6. Wait for that deployment to finish, then reload the site. On Windows,
   Ctrl+F5 requests a fresh page. Check that the top-left badge says V1.3.

Upload the files themselves, not the ZIP or an enclosing folder. Keep the
homepage filename exactly `index.html`. No build or package installation is
needed. Keep your existing working Cloudflare settings.

## File guide

- `index.html`, `style.css`, `game.mjs`: game interface, sound, and movement.
- `data.mjs`, `core.mjs`: roster and unchanged rarity/scare rules.
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

Animal artwork was rasterized and visually reviewed. Automated checks cover
roster coverage, SVG validity, joint poses, movement profiles, shoreline bounds,
rarity timers/chances, and the one-or-two-animal scare rule. Live browser,
physical microphone, and touch-device testing were not available in this run.
