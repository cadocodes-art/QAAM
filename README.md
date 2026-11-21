# Quiet as a Mouse — V1.1

A ready-to-upload static website. Everything needed is in this folder. There is no build command, backend, account system, or API key.

## Cloudflare Pages: upload the ZIP

1. Open Cloudflare's dashboard and go to Workers & Pages.
2. Choose Create application, then the Pages / Get started option and Drag and drop your files. Choose Pages, not a Worker.
3. Name your project and upload Quiet-as-a-Mouse-V1.1-Online.zip (or the extracted folder).
4. Select Deploy site. Open the resulting HTTPS pages.dev address directly in your browser.

This is a Direct Upload project. If you later want automatic GitHub updates, create a separate Pages project using Git integration.

Official instructions: https://developers.cloudflare.com/pages/get-started/direct-upload/

## GitHub Pages: extract the ZIP first

1. Extract this ZIP on your computer.
2. Create a GitHub repository. A public repository works with GitHub Free.
3. Upload the extracted files and the assets folder to the repository. index.html must be at the top level, not inside another folder. Do not just upload the ZIP itself.
4. Open repository Settings > Pages. Choose Deploy from a branch, then main and /(root), and Save.
5. Wait for the deployment to finish. Open the HTTPS website address shown in Pages settings.

Keep the assets folder beside index.html. Include .nojekyll if your upload method shows hidden files. All paths are relative, so GitHub project URLs work.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Start playing

Open the published website directly, tap Enter the meadow, and allow microphone access for that website. Remain quiet during the three-second calibration. Browser permission and device-level browser microphone permission must both allow access. Avoid playing inside an embedded preview.

The game reads sound volume locally; it never records, stores, or uploads audio. Pause releases the microphone. Hiding the tab ends the current visit. If the microphone is interrupted, restart listening. Preview works without a microphone and does not unlock animals.

Drag with a mouse, swipe on a touch screen, scroll with a trackpad, or use the arrow buttons. Use the circular Animals button for the side drawer and the gear for settings. Sound bar, visitor count, quiet timer, reduced motion, microphone sensitivity, recalibration, and scroll sensitivity are included. Settings persist on the device when browser storage is available.

## V1.1 rules

210 species, with simple original vector illustrations and walking/swimming animations. Additional roster choices fill the approximate counts requested; game rarity is not a claim about current wildlife population sizes.

| Tier | Animals | Continuous quiet | Chance per eligible 5-second roll |
| --- | ---: | ---: | ---: |
| Ultra-Common | 55 | 1 second | 75% |
| Common | 40 | 3 seconds | 50% |
| Uncommon | 30 | 6 seconds | 41.67% |
| Rare | 25 | 12 seconds | 16.67% |
| Epic | 20 | 24 seconds | 6.67% |
| Legendary | 15 | 48 seconds | 2.5% |
| Mythic | 12 | 84 seconds | 1% |
| Godly | 10 | 120 seconds | 0.333% |
| Face-image tier | 3 | 180 seconds | 0.05% |

Each eligible tier rolls independently. Passing a roll brings one absent animal from that tier, so these chances are not a single percentage distribution. Rarer tiers require progressively lower sound levels. Noise resets each affected tier's continuous quiet timer and makes its visitors flee and become undiscovered again. A species can have one visitor at a time. The face tier chooses among absent species with relative weights 6:3:1 for Amur Leopard, Vaquita, and Northern White Rhinoceros. It is always luck, never a guaranteed timed unlock.

Land visitors stay on the meadow and shore; water visitors stay in the water with a translucent blue surface treatment. Supplied scenery is kept in its requested left-to-right order.

## Compatibility and validation

Designed for modern Safari on iPad/iPhone and modern Chrome, Edge, Firefox, and Safari on computers, with responsive controls and touch scrolling. No website can guarantee support on every device or restricted browser. HTTPS and microphone permission are required for live play. The package is for web hosting, not for opening index.html via a local file URL.

Automated checks cover the 210-animal roster, chances and quiet timers, noise preventing arrivals, fleeing/relocking, illustrations, and packaged asset references. Real microphone hardware and physical iPad/phone testing were not available during packaging; test the published site on your target devices before sharing widely.

## Editing later

data.mjs contains species and tiers; core.mjs contains the rules; art.mjs and original-animals.mjs contain vector art; game.mjs contains the interface and microphone handling; style.css contains layouts. Preserve relative filenames and upload changed files for the next release.
