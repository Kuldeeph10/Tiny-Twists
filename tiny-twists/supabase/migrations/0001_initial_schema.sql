-- 1. Create Tables
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null check (price >= 0),
  cost numeric(10,2) default 0,
  image_url text,
  stock integer not null default 0,
  made_to_order boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
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
  status text not null default 'new' check (status in ('new','making','ready','delivered','cancelled')),
  total numeric(10,2) not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid')),
  notes text,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
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

-- 2. Setup Security (Row Level Security)
alter table admins enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table materials enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table expenses enable row level security;

-- Create helper function for RLS
create or replace function is_admin() returns boolean as $$
  select exists(select 1 from admins where user_id = auth.uid());
$$ language sql security definer;

-- Public can read categories and active products
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read active products" on products for select using (is_active = true);

-- Admins can do everything
create policy "Admins can do everything on admins" on admins to authenticated using (is_admin());
create policy "Admins can do everything on categories" on categories to authenticated using (is_admin());
create policy "Admins can do everything on products" on products to authenticated using (is_admin());
create policy "Admins can do everything on materials" on materials to authenticated using (is_admin());
create policy "Admins can do everything on customers" on customers to authenticated using (is_admin());
create policy "Admins can do everything on orders" on orders to authenticated using (is_admin());
create policy "Admins can do everything on order_items" on order_items to authenticated using (is_admin());
create policy "Admins can do everything on expenses" on expenses to authenticated using (is_admin());

-- 3. Insert Sample Data
insert into categories (name) values 
  ('Flowers & Bouquets'),
  ('Keychains & Charms'),
  ('Cute Animals'),
  ('Custom Gifts');

-- Insert a sample product (getting the category id for Flowers & Bouquets)
insert into products (category_id, name, slug, description, price, cost, stock, made_to_order, is_active)
select id, 'Sunflower Pipe Cleaner Bouquet', 'sunflower-bouquet', 'A vibrant, handmade sunflower bouquet that never dies! Perfect for gifts.', 499.00, 150.00, 2, false, true
from categories where name = 'Flowers & Bouquets' limit 1;

insert into products (category_id, name, slug, description, price, cost, stock, made_to_order, is_active)
select id, 'Custom Initial Keychain', 'initial-keychain', 'A cute keychain with your custom initial made from fluffy pipe cleaners.', 149.00, 30.00, 0, true, true
from categories where name = 'Keychains & Charms' limit 1;
