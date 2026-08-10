# UniGuide

University recommendation system for Myanmar (Burmese) students. Students record their Grade 12 marks, budget, preferred city, majors, and hobbies — UniGuide matches them to universities, shows subject requirements and scholarships, and lets them save favorites and write reviews.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Prisma](https://prisma.io) + PostgreSQL
- [NextAuth](https://next-auth.js.org) v5 (credentials + optional Google) with JWT strategy
- [Tailwind CSS](https://tailwindcss.com) + shadcn/ui (Base UI)
- [react-hook-form](https://react-hook-form.com) + Zod
- [react-leaflet](https://react-leaflet.js.org) for university maps
- TypeScript strictly typed end-to-end

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/uniguide` |
| `AUTH_SECRET` | Secret for signing NextAuth JWTs. Generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Set to `true` when running on a non-Vercel host |
| `GOOGLE_CLIENT_ID` | Optional — enables Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Optional — enables Google sign-in |

### 3. Create the database and run migrations

```bash
npx prisma db push
```

Seed subjects, majors, hobbies, universities, scholarships, and an admin account ([seed details](#admin-account)):

```bash
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roles

- **Student** — onboarding (budget, city, marks, majors, hobbies), recommendations, favorites, reviews, university detail pages, account settings.
- **Admin** — manage universities, subjects, majors, hobbies, reviews, and account settings. Admin-only routes live under `/admin`; the admin seed account is `admin@uniguide.dev` / `admin123` — change it in production.

## Common Tasks

| Task | Command |
| --- | --- |
| Run dev server | `npm run dev` |
| Run lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |
| Production build | `npm run build` |
| Regenerate Prisma client | `npx prisma generate` |
| Push schema to DB | `npx prisma db push` |
| Run seed | `npx prisma db seed` |

## Project Structure

```
app/
  (auth)/          # login / register
  (dashboard)/     # logged-in area: dashboard, onboarding, recommendations,
                   # favorites, settings, admin/* (universities, subjects,
                   # majors, hobbies, reviews, settings)
  universities/    # public university detail pages
  actions/         # server actions (auth, user, admin, recommendation)
  api/auth/        # NextAuth route handler
auth.ts            # NextAuth config (providers, callbacks)
proxy.ts           # middleware: route protection for user/admin pages
prisma/            # schema.prisma + seed.ts
components/        # UI primitives (shadcn) + feature components
```

## Notes

- Recently the `User.role` field was changed from a string to a Prisma `Role` enum (`STUDENT` / `ADMIN`). If your database still uses the old text column, run `npx prisma db push` (it will prompt for data-loss confirmation) and reseed.
- A university uses **either** an overall average requirement **or** subject minimum marks — never both.