# Clarity - Personal Expense Tracking App

A personal expense tracking app that helps you understand your finances better.

## Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm run db:migrate   # Run migrations (requires PostgreSQL)
npm run dev          # Start dev server on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm run dev          # Start dev server on http://localhost:5173
```

### 3. Database

Ensure PostgreSQL is running. Create a database named `clarity` (or update `DATABASE_URL` in `.env`).

Example `DATABASE_URL`:
```
postgresql://user:password@localhost:5432/clarity
```

## Project Structure

```
Clarity/
├── frontend/       # React + Vite app
├── backend/        # Express API (includes prisma/)
└── README.md
```

## API

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register `{email, password}`
- `POST /api/auth/login` - Login `{email, password}`
- `GET /api/transactions` - List transactions (query: type, category, startDate, endDate). Requires `Authorization: Bearer <token>`
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/dashboard/summary` - Dashboard summary (query: startDate, endDate). Requires auth
