# INTELL UI Codebase Reference

## Brand

- Product name: `INTELL`.
- Logo text: `INTE` plus amber `LL`.
- Use `src/components/ui/logo.tsx` instead of recreating the logo.
- Primary color: amber `#F5A623`.

## Routes

- `src/app/(external)`: public pages.
- `src/app/(auth)`: auth pages.
- `src/app/(dashboard)/dashboard`: user dashboard.
- `src/app/(dashboard)/super-admin`: protected super-admin pages.
- `/super-admin` is the public super-admin login page.
- `/super-admin/dashboard` and sibling super-admin pages are protected.

## UI

- Use local shadcn-compatible primitives from `src/components/ui`.
- Use `Select` from `src/components/ui/select.tsx` for dropdowns.
- Use `Card` primitives for repeated panels and metric cards.
- Use `DashboardBreadcrumb` where dashboard/settings/detail pages need location context.
- Prefer row-click navigation for admin tables instead of separate `View` buttons.
- Keep table IDs on one line.
- Keep filter controls page-specific.

## Super Admin

- Static super-admin data lives in `src/constants/super-admin.ts`.
- Users: account status, plan, last activity, AI credits, spend, connected inverters, invited members, invited technicians.
- Installers: installer type, company, region, users/sites managed, supported inverter types, account state.
- Leads: contact details, state, inverter type, interest, source, message, lead stage.
- Feedback: submitted by, category, message, status, priority, review update.
- Communications: subject, audience, delivery status, body, CTA label, CTA URL.

## Auth and API

- Backend-owned refresh/session behavior should be preserved unless the task is specifically auth-related.
- Use `src/app/api/proxy/[...path]/route.ts` for backend proxy behavior.
- Use services in `src/services` and hooks in `src/hooks` when existing patterns are available.
- Use Zod schemas in `src/lib/schemas` for form payloads.

## SEO

- Shared SEO helpers live in `src/lib/seo.ts`.
- Public routes should be reflected in `PUBLIC_ROUTES` when they need sitemap coverage.
- OG/Twitter preview defaults to `public/images/request_demo_3.jpg`.
- Use page-specific metadata for public marketing pages.
