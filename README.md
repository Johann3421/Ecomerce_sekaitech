# LumiStore — Premium E-Commerce

Full-stack e-commerce application built with **Next.js 16**, **Tailwind CSS v4**, **Prisma**, **NextAuth v5**, **Zustand**, and **React Three Fiber**.

## Tech Stack

| Layer       | Technology                                         |
| ----------- | -------------------------------------------------- |
| Framework   | Next.js 16 (App Router)                            |
| Styling     | Tailwind CSS v4 (CSS-based theme)                  |
| Database    | PostgreSQL + Prisma ORM 7                          |
| Auth        | NextAuth v5 (JWT, Credentials + Google)            |
| State       | Zustand (cart with localStorage persistence)       |
| 3D          | React Three Fiber + Drei + Postprocessing          |
| Forms       | React Hook Form + Zod                              |
| Charts      | Recharts                                           |
| Icons       | Lucide React                                       |

## Features

### Public Store
- **Home** — 3D hero scene, featured products, category grid
- **Products Catalog** — Filters (category, price, color, size), sort, pagination
- **Product Detail (PDP)** — Image gallery, 3D viewer, variant selection, reviews, JSON-LD SEO
- **Categories** — Dynamic pages per category with filtered listings
- **Cart** — Full cart page with quantity controls, free shipping tracker
- **Checkout** — Multi-step (shipping → payment → review) with form validation
- **Auth** — Login with credentials or Google, registration with validation
- **Account** — Order history, profile info, addresses

### Admin Panel (`/admin`)
- **Dashboard** — KPIs (revenue, orders, users, products), recent orders, low stock alerts
- **Products CRUD** — Full list with stock/rating/sales, create & edit forms
- **Orders** — Order management table with status badges
- **Users** — User list with roles, order/review counts

### SEO
- Dynamic sitemap (`/sitemap.xml`)
- Robots.txt
- JSON-LD structured data on product pages
- OpenGraph metadata

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- (Optional) Google OAuth credentials

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random secret for JWT
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Optional, for Google auth

### 3. Set Up Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This creates all tables and seeds with:
- 1 admin user: `admin@lumistore.com` / `Admin123!`
- 5 customer accounts
- 4 categories, 20 products with images/variants
- Sample reviews and orders

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and login with `admin@lumistore.com` / `Admin123!`.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (store)/         # Public store pages
│   │   ├── account/     # User account
│   │   ├── cart/        # Cart page
│   │   ├── category/    # Category pages
│   │   ├── checkout/    # Checkout flow
│   │   └── products/    # Catalog & PDP
│   ├── admin/           # Admin panel
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   └── api/             # API routes
├── components/
│   ├── admin/           # Admin components
│   ├── store/           # Store components
│   ├── three/           # 3D components
│   └── ui/              # Reusable UI primitives
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, auth, prisma, validations
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## Scripts

| Command           | Description           |
| ----------------- | --------------------- |
| `npm run dev`     | Start dev server      |
| `npm run build`   | Production build      |
| `npm run start`   | Start production      |
| `npm run lint`    | ESLint                |

## License

MIT
