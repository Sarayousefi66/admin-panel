# Admin Panel — Personal Portfolio Project

A production-style administration dashboard built to demonstrate frontend architecture, authentication, role-based access control, data management workflows, and internationalized user interfaces.

**Live demo:** https://admin-panel-portfolio-ui.vercel.app/
**Source code:** https://github.com/Sarayousefi66/admin-panel

> This is an independent portfolio project. Its backend is a mock REST API powered by JSON Server and Next.js Route Handlers; it is not a production business backend.

## Demo Account

The project includes a public demonstration administrator account:

| Field | Value |
|---|---|
| Username | `admin.demo` |
| Email | `demo.admin@example.com` |
| Password | `Demo@Admin#2026` |
| Role | Administrator |

The seeded Administrator account has 15 permissions covering the dashboard, products, users, and roles. Use this account only for exploring the demo. Do not enter real personal or confidential information. Demo data may be reset.

## Features

### Authentication and account security

- Login and logout flows
- Protected application routes and authenticated API handlers
- Session-aware authentication
- Password credential storage using password hashing
- Forced credential-change support

### Dashboard

- Summary statistics
- Data visualizations and charts

### User management

- View, search, sort, and paginate users
- Create, edit, and delete users
- Manage user status
- View user profiles
- Assign and revoke user roles

### Role and access management

- Create, view, update, and delete roles
- Assign and revoke permissions for roles
- View user roles and available roles
- Permission-aware navigation and actions

### Product management

- View, search, sort, and paginate products
- Create, edit, and delete products
- Product image handling

### User experience

- English and Persian interfaces
- Left-to-right and right-to-left layouts
- Responsive dashboard interface
- Form validation with React Hook Form and Zod
- Loading, error, and empty states
- Toast notifications
- URL-based list state for supported filters and pagination

## Technology Stack

| Area | Technologies |
|---|---|
| Framework | Next.js 16.4.6, App Router |
| UI | React 19, TypeScript |
| Styling and components | Tailwind CSS 4, shadcn/ui, Radix UI |
| Server state and data fetching | TanStack Query, Axios |
| Client state | Zustand |
| Forms and validation | React Hook Form, Zod, `@hookform/resolvers` |
| Tables and charts | TanStack Table, Recharts |
| Internationalization | next-intl |
| Notifications and icons | Sonner, Lucide React |
| Mock backend | JSON Server, Next.js Route Handlers |
| Package manager | pnpm |

## Architecture

The application uses a feature-based structure. Feature-specific APIs, hooks, components, schemas, and types are kept close to the use cases that consume them. Cross-feature infrastructure and reusable UI live in shared modules.

```text
src/
├── app/
│   ├── [locale]/             # Locale-aware App Router pages and layouts
│   └── api/                  # Next.js Route Handlers
├── components/               # Reusable UI primitives
├── features/
│   ├── access-control/       # Assign/revoke roles and view role assignments
│   ├── auth/                 # Authentication and session workflows
│   ├── dashboard/            # Dashboard data and visualizations
│   ├── products/             # Product CRUD use cases
│   ├── profile/              # Current-user profile
│   ├── roles/                 # Role and permission management
│   └── users/                 # User management workflows
├── i18n/                     # next-intl routing and request configuration
├── lib/                      # Shared application utilities
├── messages/                 # English and Persian translation messages
├── providers/                # Application-level providers
├── services/                 # Shared services
├── shared/                   # Shared components, hooks, libraries and types
└── store/                    # Client-side application stores

mock-api/
└── db.json                   # JSON Server seed and demo data
```

### API and data flow

The browser communicates with the application's `/api` endpoints. Next.js Route Handlers apply server-side authentication and authorization checks, then communicate with the JSON Server through a shared mock API client.

```text
Browser
   │
   ▼
Next.js UI and feature hooks
   │
   ▼
Next.js Route Handlers (/api/*)
   │  authentication / authorization
   ▼
Mock API client
   │
   ▼
JSON Server (mock-api/db.json)
```

This keeps the frontend's API integration workflow close to a typical application with a separate backend while allowing the project to run with a lightweight mock data service.

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- pnpm

### 1. Clone the repository

```bash
git clone https://github.com/Sarayousefi66/admin-panel.git
cd admin-panel
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure the mock API URL

Create a `.env.local` file in the project root:

```env
MOCK_API_URL=http://localhost:4000
```

The `MOCK_API_URL` variable is read by the server-side mock API client. Do not commit private tokens or credentials in environment files.

### 4. Start JSON Server

Open a terminal and run:

```bash
pnpm dev:api
```

JSON Server starts at `http://localhost:4000` and reads its data from `mock-api/db.json`.

### 5. Start the Next.js application

Open a second terminal and run:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm dev:api` | Start the local JSON Server |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

## Production Deployment

The demo is deployed using:

- **Frontend:** Vercel — https://admin-panel-portfolio-ui.vercel.app/
- **Mock API:** Render — https://dashboard-ui-mock-api.onrender.com

For the deployed frontend, configure the `MOCK_API_URL` environment variable in Vercel to point to the Render service URL:

```env
MOCK_API_URL=https://dashboard-ui-mock-api.onrender.com
```

The Render service runs JSON Server using the repository's `mock-api/db.json` data file. The frontend and mock API are separate services.

## Notes About the Demo Backend

- JSON Server is used as a lightweight mock backend for portfolio demonstration.
- Next.js Route Handlers provide the application's API layer and perform the implemented authentication and permission checks.
- The mock database is seeded with demonstration data; it should not be used for real user accounts or sensitive information.
- The demo account has administrator permissions for exploring the implemented features. Public demo credentials are not intended to protect sensitive data.

## License

This repository is a personal portfolio project. No open-source license is granted unless a license file is added to the repository.

## Author

**Sara Yousefi** — Senior Frontend Developer
GitHub: https://github.com/Sarayousefi66
LinkedIn: https://linkedin.com/in/sara-youseffi
