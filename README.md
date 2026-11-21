# Quiet as a Mouse — V1.2.1

This ZIP contains the complete game as separate, editable HTML, CSS, JavaScript,
and PNG files. Keep all of these files together at the top level.

## What changed

- One continuous panorama replaces the three background panels.
- Empty space above and below the artwork is hidden in the game.
- Explore horizontally by swiping, dragging, scrolling, or using the arrow buttons.
  Keyboard users can focus the meadow and press the left/right arrow keys.
- The scene keeps its proportions when the screen changes size or orientation.
- Animal movement boundaries follow the new shoreline. Water animals appear
  beneath a translucent water layer; land animals stay on land.
- The title and version badge now say V1.2.1.

### Latest V1.2.1 adjustments

- Each loud burst scares away one or two randomly selected visitors, or the
  remaining visitor if only one is present. Other visitors stay discovered.
- Sustained noise does not repeatedly clear the meadow. Two uninterrupted
  seconds below the loud threshold allow a new loud burst to cause another scare.
- Insect and spider legs stay attached to their bodies and take small alternating
  steps. Leg lengths stay fixed, and legs stop moving when the animal rests or
  Reduce motion is enabled.
- Arrival times and chances now use the original, harder rarity table below.

There are still 210 animals. The panorama and existing settings remain in place.

### Arrival rules

The game makes an independent check for each eligible tier every five seconds.
The room must first remain continuously quiet for that tier's required time.
Rarer tiers still require a lower sound level. Noise that exceeds a tier's quiet
level resets its arrival timer; only sound above the on-screen loud threshold
can scare away existing visitors. A successful roll selects one absent animal
from that tier. The chances below are per tier check, not per animal.

| Tier | Continuous quiet required | Chance per check |
| --- | --- | --- |
| Ultra-Common | 5 seconds | 1 in 2 |
| Common | 15 seconds | 1 in 5 |
| Uncommon | 30 seconds | 1 in 12 |
| Rare | 1 minute | 1 in 30 |
| Epic | 2 minutes | 1 in 75 |
| Legendary | 4 minutes | 1 in 200 |
| Mythic | 7 minutes | 1 in 500 |
| Godly | 10 minutes | 1 in 1,500 |
| Face-image tier | 15 minutes | 1 in 10,000 |

## Update your existing GitHub / Cloudflare site

1. Download this ZIP and choose **Extract All**.
2. Open the extracted folder. Select all the files **inside** it.
3. In your QAAM GitHub repository, choose **Add file → Upload files**.
4. Upload the extracted files to the repository's top level, replacing files
   with matching names. Include `panorama.png`, `face.png`, `panorama.mjs`,
   and the new `insect-motion.mjs` file.
5. Commit the changes to the branch connected to Cloudflare (normally `main`).
6. Wait for the new production deployment to succeed.
7. Open your site and refresh. On Windows, Ctrl+F5 forces a fresh load.

Upload the extracted files, **not the ZIP or its enclosing folder**.
The homepage filename must remain exactly `index.html`, without `(2)` or similar.
The old `meadow.png`, `shore.png`, and `water.png` files are no longer used.
They can stay in your repository or be removed later.

This is a static site: it does not need a build step or package installation.
Keep your existing working Cloudflare deployment settings.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and V1.2.1 label |
| `style.css` | Appearance and responsive layout |
| `game.mjs` | Microphone, animal movement, controls, and collection |
| `core.mjs` | Quiet timers and arrival chances |
| `data.mjs` | 210 animals and rarity tiers |
| `art.mjs`, `original-animals.mjs` | Animal drawings and animation |
| `insect-motion.mjs` | Attached, articulated insect and spider legs |
| `panorama.mjs` | Panorama dimensions and shoreline boundaries |
| `panorama.png` | Approved continuous background, with its original margins |
| `face.png` | Rarest-tier picture |
| `_headers`, `.nojekyll` | Hosting configuration |

The background PNG deliberately retains its blank margins. The game displays
only the landscape strip; you do not need to crop or edit the image yourself.

## Playing and previewing

Use the published HTTPS site in a current browser and allow microphone access
when you press **Enter the meadow** or **Start listening**. Audio is processed
on the device; it is not recorded or uploaded. **Take a peek without a microphone**
lets you inspect the scenery and example animals without microphone permission.

For local development, serve this folder with a local web server. For example,
with Python installed, run `python -m http.server 8000` inside the folder and
open `http://localhost:8000`. Opening `index.html` directly as a downloaded file
may prevent the JavaScript modules or microphone from working.

Automated checks cover the exact rarity table, timed arrivals, probability
boundaries, one-or-two departures, sustained noise, quiet rearming, retained
visitors, all animal drawings, and fixed-length insect leg poses.
Interface/audio integration uses mocks; live browser, physical microphone,
and touch testing were not available for this adjustment.
