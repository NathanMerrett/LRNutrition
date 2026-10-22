# Website Design Rulebook

> **Instructions for Claude:** This file is the single source of truth for the visual design of this site. Implement everything below across the mobile website. Where a value is marked `TODO`, ask me before inventing one. Do not introduce colours, fonts, spacing values or components that are not defined here. If something is missing, propose an addition rather than improvising. Express all values as CSS custom properties (design tokens) in one global file, and reference the tokens everywhere instead of hard-coding values.

---

## 1. Brand Overview

| Item | Value |
|---|---|
| Site / brand name | LRNutrition |
| One-line description | A website for a nutritionist to gain clients, post blogs |
| Target audience | Interested nutrition clients |
| Brand personality (3-5 words) | Calm, trustworthy and honest |
| Tone of voice | No jargon, friendly, welcoming |
| Primary device | Mobile first (design at 375px, scale up) |

**Design principles** (ranked, use these to settle any disagreement):
1. clean, modern
2. Simple, easy to navigate
3. Consistency over novelty

---

## 2. Colour Palette

### 2.1 Core colours

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#3B2416` | Espresso. Buttons, links, eyebrows, prices: everything you read or tap |
| `--color-primary-hover` | `#563E2F` | Hover and pressed (tapped) state of primary |
| `--color-brand` | `#EF8E80` | Coral. Large fills only (the hero band). Never text, never a thin line that carries meaning (2.3:1 on the background) |
| `--color-accent` | `#FFD8D2` | Blush, a tint of the coral. Closing call-to-action band, badges, highlights |

Text on coral or blush is always `--color-text` (6.1:1 and 11:1). Muted text fails on both.

### 2.2 Neutrals

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FFF8F0` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, sheets, nav bars |
| `--color-border` | `#EBD9CC` | Dividers and card borders. Not input borders: at 1.3:1 it fails WCAG 1.4.11, so inputs use `--color-text-muted` |
| `--color-text` | `#3B2416` | Body text |
| `--color-text-muted` | `#7A5F50` | Captions, helper text, placeholders |
| `--color-text-inverse` | `#FFF8F0` | Text on primary / dark backgrounds |

### 2.3 Feedback colours

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#3F7D4E` | Success messages, confirmations |
| `--color-warning` | `#9A6700` | Warnings |
| `--color-error` | `#B3261E` | Errors, destructive actions |
| `--color-info` | `#2F6F8F` | Informational notices |

---

## 3. Typography

### 3.1 Font families

| Token | Font | Fallback stack | Use |
|---|---|---|---|
| `--font-heading` | Fraunces (variable, weight 600) | `Georgia, "Times New Roman", serif` | Headings only |
| `--font-body` | DM Sans (variable, weights 400-600) | `system-ui, sans-serif` | Body, buttons, forms, navigation |
| `--font-mono` | Not used | n/a | n/a |

- Source: self-hosted variable woff2 files (latin subset) in `app/public/fonts/`, so there is no request to Google and no visitor IPs are shared with a third party.
- Use only Fraunces 600 and DM Sans 400, 500 and 600, with `font-display: swap`.
- Preload both font files in the page `<head>`.
- Use the heading font for headings and large pull-quotes only, never for buttons, labels or navigation.

### 3.2 Type scale (mobile first, fluid)

All sizes are in `rem` so they respect the user's browser font settings. The `clamp()` values scale smoothly from a 375px phone up to desktop.

| Style | Mobile size | Fluid value | Line height | Weight | Letter spacing |
|---|---|---|---|---|---|
| Display / H1 | 34px | `clamp(2.125rem, 1.8rem + 1.6vw, 3rem)` | 1.15 | 600 | -0.02em |
| H2 | 28px | `clamp(1.75rem, 1.5rem + 1.2vw, 2.25rem)` | 1.2 | 600 | -0.01em |
| H3 | 22px | `clamp(1.375rem, 1.25rem + 0.6vw, 1.5rem)` | 1.3 | 600 | -0.01em |
| Body | 17px | `1.0625rem` | 1.6 | 400 | 0 |
| Small / caption | 14px | `0.875rem` | 1.45 | 400 | 0.01em |
| Button / label | 16px | `1rem` | 1 | 600 | 0.01em |

### 3.3 Typography rules
- Body text is never smaller than **16px** on mobile (prevents iOS input zoom). Form inputs stay at 16px or larger.
- Maximum line length: about 65 characters (`max-width: 65ch` on text blocks).
- Left-align body text; avoid justified text and all-caps paragraphs.
- One H1 per page; headings must follow a logical order (no skipping levels).
- Heading colour is `--color-text`. Use `--color-primary` for links and key highlights, not for whole headings.
- Apply `text-wrap: balance` to headings and `text-wrap: pretty` to body paragraphs to avoid awkward line breaks and single-word last lines.
- Use `font-variant-numeric: tabular-nums` for prices, times and tables.
- Use sentence case for headings and buttons (no Title Case, no ALL CAPS).
- Limit weights to 400, 500 and 600. Avoid bold (700+) and italics except for short emphasis.
- Minimum tap target of 44px still applies to text links in navigation and footers; add padding rather than enlarging the text.

---

<!-- ## 4. Spacing & Layout

### 4.1 Spacing scale (4px base)

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

### 4.2 Layout rules
- Page side padding on mobile: `--space-4` (16px).
- Breakpoints: mobile `0-599px`, tablet `600-1023px`, desktop `1024px+` (TODO adjust).
- Max content width on larger screens: TODO (e.g. 1120px), centred.
- Use CSS Grid / Flexbox; no fixed pixel widths for containers.
- Respect safe areas: `env(safe-area-inset-*)` for fixed headers and footers.
- Vertical rhythm: sections separated by `--space-7`, related items by `--space-3` to `--space-4`. -->

---
<!-- 
## 5. Shape, Elevation & Motion

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | TODO (e.g. 6px) | Inputs, tags |
| `--radius-md` | TODO (e.g. 12px) | Buttons, cards |
| `--radius-lg` | TODO (e.g. 20px) | Sheets, modals |
| `--radius-full` | 9999px | Pills, avatars |
| `--shadow-sm` | TODO | Cards at rest |
| `--shadow-md` | TODO | Raised / hovered elements |
| `--shadow-lg` | TODO | Modals, menus |
| `--duration-fast` | 150ms | Hover, press feedback |
| `--duration-base` | 250ms | Transitions |
| `--easing` | `cubic-bezier(0.2, 0, 0, 1)` | Default easing |

- Motion must be subtle and purposeful. Honour `prefers-reduced-motion` by disabling non-essential animation. -->

---
<!-- 
## 6. Components

### 6.1 Buttons
- **Primary:** background `--color-primary`, text `--color-text-inverse`, radius `--radius-md`.
- **Secondary:** transparent background, 1px `--color-primary` border, primary-coloured text.
- **Tertiary / text:** no background or border, underlined or primary-coloured text.
- **Minimum tap target: 44 x 44px.** Padding TODO (e.g. 12px 20px).
- States to implement: default, hover, active/pressed, focus-visible, disabled, loading.
- Full-width on mobile where the button is the main action.

### 6.2 Links
- Colour: `--color-primary`, underlined in body copy.
- Visited / hover / focus states defined and visible.

### 6.3 Forms & inputs
- Height at least 44px; font size at least 16px.
- Labels always visible above the field (no placeholder-only labels).
- Error state: `--color-error` border plus message text beneath the field.
- Use the correct `type`, `inputmode` and `autocomplete` attributes.

### 6.4 Cards
- Background `--color-surface`, radius `--radius-md`, padding `--space-4`, `--shadow-sm` or 1px border (pick one, TODO).

### 6.5 Navigation
- Pattern on mobile: TODO (e.g. top bar with hamburger drawer / bottom tab bar).
- Header height: TODO (e.g. 56px). Sticky: TODO (yes / no).
- Current page clearly indicated.

### 6.6 Other components (add as needed)
- Modals / sheets: TODO
- Toasts / alerts: TODO
- Accordions / FAQs: TODO
- Footer: TODO -->

---

<!-- ## 7. Imagery & Iconography

- Logo: TODO (file path, minimum size, clear-space rule).
- Image style: TODO (e.g. natural light photography, no stock clichés).
- Aspect ratios: TODO (e.g. 16:9 hero, 1:1 thumbnails).
- Always provide `alt` text; use decorative `alt=""` where appropriate.
- Serve responsive images (`srcset`/`sizes`), WebP or AVIF, `loading="lazy"` below the fold.
- Icon set: TODO (e.g. Lucide). Size 24px default, stroke 1.5-2px, inherit text colour. -->

---

## 13. Do & Don't Quick Reference

**Don't**
- Hard-code hex values or pixel sizes outside the token file.
- Add new fonts, colours or shadows without updating this document.
- Rely on hover for essential interactions (mobile has none).
