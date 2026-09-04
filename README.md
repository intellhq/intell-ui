# INTELL

INTELL is an AI-powered energy monitoring and optimization platform built to help households and businesses understand, monitor, and improve the performance of their solar and inverter systems.

Instead of waiting until equipment fails or power interruptions affect daily life or operations, INTELL gives users real-time visibility into their energy systems, sends proactive alerts when issues a

The platform is designed to reduce uncertainty around energy usage while helping users save money, reduce downtime, and manage one or more energy systems from a single dashboard.

## Deployment

- **[Production](https://www.intell.ng)** 
- **[Staging](https://staging.intell.ng)** 

## The Problem INTELL Is Solving

For many households and businesses that rely on solar and inverter systems, maintaining reliable power is still a challenge even after making significant investments in energy infrastructure.

Owners often have limited visibility into how their systems are performing. Battery degradation goes unnoticed, inverter faults are discovered too late, and energy production is rarely monitored close

At the same time, users struggle to answer simple but important questions such as:

- Is my solar system performing as expected?
- Why is my battery draining faster than usual?
- How much money am I actually saving by using solar instead of fuel?
- Which site requires attention first?
- Is my inverter developing a fault before it fails?

## The Value INTELL Delivers

The value of INTELL extends beyond monitoring. The platform helps users become more proactive in how they manage energy, detecting abnormalities early, responding faster, and reducing avoidable downti

For organisations managing multiple locations, the platform also creates a central point for monitoring energy performance across sites without requiring physical inspections.

## Core Product Capabilities

| Capability | Value Delivered |
| ---------- | --------------- |
| Real-time System Monitoring | Continuous visibility into inverter, battery and energy performance. |
| AI Energy Assistant | Helps users understand system behaviour, identify issues and receive guidance through conversational AI. |
| Intelligent Alerts | Notifies users when faults, abnormal behaviour or potential risks are detected before they escalate. |
| Cost & Savings Tracking | Shows the financial impact of solar usage by translating energy production into estimated monetary savings. |
| Multi-site Management | Enables organisations to monitor multiple installations from a single platform. |
| Reporting & Analytics | Provides historical trends, operational insights and reports that support informed decision-making. |

## Stack

- **Next.js 16** App Router (`proxy.ts`, `forbidden.tsx`, `unauthorized.tsx`)
- **React 19**, **TypeScript** (strict)
- **Tailwind v4** with shadcn `radix-maia` style
- **`@t3-oss/env-nextjs`** + **Zod 4** for build-time env validation

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # fill in values
pnpm dev
```

Open <http://localhost:3000>.

## Scripts

| Command | What it does |
| ------- | ------------ |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## Environment Variables

Schemas live in [`src/env/`](./src/env), split by side:

- [`src/env/server.ts`](./src/env/server.ts) - server-only vars. t3-env throws at runtime if a client component reads it.
- [`src/env/client.ts`](./src/env/client.ts) - `NEXT_PUBLIC_*` vars, safe everywhere.

Both are imported in [`next.config.ts`](./next.config.ts) so the build fails on any malformed value. Set `SKIP_ENV_VALIDATION=1` to bypass validation for Docker or lint-only CI.

| Var | Side | Required | Notes |
| --- | ---- | -------- | ----- |
| `NODE_ENV` | server | auto | `development` / `test` / `production` |
| `API_BASE_URL` | server | optional | Upstream API for server-side `fetch` |
| `API_SECRET` | server | optional | Bearer token forwarded server-side |
| `NEXT_PUBLIC_APP_URL` | client | optional | Defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | client | optional | Defaults to `INTELL` |

Use it like:

```ts
// Server code (route handlers, Server Components, Server Actions)
import { env } from "@/env/server";

await fetch(`${env.API_BASE_URL}/users`, {
  headers: { Authorization: `Bearer ${env.API_SECRET}` },
});

// Client code or shared metadata
import { env } from "@/env/client";

console.log(env.NEXT_PUBLIC_APP_URL);
```

## Proxy (`src/proxy.ts`)

Replaces the legacy `middleware.ts` in Next.js 16. It runs before the cache and:

- Generates an `x-request-id` and forwards it to the request headers and response
- Sets baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- Skips static assets via the matcher

Add auth gating, rewrites, or redirects there as needed. Note: `runtime` config is not allowed in `proxy.ts`; it always runs on Node.js.

## Route Conventions Wired Up

| File | Purpose |
| ---- | ------- |
| `src/app/loading.tsx` | Root suspense fallback |
| `src/app/error.tsx` | Client error boundary (`unstable_retry`) |
| `src/app/not-found.tsx` | 404 page |
| `src/app/forbidden.tsx` | 403 page (calls `forbidden()`) |
| `src/app/unauthorized.tsx` | 401 page (calls `unauthorized()`) |
| `src/app/robots.ts` | `/robots.txt` |
| `src/app/sitemap.ts` | `/sitemap.xml` |
| `src/app/api/health/route.ts` | Liveness probe at `GET /api/health` |

`forbidden.tsx` and `unauthorized.tsx` require `experimental.authInterrupts: true`, already enabled in [`next.config.ts`](./next.config.ts).

## Codebase Structure

```bash
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── onboarding/
│   │   ├── signup/
│   │   ├── super-admin/
│   │   └── verify-email/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── super-admin/
│   ├── (external)/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── how-it-works/
│   │   └── pricing/
│   └── api/
│       └── proxy/      # Backend API proxy
├── components/         # React components
│   ├── auth/
│   ├── dashboard/
│   ├── external/
│   ├── onboarding/
│   ├── settings/
│   ├── super-admin/
│   └── ui/             # shadcn UI components
├── constants/          # Static UI data and backend contract placeholders
├── providers/          # App-level providers
├── services/           # API service layers
├── stores/             # Zustand state management
├── lib/                # Shared utilities and schemas
├── types/              # Shared TypeScript types
└── env/                # Environment variable schemas
```

## Auth Flow

How Google OAuth works in the app:

1. User clicks **"Continue with Google"**.
2. Frontend redirects to the backend Google OAuth endpoint.
3. Backend handles OAuth with Google.
4. Google redirects back to the backend callback.
5. Backend redirects to the frontend with the required auth state.
6. Frontend stores the access token and session metadata in the auth store.
7. Backend-owned refresh cookies keep the session alive and are forwarded through the API proxy.
8. Frontend redirects the user to `/dashboard` or the intended redirect path.

## Onboarding Steps

New users go through these steps after first login:

1. **Inverter Type Selection**: Select the type of inverter used, such as DEYE, MUST, LUXPOWER, or another supported brand.
2. **Inverter Connection**: Enter the connection details for the selected inverter type.
3. **Dashboard Access**: Once onboarding is complete, the backend onboarding status becomes the source of truth for dashboard access.
