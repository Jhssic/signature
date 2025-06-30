# Signature Application

This project contains a Next.js frontend and an Express backend for a digital signature application.

## Prerequisites

- **Node.js 18** or newer with **npm**.
- A local or remote **MongoDB** server accessible to the application.

## Installation

Install the dependencies using npm (or your preferred package manager):

```bash
npm install
```

After the dependencies are installed, generate the Prisma client and apply the
schema to your database:

```bash
npx prisma generate
npx prisma db push
```

## Environment variables

Copy `.env.example` to `.env` and adjust the values if necessary:

```bash
cp .env.example .env
```

The available variables are documented in `.env.example`.
Prisma uses `DATABASE_URL` to connect to your MongoDB instance. You can reuse the
same value as `MONGODB_URI`.

## Seeding the database

After configuring the environment variables, you can populate the database with sample data:

```bash
node scripts/seed.js
```

If you prefer using Prisma to inspect the database, run:

```bash
npx prisma studio
```

This connects to the database defined by `MONGODB_URI` and inserts example users and reports.

## Running the application

### Backend

Start the Express server:

```bash
node server.js
```

### Frontend

In another terminal, start the Next.js development server:

```bash
npm run dev
```

The `FRONTEND_URL` variable should match the address printed by the frontend server (default is `http://localhost:3000`).

For a production build, run:

```bash
npm run build
npm run start
```

This serves the compiled frontend while the backend continues to run with `node server.js`.

