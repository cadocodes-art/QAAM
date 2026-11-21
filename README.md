QUIET AS A MOUSE V1.1 - SEPARATE EDITABLE FILES

This package contains separate HTML, CSS, JavaScript modules, and PNG pictures.
All files belong together at the top level. There is no assets folder in this package.

UPDATE YOUR EXISTING GITHUB / CLOUDFLARE SITE
1. Download this ZIP and use Extract All.
2. Open the extracted folder and select ALL the files inside it.
3. In your QAAM GitHub repository choose Add file > Upload files.
4. Drag the selected FILES into the upload area, including the four PNG pictures.
5. Commit the changes to main. This replaces the matching older code files.
6. Wait for Cloudflare's new production deployment to succeed.
7. Open https://qaam.pages.dev/ and refresh with Ctrl+F5.

Upload the extracted files, not the ZIP or its enclosing folder.
The start page must be named exactly index.html. You do not have to open the PNGs before uploading.
An HTML file displaying a Chrome icon is normal: Windows is showing its associated application.

CLOUDFLARE PAGES SETTINGS
Production branch: main
Framework: None
Build command: exit 0
Build output directory: .
Root directory: blank
Environment variables: none

FILES
index.html: page structure
style.css: appearance and responsive layouts
game.mjs: microphone, movement, controls and collection
core.mjs: quiet timers, chances and habitat rules
data.mjs: 210 animals and rarity tiers
art.mjs and original-animals.mjs: animal drawings
meadow.png, shore.png, water.png: your three backgrounds
face.png: your rarest-tier picture
_headers and .nojekyll: hosting configuration

Microphone access requires a supported browser, HTTPS and permission for your game website.
Audio is processed locally, not recorded or uploaded. Settings save on the device.
The game rules and animal roster match V1.1. This package changes file organization only.
PNG decoding, relative references and packaging were checked; physical-device microphone testing was not available.
