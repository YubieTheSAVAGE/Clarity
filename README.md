# Clarity - Personal Expense Tracking App

A personal expense tracking app that helps you understand your finances better.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** (running locally or remote)
- npm

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, and PORT
npm install
npm run db:migrate   # Run Prisma migrations (requires PostgreSQL)
npm run dev          # Start dev server on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # Start dev server on http://localhost:5173
```

### Environment Variables

Configure these in `backend/.env`:

| Variable       | Description                         |
|----------------|-------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string        |
| `JWT_SECRET`   | Secret key for signing JWT tokens   |
| `PORT`         | Backend port (default: 3001)        |

Example `DATABASE_URL`:
```
postgresql://user:password@localhost:5432/clarity
```

Ensure PostgreSQL is running and a database named `clarity` exists (or adjust the connection string).

## Prisma 7 Note

This project uses **Prisma 7** with a config file. The datasource URL is defined in `prisma.config.ts`, not in the schema file:

```ts
// backend/prisma.config.ts
datasource: {
  url: env("DATABASE_URL"),
},
```

The `schema.prisma` datasource block uses `provider = "postgresql"` only; the URL comes from the config.

## Key Features

- **Auth** – Register and login with email/password (JWT)
- **Dashboard** – Summary cards (income, expense, net) and expense breakdown by category with progress bars
- **Transactions** – Full CRUD with type/category/date filters, query-param persistence
- **Responsive UI** – Desktop sidebar + mobile bottom nav, centered auth card
- **Currency** – MAD (Moroccan Dirham) throughout

## API Routes

| Method | Route                      | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/api/health`              | Health check                         |
| POST   | `/api/auth/register`      | Register `{email, password}`         |
| POST   | `/api/auth/login`         | Login `{email, password}`            |
| GET    | `/api/transactions`       | List transactions (auth). Query: `type`, `category`, `startDate`, `endDate` |
| POST   | `/api/transactions`       | Create transaction (auth)             |
| PUT    | `/api/transactions/:id`   | Update transaction (auth)            |
| DELETE | `/api/transactions/:id`   | Delete transaction (auth)            |
| GET    | `/api/dashboard/summary`  | Dashboard summary (auth). Query: `startDate`, `endDate` |

## UI Library

The frontend uses **[React Bits](https://reactbits.dev)** for animated UI components (TS-CSS variants). Components live in:

```
frontend/src/reactbits/
├── Aurora.tsx       # Animated background (auth pages)
├── BlurText.tsx     # Animated text (auth heading)
├── AnimatedCard.tsx # Card entrance + hover
├── EmptyState.tsx   # Empty state animations
├── LoadingSpinner.tsx
├── reactbits.css
└── index.ts
```

## Deployment (all on Vercel + Supabase)

**Database:** Use Supabase PostgreSQL. In Supabase Dashboard → Settings → Database, copy the connection string (use the **Connection pooling** URI for serverless).

**All-in-one Vercel deployment:**
1. Import repo in Vercel – **Root Directory must be `./`** (repo root).
2. Add env vars in Vercel:
   - `DATABASE_URL` = Supabase connection string
   - `JWT_SECRET` = strong random secret
3. Deploy – Vercel detects the Express app at `index.ts`, builds frontend + backend, runs migrations, and serves both from one project.

The API lives at `/api/*` on the same domain as the frontend, so no `VITE_API_URL` is needed.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Auth:** JWT + bcrypt
