---
name: intell-ui
description: Work on the INTELL Next.js frontend codebase. Use when editing App Router routes, React components, dashboard UI, marketing pages, auth/session flow, API proxy calls, SEO metadata, shadcn primitives, Zustand stores, TanStack Query hooks, or project documentation.
compatibility: Designed for this repository's Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn, pnpm, and the RTK shell wrapper.
metadata:
  product: INTELL
  repository: energy-iq-ui
  framework: Next.js 16
---

# INTELL Frontend Skill

## Purpose

Use this skill to make changes in the INTELL frontend reliably. INTELL is an AI-powered energy monitoring and optimization platform for solar and inverter users.

## Required First Steps

1. Read `AGENTS.md` before making changes.
2. Prefix shell commands with `rtk`.
3. Check the current worktree:

```bash
rtk git status --short
```

4. Do not revert user changes.
5. For framework-level work, read the relevant local Next.js docs in `node_modules/next/dist/docs/`.

## Core Rules

- Use `INTELL` as the product name everywhere.
- Reuse existing route groups, services, stores, hooks, and shadcn primitives.
- Keep protected user routes in `src/app/(dashboard)/dashboard`.
- Keep protected super-admin routes in `src/app/(dashboard)/super-admin`.
- Keep public marketing routes in `src/app/(external)`.
- Keep auth routes in `src/app/(auth)`.
- Use `src/lib/seo.ts` for metadata patterns.
- Keep backend-contract placeholder data in `src/constants`.
- Do not show "dummy data" or "backend not ready" copy in user-facing UI.

## References

- See [the codebase reference](references/REFERENCE.md) for routing, UI, auth, SEO, and super-admin conventions.
- See [the form reference](references/FORMS.md) for current form payload guidance.
- See [assets guidance](assets/README.md) before adding bundled skill assets.

## Scripts

The `scripts/` directory is available for future repeatable checks or codebase audits. See [scripts guidance](scripts/README.md).

## Verification

Run the smallest useful checks for the change, unless the user asked not to run them:

```bash
rtk pnpm lint
rtk pnpm typecheck
rtk pnpm build
```

## Commit Rules

Use Conventional Commits and split unrelated scopes when requested.

```bash
feat(super-admin): add onboarding lead details
fix(settings): refine feedback layout
docs(skill): add intell ui agent skill
```
