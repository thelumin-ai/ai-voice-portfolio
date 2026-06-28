# Design Specification: Gainlove Standalone Website Template

This document provides the complete structural, visual, and behavioral specifications to recreate the **Gainlove Global Aid Network** charity/non-profit landing page layout.

---

## 1. Template Category & Intended Business Type
* **Category**: Non-Profit & Charity (NGO)
* **Intended Business**: Foundations, charity campaigns, community aid networks, social justice programs, and environmental/social advocacy initiatives.

---

## 2. Section Inventory & Order
The template consists of the following sections in sequential order:

1. **Header Navigation (Sticky)**
   * Height: `70px` (Desktop)
   * Elements: Logo (left), Nav links (center), Phone number + search icon + profile icon + CTA button (right).
2. **Hero Banner Section**
   * Height: `680px` (Desktop)
   * Elements: Text copy (left 7 cols), Angled overlapping triple-pill image frame (right 5 cols), background beige map watermark.
3. **Programs Showcase Section**
   * Height: `580px` (Desktop)
   * Elements: Centered section title & subhead, 3-column card grid representing specific charity programs.
4. **Mission Welcome Banner Section**
   * Height: `400px` (Desktop)
   * Elements: Centered header, mission statement paragraph, dual actions button block (Get Involved + Donate).
5. **Fundraiser Split Section**
   * Height: `600px` (Desktop)
   * Elements: Overlapping circular images with dotted graphics (left 5 cols), fundraiser description and inline text links (right 7 cols).
6. **Feature Split Grid Section ("Give a future...")**
   * Height: `650px` (Desktop)
   * Elements: Tabbed feature categories list with text detail (left 6 cols), large square image showcase (right 6 cols).
7. **Footer Section**
   * Height: `180px` (Desktop)
   * Elements: Copyright text, privacy and terms links, social icon links.

---

## 3. Container & Layout Specifications

### Container Width
* **Desktop Content Container**: Max width `1200px` (centered via margin `mx-auto` with `px-6` padding).
* **Full-Width Backgrounds**: Section backgrounds stretch to `100%` viewport width.

### Background Elements
* **Background Colors**: Off-white canvas `#faf9f6` and clean white `#ffffff` alternated to create section separation.
* **Background Watermarks**: Translucent beige map coordinates/continents silhouettes (`#f0ede9`) placed in the background layer of the Hero and Fundraiser sections.

### Grid & Column Structure
* **System**: Standard 12-column flex/grid system.
* **Hero Grid**: 12 cols (Desktop: `col-span-7` text, `col-span-5` visual image frame).
* **Programs Grid**: 3-column equal flex layout on desktop (`grid-cols-3` with `gap-8`).
* **Fundraiser Grid**: 12 cols (Desktop: `col-span-5` circular preview frame, `col-span-7` text panel).
* **Feature Grid**: 2-column equal split on desktop (`grid-cols-2` with `gap-12`).

---

## 4. Typography & Font Recommendations
* **Headings Font (Serif)**: Classic, high-contrast, editorial serif that conveys prestige and urgency.
  * *Recommendation*: **Playfair Display** or **Cormorant Garamond**.
* **Body & Interface Font (Sans-Serif)**: Highly legible, neutral sans-serif.
  * *Recommendation*: **Inter** or **Plus Jakarta Sans**.

### Typography Scale
* **Hero Heading**: `text-4xl` to `text-5xl` (`2.5rem` to `3.25rem`), bold, font-serif, tracking close.
* **Section Heading**: `text-2xl` to `text-3xl` (`1.75rem` to `2.25rem`), bold, font-serif.
* **Sub-headings / Card Titles**: `text-base` to `text-lg` (`1rem` to `1.125rem`), bold.
* **Body Text**: `text-xs` to `text-sm` (`0.75rem` to `0.875rem`), leading-relaxed, text-stone-600.
* **Category/Overline Badges**: `text-[10px]` (`0.625rem`), font-bold, uppercase, tracking-widest, color `#d97706`.

---

## 5. Design Tokens (Colors, Borders, Shadows)

### Color Palette
* **Dominant Canvas Background**: `#faf9f6` (warm premium white)
* **Secondary Card Background**: `#ffffff` (pure white)
* **Primary Text**: `#1c1917` (deep warm carbon)
* **Secondary Text**: `#57534e` (warm stone gray)
* **Primary Accent Color**: `#d97706` (warm amber-yellow)
* **Secondary Accent Color**: `#10b981` (active green for "Get Involved" actions)
* **Borders / Separators**: `#e7e5e4` (stone-200)

### Border Radiuses
* **Card Borders**: `16px` (`rounded-2xl`)
* **Standard Buttons**: `4px` (`rounded`) or fully rounded pill styles.
* **Decorative Pill Images**: Fully rounded `rounded-full` caps for long cylinders.

### Shadows
* **Card Shadows**: Soft, ambient elevation shadow.
  * *Specification*: `box-shadow: 0 4px 20px -2px rgba(120, 110, 90, 0.08)`
* **Interactive Hover Shadows**: Slightly taller shadow with translation.
  * *Specification*: `box-shadow: 0 10px 25px -5px rgba(120, 110, 90, 0.12); transform: translateY(-2px)`

---

## 6. Components & Interactive Elements

### Button Styles
1. **Primary CTA (Amber/Yellow)**: Solid `#d97706` fill with white text, micro-scaling on click.
2. **Dark Action Button (Stone-900)**: Solid `#1c1917` fill with white text.
3. **Success Action Button (Green)**: Solid `#10b981` fill with white text.
4. **Ghost / Card Button (LEARN MORE)**: Solid black button with a small arrow icon, text-white.

### Card Components
* **Program Card**:
  * Visual banner header container (ratio 16:9).
  * Inner padding `p-6` with centered titles, brief body text.
  * Bottom-aligned "LEARN MORE" action button.

### Circular Overlapping Images
* A composite component of one large circle image (`w-48 h-48`) and two smaller overlapping circle images (`w-24 h-24`), bound by outer circular dashed rings representing geographic hubs.

---

## 7. Responsive Breakpoint Adaptation

### Desktop Layout (`lg` / `1024px+`)
* Full side-by-side splits on all grid sections.
* Triple-pill diagonal image block aligned strictly on the right side.
* Sticky navigation bar active.

### Tablet Adaptation (`md` / `768px` to `1023px`)
* Hero changes to vertical layout: text stack centered at top, triple-pill image container centered below.
* Programs grid changes from 3 columns to 2 columns (or 3-column scroll container).
* Split grids change to stacked panels (text on top, images/cards below).
* Container padding increases to `px-8` to ensure safe margins.

### Mobile Adaptation (`sm` / `767px` and below)
* Navigation menu collapses into a clean hamburger panel.
* Header CTAs hide, leaving only Logo and Hamburger toggle.
* All layouts stack in single columns.
* Pill-shapes in the hero shrink by `30%` to fit narrow mobile width without wrapping out of bounds.

---

## 8. Uncertain Details & Inferred Content
* **Telephony Link**: Clicking the phone number in the header triggers a custom contact dial popup.
* **Beige map watermark source**: Will be rendered using CSS clipping paths or lightweight embedded SVG shapes representing coordinate map overlays to avoid loading heavy image files.
* **Form Action**: The "Donate Now" buttons link to a secure billing checkout overlay or redirect to the payment consultation page.
