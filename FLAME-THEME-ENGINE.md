# Atom BitZ Flame Theme Engine

## Theme Variable Block

Colors are sampled from the provided Atom BitZ flame kit images and applied by `html[data-theme]`.

```css
html[data-theme="red"] {
  --flame-primary: #FF0000;
  --flame-secondary: #B00000;
  --flame-glow: #FF1000;
  --flame-metal: #FFFFB0;
  --flame-text: #FFFFFF;
  --flame-border: #F00000;
}

html[data-theme="yellow"] {
  --flame-primary: #FFC000;
  --flame-secondary: #D09000;
  --flame-glow: #FFF000;
  --flame-metal: #FFFFB0;
  --flame-text: #FFFFFF;
  --flame-border: #FFD000;
}

html[data-theme="green"] {
  --flame-primary: #00A000;
  --flame-secondary: #006000;
  --flame-glow: #10D000;
  --flame-metal: #D8E7FF;
  --flame-text: #FFFFFF;
  --flame-border: #00C000;
}

html[data-theme="purple"] {
  --flame-primary: #A020FF;
  --flame-secondary: #5020A0;
  --flame-glow: #D060FF;
  --flame-metal: #D8E7FF;
  --flame-text: #FFFFFF;
  --flame-border: #C050FF;
}

html[data-theme="pink"] {
  --flame-primary: #FF40D0;
  --flame-secondary: #A01060;
  --flame-glow: #FFB0E0;
  --flame-metal: #D8E7FF;
  --flame-text: #FFFFFF;
  --flame-border: #FF60E0;
}
```

## HTML/CSS/JS Modifications

- `index.html`
  - Adds `data-theme="red"` on the root HTML element.
  - Adds `#themeLogo` for the active flame logo.
  - Converts the theme strip into five `data-theme-mode` buttons.
  - Adds flame mini-icon payout legend.
  - Adds orbiting electron icons to Rounds, Best Hit, and Biggest Win.
  - Adds Core Charge meter fill.
  - Adds AB micro-icon footer.

- `styles.css`
  - Adds five theme variable blocks.
  - Applies `--flame-primary` to selected numbers.
  - Applies `--flame-glow` / `--flame-border` to hit numbers and active payout rows.
  - Adds atomic chip watermark to Reactor Draw.
  - Adds metallic button shine and hover glow.
  - Adds Best Hit metallic highlight and Core Charge pulse at 100%.

- `app.js`
  - Adds global `themeMode`.
  - Adds `THEME_ASSETS` for logo and flame mini-icon swaps.
  - Adds `applyTheme(nextTheme)`.
  - Persists selected theme in browser local storage.
  - Updates Core Charge meter width from existing state.
  - Does not change draw, payout, credit, or history logic.

## Asset Placement Map

- Header active logo:
  - `assets/atom-bitz-red-logo.png`
  - `assets/atom-bitz-gold-logo.png`
  - `assets/atom-bitz-green-logo.png`
  - `assets/atom-bitz-purple-logo.png`
  - `assets/atom-bitz-pink-logo.png`
- Theme buttons:
  - Same five logo files above.
- Reactor Draw watermark:
  - `assets/atomic-chip-icon.png`
- Footer AB micro-icon:
  - `assets/ab-micro-icon.png`
- Rounds / Best Hit / Biggest Win orbit icon:
  - `assets/orbit-electron-icon.png`
- Payout Map flame mini-icons:
  - `assets/flame-mini-red.png`
  - `assets/flame-mini-yellow.png`
  - `assets/flame-mini-green.png`
  - `assets/flame-mini-purple.png`
  - `assets/flame-mini-pink.png`
- Hit-number smash badge:
  - `assets/atom-hit-badge.png`
  - `assets/atom-hit-flame-badge.png`
