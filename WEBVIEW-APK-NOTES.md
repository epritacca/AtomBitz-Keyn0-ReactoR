# Atom BitZ Keno Reactor WebView/APK Notes

## Best Build Path

- Keep the game as one web app first.
- Wrap the web app in Android WebView when the Android build tools are installed.
- Use the hosted or bundled `index.html` as the WebView target.

## Current Readiness

- PWA manifest added: `manifest.webmanifest`
- Offline/service-worker cache added: `sw.js`
- App icons added: `assets/icon-192.png` and `assets/icon-512.png`
- Brand line: `A to Z Technology`
- Product name: `Atom BitZ Keno Reactor`
- Android WebView scaffold added: `android-webview`
- Bundled WebView asset path: `android-webview/app/src/main/assets/www/index.html`

## APK Requirements Still Needed On This Machine

- Java JDK
- Android SDK / Android Studio
- Gradle or Android Studio managed Gradle

ADB is already visible on this machine, but Java and Gradle were not visible during the first check.

## Build Later

Open `android-webview` in Android Studio after the Android build tools are installed, let it sync, then build a debug APK. The app package is `us.atombitz.kenoreactor`.

## Guardrail

This remains a free-play app. The APK should not add cash value, wallets, payouts, or Coinbase/payment features unless there is a separate compliance plan.
