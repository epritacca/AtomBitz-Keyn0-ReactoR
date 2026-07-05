# Atom Bitz Keno Reactor Project Tracker

## Current Status

- Workspace: this repository folder
- Project lane: AtomBitz free-play game prototype
- Talent.app project: `https://talent.app/~/projects/45f7a2ac-c124-4a8d-9ea7-19eab4060439`
- Public safety status: Free-play offchain AB App Coins only; no cash value, no wallet, no Coinbase connection, no wagering integration.
- Prototype status: Local browser app created on 2026-07-04; branded/WebView-ready pass started.

## Latest Work

- Built `index.html`, `styles.css`, and `app.js` as a standalone browser Keno game.
- Added Atom Bitz blue chrome branding from local CortexHUD source art.
- Added pick 1-10 board play, 20-number draw, quick pick, clear, wager presets, fake credit bank, payout map, recent round history, local browser save, and reset.
- Used `crypto.getRandomValues` when available for round draws.
- Added `A to Z Technology` / `Atom BitZ` top-left brand lockup, theme badge strip, Atom hit-smash visual treatment, PWA manifest, service worker, and app icons for a later WebView/APK wrap.
- Added `WEBVIEW-APK-NOTES.md` with the Android wrapper path and current tool gap.
- Added `android-webview/`, a minimal Android WebView project that bundles the web prototype under `app/src/main/assets/www/` and loads it as `file:///android_asset/www/index.html`.
- Added an Android resource icon at `android-webview/app/src/main/res/drawable/atom_bitz_icon.png`.
- Recolored selected numbers to Atom BitZ gold/yellow and winning hit numbers to hot red for stronger board feedback.
- Added the Atom BitZ Flame Theme Engine with `red`, `yellow`, `green`, `purple`, and `pink` modes, theme asset swaps, atomic chip watermark, orbit stat icons, AB footer mark, payout flame legend, and Core Charge meter styling.
- Added `FLAME-THEME-ENGINE.md` with the full variable block and asset placement map.
- Fixed browser-comment polish: theme selector images now center/contain instead of cropping, and the top-right chopped wordmark was replaced with a centered theme-matching Atom BitZ lockup.
- Added the project to Cortex HUD as `Atom BitZ Keno Reactor` under the AtomBitz Estate lane.
- Added a free `$0.00` Demo Coin Checkout flow with selectable cart packs, optional local support pledge, local receipts, and no payment method.
- Renamed the game currency lane to offchain `AB App Coins` for the app/platform concept, while preserving no-cash-value and no-redemption language.
- Replaced the older cropped Keno board/logo images with the cleaned CortexHUD image set and switched small image placements to contain-fit rendering.
- Replaced the duplicated hero header with the clean Atom BitZ header banner.
- Rebuilt the theme buttons from clean CortexHUD art and generated a horizontal green variant from the clean header source instead of using the portrait green image.
- Standardized all theme headers and color buttons from one clean source image; only hue changes between themes.
- Converted the top color strip into four Keno card tabs plus `View All`; each card stores its own picks, and View All overlays colored card markers on one shared board.
- Added GitHub-ready repo basics: `.gitignore`, `README.md`, and `docs/github-talent-publishing-plan.md`.
- Chose the safe GitHub scope: publish the Keno app folder only, not the full `bonus.atombitz.us` workspace.
- Linked the Talent.app project tracker for `Atom Bitz Keno Reactor`.

## Next Practical Step

- Create/push a GitHub repo for this folder, then link it to Talent.app/Base builder surfaces as proof-of-build.

## Guardrails

- Keep this prototype free-play unless the user explicitly starts a separate compliance/licensing plan.
- Treat `AB App Coins` as local app points, not a tradable token, security, sweepstakes coin, stored-value balance, or redeemable currency.
- Do not connect this game to Coinbase, wallets, payments, tips, or cashable balances.
- Keep the checkout flow free/demo-only unless a separate sweepstakes or gaming compliance review approves a different structure.
- Keep donations separate from gameplay odds, payouts, sweepstakes treatment, and demo coin eligibility.
- Do not use chopped, distorted, or bad-fit artwork. If a clean version is missing, mark the asset as pending instead of forcing it into the UI.
- If hosted under `atombitz.us`, label it clearly as demo/free-play.
- Keep the Android wrapper pointed at bundled local game files unless the user decides to host the game and use a remote URL.
