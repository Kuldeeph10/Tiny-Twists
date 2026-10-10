# AGENTS.md — Pipe Cleaner Shop

This file tells the AI coding agent what we are building, which technology to use, and the rules to follow. Read it fully before writing any code. If a task conflicts with this file, stop and ask.

---

## 1. Project overview

We are building a **website and admin dashboard for a small pipe cleaner craft business** (handmade flowers, bouquets, keychains, animals, kids' kits, custom gifts).

There are two parts in one app:

1. **Public shop** — customers browse products and place orders.
2. **Admin dashboard** — the owner (one person) logs in and manages products, materials, orders, customers, and expenses.

**Current scope: pipe cleaner business ONLY.** Three other businesses (crochet, T-shirt printing, scrunchies) will be added later, each as its own tab. Do NOT build them now, but keep the code and database easy to extend (see section 9).

The owner is a beginner. Prefer simple, readable code over clever code. Explain what you built in plain language after each task.

---

## 2. Tech stack (fixed — do not change without asking)

| Layer | Technology |
|---|---|
| Frontend + server logic | **Next.js** (App Router) with **TypeScript** |
| Styling | **Tailwind CSS** |
| Database | **Supabase** (PostgreSQL) |
| Authentication | **Supabase Auth** (email + password, owner only) |
| File storage | **Supabase Storage** (product photos) |
| Hosting | **Vercel** |
| Payments | Not now. Later: Razorpay or UPI. Orders are "pay on delivery / confirm on WhatsApp" for v1. |

Rules:
- Do not add a separate backend server (no Express, Django, etc.). Use Next.js Server Actions and Route Handlers.
- Do not add a new library without telling the owner why it is needed.
- Use `@supabase/supabase-js` and `@supabase/ssr`.
- Package manager: `npm`.

---

## 3. Folder structure

```
/app
  /(shop)                 public pages
    page.tsx              home
    /products             product list + /[slug] detail
    /cart                 order / checkout form
  /admin                  protected dashboard
    /login
    /overview
    /products
    /materials
    /orders
    /customers
    /expenses
/components               reusable UI (Button, Card, Table, Modal, etc.)
/lib
  /supabase               client.ts, server.ts
  /validators             input validation (zod)
/supabase
  /migrations             SQL files, one per change
/types                    shared TypeScript types
```

---

## 4. Database design (Supabase / PostgreSQL)

All money is stored in **INR as integers in paise-free rupees** (`numeric(10,2)`). All tables have `id uuid primary key default gen_random_uuid()` and `created_at timestamptz default now()` unless noted.

### Tables

```sql
-- Owner accounts allowed into the dashboard
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,          -- Flowers, Keychains, Animals, Kits, Custom Gifts
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null check (price >= 0),
  cost numeric(10,2) default 0,        -- material cost, for profit reports
  image_url text,
  stock integer not null default 0,    -- ready-made items in hand
  made_to_order boolean default false,
  is_active boolean default true,      -- hidden from shop when false
  created_at timestamptz default now()
);

create table materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,                  -- e.g. "Red pipe cleaners", "Googly eyes"
  unit text not null default 'pcs',
  quantity_in_stock numeric(10,2) default 0,
  low_stock_level numeric(10,2) default 0,
  cost_per_unit numeric(10,2) default 0,
  created_at timestamptz default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  status text not null default 'new'
    check (status in ('new','making','ready','delivered','cancelled')),
  total numeric(10,2) not null default 0,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid')),
  notes text,                          -- colours, custom text, delivery details
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,          -- snapshot, in case the product changes later
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric(10,2) not null check (amount >= 0),
  spent_on date not null default current_date,
  notes text,
  created_at timestamptz default now()
);
```

### Security (Row Level Security — required)

- Turn on RLS for **every** table.
- Create a helper: `is_admin()` returns true if `auth.uid()` exists in `admins`.
- Public (not logged in) may only: **read** `categories` and `products where is_active = true`.
- Only admins may read or write everything else.
- Customers place orders through a **server-side action** that validates the input and writes `customers`, `orders`, and `order_items`. Never let the browser insert directly into these tables.
- The Supabase **service role key** is used only on the server. Never expose it to the browser or commit it to git.

---

## 5. Pages and features

### Public shop (v1)
- Home: short intro, featured products, categories.
- Products page with category filter and search.
- Product detail page.
- Cart and order form: name, phone, address, notes. After submitting, show a confirmation and a button to message the owner on WhatsApp with the order summary.

### Admin dashboard (v1)
- Login page. All `/admin` routes (except login) require a logged-in admin. Check this in middleware **and** on the server for each action.
- **Overview:** orders today, new orders waiting, income this month, low-stock materials.
- **Products:** list, add, edit, hide, upload photo.
- **Materials:** list, add, edit, update stock; highlight low stock.
- **Orders:** list with status filter, order detail, change status, mark paid.
- **Customers:** list with order history.
- **Expenses:** add and list expenses; simple monthly profit view (income minus expenses).

Not in v1: online payments, reviews, discount codes, multi-user roles.

---

## 6. Design and theme

Warm, playful, handmade feel.

- Background cream `#FFF8F3`; text dark brown `#3B2A2A`.
- Brand colour sunny yellow `#F6C445`; accent soft green `#7CC49A`; highlight berry pink `#D9577B`.
- Headings: **Fraunces** (or Playfair Display). Body: **Nunito** or **Inter**. Load with `next/font`.
- Rounded corners (`rounded-xl`), soft shadows, generous spacing.
- Product photos are the hero: large, bright, square or 4:5.
- Dashboard supports **dark mode**. Define colours as CSS variables or Tailwind theme tokens, not hard-coded values scattered around.

---

## 7. Responsiveness rules

- **Mobile first.** Most customers arrive from a phone (Instagram/WhatsApp). Write the phone layout first, then add `sm:`, `md:`, `lg:` styles.
- Use CSS Grid or Flexbox; avoid fixed pixel widths.
- Tap targets at least **44px** high.
- Product grid: 2 columns on phones, 3 on tablets, 4 on desktop.
- Dashboard: sidebar on desktop, **bottom tab bar or hamburger menu** on mobile.
- Tables must scroll horizontally inside their own container on small screens (`overflow-x-auto`), or switch to card layout.
- Use `next/image` with proper `sizes` so photos load fast on slow connections.
- Never allow the whole page to scroll sideways.

---

## 8. Coding rules

- TypeScript strict mode. No `any` unless unavoidable (and comment why).
- Validate all form input on the server with **zod**.
- Handle loading, empty, and error states on every page and form. Show friendly messages.
- Keep components small and reusable. Do not duplicate code across pages.
- Use Server Components by default; add `"use client"` only when needed.
- Database changes go in `/supabase/migrations` as new SQL files. Never edit an applied migration.
- Secrets live in `.env.local` (never committed). Provide a `.env.example` with these names only:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Accessibility basics: labels on inputs, alt text on images, good colour contrast.
- Currency display: `₹` with Indian number format.

---

## 9. Future expansion (do not build yet)

Later we will add **Crochet**, **T-shirt Printing**, and **Scrunchies**, each as its own tab in the dashboard. To prepare:

- Keep business-specific logic in separate folders/components so a new tab can be added without rewriting existing ones.
- When that time comes, add a `business` column (e.g. `'pipe_cleaner'`) to `categories` and `expenses`, and filter by it. Do not add this column now unless the owner asks.

---

## 10. How to work with the owner

1. Before starting, restate the task in one or two sentences and list the files you will change.
2. Build in small steps, in this order:
   1. Set up Next.js, Tailwind, Supabase connection, theme tokens.
   2. Database migrations + RLS policies + seed sample categories and products.
   3. Admin login and protected layout (responsive shell with navigation).
   4. Admin: Products, then Materials, Orders, Customers, Expenses, Overview.
   5. Public shop: home, products, product detail, order form.
   6. Polish: mobile testing, loading and error states, SEO basics, deploy to Vercel.
3. After each step, tell the owner how to run and test it (exact commands, what to click).
4. Ask before: changing the tech stack, adding paid services, deleting data, or changing the database design.
5. Never invent business data (prices, phone numbers, addresses). Use clearly marked placeholders and tell the owner to replace them.

---

## 11. Definition of done (for each feature)

- Works on a phone-sized screen and a desktop screen.
- Handles empty, loading, and error cases.
- Protected by login and RLS where it touches private data.
- No TypeScript errors; `npm run build` passes.
- The owner has been told how to test it.
