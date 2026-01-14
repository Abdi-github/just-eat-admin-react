# Just Eat Admin Dashboard

Admin dashboard for the **just-eat.ch** Swiss food delivery platform.  
Built with React, TypeScript, and Bootstrap 5 — exclusively for platform administrators.

## Overview

| Item          | Details                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| **Purpose**   | Manage restaurants, orders, users, reviews, promotions, deliveries, payments, and platform analytics |
| **Users**     | `super_admin`, `platform_admin`, `support_agent` only                                                |
| **Languages** | German (default), English, French, Italian                                                           |
| **API**       | Consumes 60+ admin endpoints from `just-eat-api-node`                                                 |
| **Currency**  | CHF (Swiss Francs)                                                                                   |

## Tech Stack

| Area       | Technology                     |
| ---------- | ------------------------------ |
| Framework  | React 18 + TypeScript (strict) |
| Build      | Vite 5                         |
| UI         | Bootstrap 5 + React-Bootstrap  |
| State      | Redux Toolkit + RTK Query      |
| Forms      | React Hook Form + Zod          |
| i18n       | react-i18next (DE, EN, FR, IT) |
| Charts     | Recharts                       |
| Icons      | Bootstrap Icons                |
| Date/Time  | dayjs                          |
| Containers | Docker + Nginx                 |

## Features

| Module            | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Auth**          | JWT login/logout, auto token refresh, admin-only role gate                  |
| **Dashboard**     | Stats cards, order/revenue charts, recent activity                          |
| **Restaurants**   | Approval workflow (draft → pending → approved → published), suspend/archive |
| **Orders**        | Monitoring, status tracking, detailed order views with timeline             |
| **Users**         | CRUD, role assignment, activate/deactivate                                  |
| **Reviews**       | Moderation queue — approve, reject, flag                                    |
| **Cuisines**      | CRUD with 4-language names (DE/EN/FR/IT)                                    |
| **Brands**        | CRUD with logo upload/delete                                                |
| **Locations**     | Canton + City management with 4-language support                            |
| **Payments**      | Transaction viewer, refund processing                                       |
| **Deliveries**    | Assignment list, courier assignment, status management                      |
| **Promotions**    | Coupon CRUD + Stamp card CRUD                                               |
| **Analytics**     | Platform dashboard, revenue reports, user growth charts                     |
| **Notifications** | Send notifications to users/groups                                          |
| **Settings**      | Language, theme, system preferences                                         |
| **Applications**  | Review owner/courier applications, approve/reject workflow                  |

## Architecture

```
src/
├── app/                    # Store, router, hooks, providers
├── features/               # Feature modules (self-contained)
│   ├── auth/               #   Login, logout, token management
│   ├── dashboard/          #   Stats, charts, recent activity
│   ├── restaurants/        #   Approval workflow, details
│   ├── orders/             #   Monitoring, status tracking
│   ├── users/              #   User CRUD, roles
│   ├── reviews/            #   Moderation queue
│   ├── cuisines/           #   Cuisine CRUD (4-lang)
│   ├── brands/             #   Brand CRUD + logo
│   ├── locations/          #   Cantons + cities
│   ├── payments/           #   Transactions, refunds
│   ├── deliveries/         #   Courier assignments
│   ├── promotions/         #   Coupons + stamp cards
│   ├── analytics/          #   Reports, charts
│   ├── notifications/      #   Send notifications
│   ├── settings/           #   Preferences
│   └── applications/       #   Owner/courier application review
├── shared/                 # Shared utilities, components, state
│   ├── api/baseApi.ts      #   RTK Query base (auth headers, Accept-Language)
│   ├── components/         #   DataTable, StatusBadge, ErrorBoundary, etc.
│   ├── hooks/              #   usePermissions, useApiError, useAuth
│   ├── state/              #   auth.slice, language.slice, ui.slice
│   ├── types/              #   API envelope types, common types
│   └── utils/              #   Formatters (CHF), validators, constants
├── layouts/                # AdminLayout (sidebar+header+footer), AuthLayout
├── routes/                 # Route definitions, ProtectedRoute, PermissionRoute
├── i18n/                   # i18n config + 16 namespaces × 4 languages (64 files)
└── styles/                 # Bootstrap SCSS overrides
```

### Key Principles

- **Feature-based architecture** — each module is self-contained
- **RTK Query for all API data** — no Axios, no manual caching
- **Permission-based UI** — routes and actions gated by user permissions
- **Lazy loading** — all pages loaded via `React.lazy()` with Suspense
- **Error boundaries** — graceful failure at route and app level
- **i18n everywhere** — zero hardcoded UI strings

## Quick Start

### Prerequisites

- Docker & Docker Compose
- The API running: `cd ../just-eat-api-node && docker compose up -d`

### Development (Docker)

```bash
# Start the admin panel (connects to API network)
docker compose up -d

# Open in browser
open http://localhost:5175
```

### Development (Local)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
open http://localhost:5175
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Or build Docker production image
docker build -t justeat-admin .
docker run -p 8081:8081 justeat-admin
```

## Environment Variables

| Variable                | Dev Default                    | Description           |
| ----------------------- | ------------------------------ | --------------------- |
| `VITE_API_URL`          | `http://localhost:4005/api/v1` | API base URL          |
| `VITE_APP_NAME`         | `Just Eat Admin`               | Application name      |
| `VITE_APP_VERSION`      | `1.0.0`                        | Application version   |
| `VITE_DEFAULT_LANGUAGE` | `de`                           | Default UI language   |
| `VITE_ENABLE_DEVTOOLS`  | `true`                         | Enable Redux DevTools |

## Test Accounts

**Admin accounts (dashboard access):**

| Role           | Email                     | Password       |
| -------------- | ------------------------- | -------------- |
| Super Admin    | `admin@justeat-clone.ch`  | `Password123!` |
| Platform Admin | `admin2@justeat-clone.ch` | `Password123!` |

**Non-admin accounts (rejected at login):**

| Role             | Email                        | Password       |
| ---------------- | ---------------------------- | -------------- |
| Restaurant Owner | `owner.bigburger@example.ch` | `Password123!` |
| Customer         | `customer1@example.ch`       | `Password123!` |
| Courier          | `courier1@justeat-clone.ch`  | `Password123!` |

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start dev server (port 5175) |
| `npm run build`      | Production build to `dist/`  |
| `npm run preview`    | Preview production build     |
| `npm run lint`       | Run ESLint                   |
| `npm run test`       | Run Vitest                   |
| `npm run type-check` | TypeScript type checking     |

## Docker Ports

| Service         | Dev   | Prod | Description   |
| --------------- | ----- | ---- | ------------- |
| Admin Panel     | 5175  | 8081 | This project  |
| API             | 4005  | 4005 | REST API      |
| MongoDB         | 27022 | —    | Database      |
| Mongo Express   | 8086  | —    | DB UI         |
| Redis           | 6383  | —    | Cache         |
| Redis Commander | 8087  | —    | Redis UI      |
| Mailpit         | 8025  | —    | Email testing |

## Bundle Analysis

The production build uses manual chunk splitting:

| Chunk     | Contents                       | Gzip Size     |
| --------- | ------------------------------ | ------------- |
| vendor    | React, React DOM, React Router | ~68 KB        |
| redux     | Redux Toolkit, RTK Query       | ~13 KB        |
| ui        | React-Bootstrap, Bootstrap     | ~30 KB        |
| charts    | Recharts                       | ~111 KB       |
| i18n      | i18next, react-i18next         | ~16 KB        |
| Per-route | Lazy-loaded page chunks        | 0.5–6 KB each |

## License

Private — Internal use only.
