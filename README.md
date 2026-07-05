# Atom BitZ Keno Reactor

Atom BitZ Keno Reactor is a free-play browser Keno prototype for the AtomBitz app lane.

It uses offchain AB App Coins as local demo points only. AB App Coins have no cash value, no redemption value, no transfer value, no Coinbase connection, no wallet connection, and no wagering integration.

## Current Features

- Four independent Keno cards with one shared 80-number board.
- View All mode that overlays each card's color marker on the board.
- Pick 1-10 numbers per card, quick pick, clear, and draw flow.
- Free 0.00 demo coin checkout flow.
- Optional local support pledge workflow with no payment processing.
- Theme artwork generated from one clean Atom BitZ source image.
- PWA manifest, service worker, and Android WebView scaffold.

## Run Locally

From this folder:

```powershell
python -m http.server 5177 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5177/
```

## Project Guardrails

- Keep the app free-play unless a separate compliance and licensing plan approves a different model.
- Keep AB App Coins as local app points only.
- Do not connect gameplay to Coinbase, wallets, cashable balances, paid entries, prizes, or redemptions.
- Keep donations and support pledges separate from game odds, payouts, eligibility, and coin grants.
- Do not use chopped, distorted, placeholder, or low-fit artwork. If an asset is not clean, mark it pending.

## Base And Talent Direction

The near-term Base/Talent path is proof-of-build, not real-money gaming:

- Publish this clean repo as public project evidence.
- Host the free-play app on an AtomBitz-controlled URL.
- Use GitHub commits, hosted demos, and app metadata as builder proof.
- Add wallet identity later only for sign-in, profile, or non-cash reputation features after review.

## Android WebView

The Android wrapper lives in `android-webview/` and bundles the web app under:

```text
android-webview/app/src/main/assets/www/
```

Build notes are in `WEBVIEW-APK-NOTES.md`.
