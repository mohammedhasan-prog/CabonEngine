---
name: Industrial Carbon Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394e'
  surface-container-lowest: '#060d20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3e'
  surface-container-highest: '#2d3449'
  on-surface: '#dbe2fd'
  on-surface-variant: '#bcc9c6'
  inverse-surface: '#dbe2fd'
  inverse-on-surface: '#283044'
  outline: '#879391'
  outline-variant: '#3d4947'
  surface-tint: '#6bd8cb'
  primary: '#6bd8cb'
  on-primary: '#003732'
  primary-container: '#29a195'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffb59a'
  on-tertiary: '#591c02'
  tertiary-container: '#d27956'
  on-tertiary-container: '#4f1700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#0b1326'
  on-background: '#dbe2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 32px
  sidebar-width: 260px
  container-max: 100%
---

## Brand & Style

The design system is engineered for high-stakes industrial monitoring and carbon accounting. It prioritizes technical precision, utility, and rapid data synthesis. The visual language evokes a "Control Room" aesthetic—authoritative, focused, and unembellished. 

The style is a blend of **Minimalism** and **Modern Corporate**, utilizing a dark-mode-first approach to reduce eye strain during prolonged monitoring sessions. The aesthetic avoids decorative flourishes in favor of structural integrity, using purposeful color accents to denote system status and critical data points. The target audience consists of sustainability officers, plant managers, and data analysts who require a high-density information environment that remains legible and professional.

## Colors

The palette is anchored by a deep charcoal and slate foundation to provide a stable, low-distraction environment for data analysis. 

*   **Primary (Electric Emerald):** Reserved for core brand elements, primary calls to action, and "active/safe" status indicators. It provides a high-contrast punch against the dark background.
*   **Secondary (Slate):** Used for subtle UI differentiation, such as secondary buttons, inactive tabs, and hover states.
*   **Neutral (Charcoal/Dark Slate):** The bedrock of the interface, used for background surfaces and structural borders.
*   **Status Tones:** While not in the core variables, use semantic reds (#ef4444) for exceedance alerts and ambers (#f59e0b) for warnings, ensuring they harmonize with the Emerald primary.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic weight distribution. 

The typographic hierarchy is optimized for desktop density. For tabular data and numerical values, use the `mono-data` style to ensure vertical alignment of digits. `label-md` should be used for metadata and small headers, utilizing uppercase and slight tracking to differentiate from body copy. All headlines use a tighter letter spacing to maintain a compact, technical feel on large-format monitors.

## Layout & Spacing

This design system employs a **Fluid Grid** model designed for ultra-wide desktop monitors. The primary layout is a persistent multi-column structure featuring a fixed-width left navigation sidebar and a flexible main content area.

*   **Grid:** 12-column layout with tight 16px gutters to maximize horizontal space for data-heavy charts and tables.
*   **Margins:** 32px outer margins provide breathing room on the edges of the browser without wasting significant real estate.
*   **Density:** Spacing is based on a 4px baseline. Use tighter padding (8px or 12px) for data tables and larger padding (24px to 32px) for card-based dashboard summaries.
*   **Breakpoints:** Prioritize 1440px and 1920px widths. On smaller screens, the sidebar collapses into an icon-only rail to preserve the data view.

## Elevation & Depth

To maintain an industrial, flat-tech aesthetic, this design system avoids heavy shadows. Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**.

*   **Level 0 (Background):** #0b1326 - The lowest layer for the application canvas.
*   **Level 1 (Surfaces):** #111b2d - Used for cards and main content areas.
*   **Level 2 (Modals/Popovers):** #1e293b - The lightest surface color to indicate proximity.

Use a subtle 1px border (#334155) for all interactive containers instead of drop shadows. This creates a "blueprint" feel that is characteristic of high-end industrial software. Subtle inner glows are permitted for active states in the primary Emerald color to simulate a backlit hardware interface.

## Shapes

The shape language is strictly **Soft (Radius level 1)**. 

A uniform 4px (0.25rem) corner radius is applied to buttons, input fields, and cards. This slight rounding provides a professional, modern feel while maintaining the rigid, structural qualities expected in an enterprise environment. Avoid fully rounded "pill" shapes, as they conflict with the industrial, data-driven narrative.

## Components

### Buttons
*   **Primary:** Solid Electric Emerald with white or dark slate text (depending on contrast requirements). 4px radius.
*   **Secondary:** Ghost style with a Slate-400 border and subtle hover fill.

### Data Tables
The core of the design system. Tables use a 1px border-bottom for rows, no vertical borders. Row height is compact (32px - 40px). Header rows are styled with `label-md` and a slightly darker background.

### Input Fields
Dark backgrounds (#0b1326) with a 1px Slate border. On focus, the border transitions to Electric Emerald with a 1px outer glow. Labels are positioned above the field using `label-md`.

### Status Chips
Compact, rectangular chips with a 2px radius. Use low-opacity background fills of the semantic color (e.g., 10% Emerald) with a high-contrast text color for maximum legibility in dense lists.

### Dashboards & Cards
Cards use Level 1 surfaces with no shadow. Title areas within cards are separated by a subtle horizontal rule. Use persistent "Action Bars" at the top of cards for filtering or exporting data.