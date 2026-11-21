# Quiet as a Mouse — V1.2

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
- The title and version badge now say V1.2.

The 210 animals, rarity chances, microphone gameplay, and settings carry over
from V1.1. Existing saved settings are retained on the same site and device.

## Update your existing GitHub / Cloudflare site

1. Download this ZIP and choose **Extract All**.
2. Open the extracted folder. Select all the files **inside** it.
3. In your QAAM GitHub repository, choose **Add file → Upload files**.
4. Upload the extracted files to the repository's top level, replacing files
   with matching names. Include `panorama.png`, `face.png`, and `panorama.mjs`.
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
| `index.html` | Page structure and V1.2 label |
| `style.css` | Appearance and responsive layout |
| `game.mjs` | Microphone, animal movement, controls, and collection |
| `core.mjs` | Quiet timers and arrival chances |
| `data.mjs` | 210 animals and rarity tiers |
| `art.mjs`, `original-animals.mjs` | Animal drawings and animation |
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

Desktop browser preview, image loading, horizontal navigation, and shoreline
geometry were checked. Geometry was checked at phone, tablet, and desktop sizes.
Physical-device microphone and touch testing were not available.
