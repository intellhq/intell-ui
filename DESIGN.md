---
version: alpha
name: INTELL Frontend Design System
description: Design tokens and UI rules for the INTELL solar inverter monitoring and optimization frontend.
colors:
  primary: "#F5A623"
  primary-hover: "#E08A1E"
  primary-soft: "#FDE8B4"
  primary-subtle: "#FEF6E4"
  secondary: "#111928"
  background: "#F9FAFB"
  foreground: "#0F1115"
  surface: "#FEFEFE"
  surface-muted: "#F4F5F6"
  border: "#E5E7EB"
  border-active: "#D8DBE2"
  muted: "#8A9099"
  dark-surface: "#1A1F2C"
  dark-background: "#0F1115"
  dark-card: "#2A2F3C"
  success: "#4ADE80"
  success-strong: "#057A55"
  success-soft: "#DEF7EC"
  warning: "#C27803"
  warning-soft: "#FDF6B2"
  danger: "#C81E1E"
  danger-soft: "#FFEBEB"
  coral: "#E85D30"
  chart-solar: "#FBBF24"
  chart-diesel: "#FB923C"
  chart-battery: "#057A55"
  chart-grid: "#64748B"
typography:
  headline-lg:
    fontFamily: Geist Sans
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0em
  headline-md:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0em
  title-lg:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0em
  title-md:
    fontFamily: Geist Sans
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-md:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  label-md:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0em
  label-sm:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0em
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 18px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  page-x-mobile: 24px
  page-x-desktop: 48px
  section-y: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    height: 40px
    padding: 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.2xl}"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    height: 44px
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success-strong}"
    rounded: "{rounded.full}"
  badge-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
  badge-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
---

# INTELL Design System

## Overview

INTELL is an AI-powered energy monitoring and optimization platform for solar and inverter users. The interface should feel clear, operational, and trustworthy: users are checking live energy systems,

The design language is clean and dashboard-first. Marketing pages can be more spacious and visual, but authenticated dashboard pages should stay dense enough for scanning without becoming cramped. The

## Colors

The palette uses amber as the product accent, dark slate for structure, white/off-white surfaces for dashboards, and semantic colors for operational state.

- **Primary Amber (#F5A623):** Main brand accent, CTA color, logo `LL`, focus ring, key active state.
- **Secondary Slate (#111928):** Strong text, navigation contrast, and dark UI accents.
- **Background (#F9FAFB):** App background for dashboards and settings.
- **Surface (#FEFEFE):** Cards, tables, popovers, and form panels.
- **Dark Surface (#1A1F2C):** External footer and dark brand surfaces.
- **Success (#4ADE80 / #057A55):** Healthy systems, active accounts, positive changes.
- **Warning (#C27803):** Medium severity alerts, pending review, caution states.
- **Danger (#C81E1E):** Critical alerts, failed operations, destructive actions.
- **Chart Colors:** Use solar amber, diesel coral, battery green, and grid slate consistently across energy visuals.

## Typography

Use the app's configured sans font for all UI. Keep typography practical and readable.

- **Marketing headlines:** Bold, compact, and direct. Avoid oversized hero text that hides the next section.
- **Dashboard titles:** 24px to 32px bold, depending on hierarchy.
- **Body text:** 14px to 16px for tables, cards, descriptions, and forms.
- **Labels:** 12px to 14px medium or semibold for field labels, badges, and metadata.
- **Letter spacing:** Keep at `0`. Do not use negative tracking.

## Layout

Authenticated pages use route groups under `src/app/(dashboard)` and should align with the existing dashboard shell. External pages use `src/app/(external)` and should share navbar, footer, SEO, and s

- Use full-width page bands or constrained containers, not floating nested cards for whole screens.
- Dashboard pages should use responsive grids, table overflow handling, and compact cards.
- Mobile layouts must wrap controls cleanly. Filter groups should avoid tall stacks where horizontal scroll or responsive grids are better.
- IDs in tables should not wrap.
- Row-click navigation is preferred in super-admin tables. Avoid redundant `View` action buttons.
- Use breadcrumb navigation on dashboard/settings detail pages where the user needs location context.

## Elevation & Depth

Depth is subtle. The app uses borders, tonal surfaces, and light shadows instead of heavy elevation.

- Cards use `ring-1`, `border`, or `shadow-sm` at most.
- Popovers, dialogs, and dropdowns can use `shadow-md`.
- Avoid layered nested cards unless the inner card is a repeated item or modal content.

## Shapes

The shape language is modern but restrained.

- Inputs and select triggers use 8px radius.
- Buttons commonly use 12px radius.
- Cards use larger rounded corners where already established by `Card`.
- Badges and avatar initials may use full radius.

## Components

- **Buttons:** Use `src/components/ui/button.tsx`. Primary actions use amber. Secondary actions use outline or ghost variants.
- **Inputs/Textareas:** Use shadcn-compatible primitives from `src/components/ui`. Do not hand-roll select/dropdown behavior.
- **Selects:** Use `src/components/ui/select.tsx` for all dropdown form controls.
- **Cards:** Use `src/components/ui/card.tsx` for repeated dashboard metrics, panels, dialogs, and framed tools.
- **Tables:** Keep headers descriptive and page-specific. Columns and filters must match the page domain.
- **Badges:** Use semantic states. Feedback can use Open/In Progress/Resolved. Communications should use Draft/Scheduled/Delivered/Failed. Leads should use Open/Contacted/Qualified. Installers should 
- **Charts:** Use real visual marks through Recharts or code-native chart elements. Do not ship chart cards with only labels and no plotted data.
- **Logo:** Use `Logo` from `src/components/ui/logo.tsx`; do not recreate the brand mark in each page.

## Do's and Don'ts

- Do reuse existing shadcn primitives, dashboard components, route shells, and constants before adding new patterns.
- Do keep dummy data in a single constants file when backend integration is not ready.
- Do make empty, loading, and error states explicit for user-facing data views.
- Do align super-admin page content with INTELL operations: users, installers, leads, feedback, communications, AI credit usage, and onboarding.
- Do keep protected dashboard routes inside the dashboard route group.
- Do preserve backend-owned auth/session contracts and proxy behavior unless the task is specifically about auth.
- Don't use unrelated generic admin fields like priority/status on every page.
- Don't mention local dummy data or missing backend work in the user-facing UI.
- Don't add action buttons to tables where row click is the intended behavior.
- Don't introduce new colors, fonts, large SVG illustrations, or decorative gradients unless they match the current system.
- Don't wrap the `INTELL` product name in mixed case.
