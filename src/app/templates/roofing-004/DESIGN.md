# DESIGN.md — roofing-004 Industrial Precision
## Source: Stitch Project `15573664078133822604`
## Title: Premium Multi-Page Site Template

---

## Design System Name
**Industrial Precision**

---

## Brand & Style
Built for the high-stakes world of industrial construction and roofing. Prioritizes **Structural Integrity** and **Operational Excellence** through a visual language that feels heavy, permanent, and reliable.

The aesthetic blends **Industrial Minimalism** with **High-Contrast Boldness** — a "Dark Mode First" approach evoking professional blueprints and architectural renderings.

Key visual pillars:
- **Atmospheric Depth:** Deep blacks and charcoals as a silent premium backdrop
- **Urgency & Action:** Safety orange used sparingly but aggressively for conversion
- **Architectural Rhythm:** Large-scale typography and generous vertical rhythm

---

## Colour Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#131313` | Page canvas |
| `surface-container` | `#202020` | Service cards, form backgrounds |
| `surface-container-high` | `#2a2a2a` | Bento grid cells |
| `surface-container-highest` | `#353535` | Borders, dividers |
| `surface-container-lowest` | `#0e0e0e` | True black footer |
| `on-surface` | `#e5e2e1` | Primary body text |
| `on-surface-variant` | `#e5beb6` | Secondary/muted text |
| `primary` | `#ffb4a5` | Accent, active nav |
| `primary-container` | `#ff5637` | CTA buttons, icons |
| `inverse-primary` | `#ba1d00` | Button hover |
| `secondary` | `#c6c6c7` | Subtitles, body copy |
| `outline-variant` | `#5c403a` | Borders |

---

## Typography
| Scale | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| display-xl | Montserrat | 72px | 800 | 80px | -0.02em |
| headline-lg | Montserrat | 48px | 700 | 56px | -0.01em |
| headline-lg-mobile | Montserrat | 36px | 700 | 44px | — |
| headline-md | Montserrat | 32px | 700 | 40px | — |
| body-lg | Work Sans | 18px | 400 | 28px | — |
| body-md | Work Sans | 16px | 400 | 24px | — |
| label-bold | Work Sans | 14px | 600 | 20px | 0.05em |

---

## Spacing
| Token | Value |
|-------|-------|
| section-gap | 120px |
| section-gap-mobile | 64px |
| container-max | 1280px |
| gutter | 24px |
| margin-mobile | 20px |

---

## Shape Language
- **Border radius: 0px across ALL components** — structural steel aesthetic
- Sharp rectangular edges — reinforces industrial identity

---

## Components

### Buttons
- **Primary:** bg-[#ff5637] text-white uppercase bold, 0px radius, hover bg-[#ba1d00]
- **Secondary:** border-2 border-white text-white uppercase, 0px radius, hover bg-white text-[#131313]

### Header
- Background: #131313, height: 80px, sticky top-0
- Logo: icon + brand text Montserrat uppercase bold
- Nav links: Work Sans, active: border-b-2 border-[#ffb4a5]
- CTA: primary-container bg button, 0px radius
- Mobile: hamburger, slide-down menu drawer

### Hero
- Full-bleed background image with directional gradient overlay
- Overlay: linear-gradient(to right, rgba(15,15,15,0.9), rgba(15,15,15,0.4))
- Min-height: 819px, left-aligned text in max-w-2xl
- H1: display-xl Montserrat 800w white
- Subtext: body-lg Work Sans, color secondary
- Buttons: primary + secondary CTA pair

### Bento Services Grid
- 3-column, 1px gaps, #131313 gap background
- Left column: orange (#ff5637) highlight block with brand headline, ghost CTA
- Right 2 columns: 2×3 grid of service cards (#2a2a2a bg)
- Cards: Material Symbol icon (orange), label-bold heading UPPERCASE, body-md description
- Hover: 2px bottom-border in #ff5637

### Performance Photo Cards (3-up)
- Card bg: #202020, border: #353535
- Image top: h-64, group-hover scale-105
- Content: headline-md white, body-md secondary, full-width primary button

### Footer
- Background: #0e0e0e (true black)
- Grid: 4 cols (brand col-span-2, services, legal)
- Brand: icon + name + tagline + copyright
- Link cols: label-bold uppercase white heading, muted text links

---

## Page Structure

### Home
1. Header (sticky)
2. Hero — full-bleed image, overlay, display-xl headline
3. Bento Services Grid — asymmetric 1+6 layout
4. Performance Cards — 3-up with imagery
5. Footer

### Services
1. Header
2. Page Banner (dark, orange label, h1)
3. Six Service Detail Cards (icon + heading + description)
4. Process Timeline (3-step numbered)
5. CTA Strip (orange bg)
6. Footer

### About
1. Header
2. Page Banner
3. Mission/Story Split (text + image)
4. Values Grid (3 principles, numbered icons)
5. Stats Counter (3-up)
6. Team CTA
7. Footer

### Contact
1. Header
2. Page Banner
3. Two-column: Details (left) + Form (right)
4. Map Placeholder
5. Footer

### Quote
1. Header
2. Page Banner
3. Detailed Quote Form
4. Footer

---

## Design Fingerprint
```json
{
  "templateId": "roofing-004",
  "niche": "roofing / construction",
  "headerArchetype": "sticky-dark-surface-logo-left-nav-center-0px-radius-orange-cta-right",
  "heroArchetype": "full-bleed-bg-image-directional-overlay-left-aligned-display-heading",
  "sectionSequence": ["header","hero","bento-services-grid","performance-photo-cards","footer"],
  "gridArchetype": "asymmetric-bento-1-orange-plus-2x3-dark-cards-1px-gaps",
  "imageTreatment": "industrial-dark-photography-directional-gradient-overlay",
  "typography": "montserrat-800-display-xl-72px-work-sans-400-body",
  "radiusSystem": "0px-everywhere-industrial-rectangular",
  "colorDistribution": "#131313-bg-#202020-cards-#353535-borders-#ff5637-cta-orange",
  "footerArchetype": "true-black-0e0e0e-4col-brand-x2-plus-link-columns",
  "mobileTransformation": "hamburger-drawer-single-column-stack-36px-headline"
}
```
