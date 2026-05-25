---
name: Industrial Carbon Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bcc9c6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#879391'
  outline-variant: '#3d4947'
  surface-tint: '#6bd8cb'
  primary: '#6bd8cb'
  on-primary: '#003732'
  primary-container: '#29a195'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#b9c7e0'
  on-secondary: '#233144'
  secondary-container: '#3c4a5e'
  on-secondary-container: '#abb9d2'
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
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
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
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  metric-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  sidebar_width: 260px
  topbar_height: 64px
  gutter: 24px
  margin_container: 32px
  stack_sm: 8px
  stack_md: 16px
  stack_lg: 24px
---

## Brand & Style

The design system is engineered for precision, institutional trust, and high-velocity data analysis. It targets ESG controllers and sustainability engineers who require "industrial-grade" clarity when managing complex carbon inventories.

The aesthetic follows a **Modern Corporate** movement with a heavy emphasis on **High-Density Utility**. It utilizes a dark, low-fatigue color palette to support long-duration analytical sessions. Visual flourishes are strictly functional, using light and color only to direct attention to critical metrics or system states. The result is a UI that feels like a professional instrument—stable, transparent, and authoritative.

## Colors

The palette is anchored in a deep slate foundation to minimize glare and maximize contrast for numerical data. 

- **Primary (Electric Emerald):** Used for primary actions, success states, and positive carbon offsets. It provides a high-visibility signal against the dark background.
- **Surface Tiers:** Backgrounds transition from `#0F172A` (base) to `#1E293B` (containers) to create a sense of hierarchy without relying on shadows.
- **Borders:** A crisp `#334155` is used for structural delineation, ensuring that data cells and containers are clearly defined even in dense layouts.
- **Semantic Accents:** Amber and Crimson are reserved for threshold warnings and data ingestion errors, respectively.

## Typography

The design system utilizes **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. 

- **Metric-specific styles:** `metric-xl` is used for high-level carbon totals and KPI cards.
- **Numerical focus:** Ensure `font-variant-numeric: tabular-nums` is applied to all data tables and financial metrics to maintain vertical alignment across rows.
- **Hierarchy:** Lowercase labels are avoided in navigation and headers; `label-md` uses uppercase with slight tracking to differentiate metadata from body content.
- **Mobile scaling:** For small screens, `headline-lg` should scale down to 24px to prevent excessive line wrapping in dashboard views.

## Layout & Spacing

This design system uses a **systematic grid model** optimized for a complex dashboard environment.

- **Persistent Shell:** A 260px fixed-width left sidebar contains primary navigation. The 64px top utility bar handles tenant switching and global search.
- **Main Content:** A fluid layout with a maximum content width of 1600px to prevent excessive line lengths on ultra-wide monitors.
- **Grid System:** A 12-column grid is used for dashboard widgets. Gutters are fixed at 24px to ensure distinct separation of complex data visualizations.
- **Density:** Spacing follows a 4px base unit. For data tables, "Compact" (8px vertical padding) and "Standard" (12px vertical padding) modes should be available.

## Elevation & Depth

In a dark, industrial UI, depth is communicated through **tonal layering** and **low-contrast outlines** rather than traditional shadows.

- **The Z-Axis:**
  - **Level 0 (Base):** `#0F172A` (Background)
  - **Level 1 (Cards/Sidebar):** `#1E293B` (Surface Container)
  - **Level 2 (Modals/Popovers):** `#334155` (Surface Bright)
- **Outlines:** Every interactive element or container must have a 1px solid border (`#334155`). This replaces shadows as the primary method of separation, creating a "blueprint" or "technical drawing" feel.
- **Active State:** Use the primary Electric Emerald as a subtle 2px glow (inner-shadow) only to indicate focus or selection.

## Shapes

The shape language is **Soft** and disciplined. 

- **Radius:** A consistent 0.25rem (4px) radius is applied to buttons, input fields, and small UI components. This maintains a technical, sharp-edged appearance while avoiding the harshness of 0px corners.
- **Containers:** Larger cards and dashboard widgets utilize 0.5rem (8px) to subtly distinguish them from smaller UI elements.
- **Consistency:** Never use pill-shaped (fully rounded) buttons; maintain the 4px radius to preserve the industrial aesthetic.

## Components

- **Buttons:**
  - **Primary:** Solid Electric Emerald with white text. No gradient.
  - **Secondary:** Transparent background with a 1px `#334155` border.
- **Data Tables:** Use alternating row highlights (Zebra striping) using a slightly lighter slate. Headers should be sticky with a 2px bottom border in Primary Emerald.
- **Input Fields:** Dark background (`#0F172A`), 1px Slate border. On focus, the border changes to Primary Emerald with a subtle outer glow.
- **Metric Cards:** Large `metric-xl` typography for the value, with a small sparkline visualization and a `label-sm` for the percentage change.
- **Tenant Selector:** Located in the top utility bar, this component uses a distinctive "Searchable Dropdown" style with a 1px border to clearly separate the platform's multi-tenant structure.
- **Chips/Badges:** Small, 4px rounded indicators for "Verified," "Estimated," or "Manual" data sources, using low-opacity versions of the semantic colors (Emerald, Amber, Crimson).