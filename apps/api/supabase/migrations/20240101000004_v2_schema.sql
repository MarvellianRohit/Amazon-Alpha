-- Create Categories Table
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Categories (Public Read, Admin Write)
alter table categories enable row level security;

create policy "Enable read access for all users"
on categories for select
using (true);

-- Populate initial categories
insert into categories (name, slug) values
('Electronics', 'electronics'),
('Clothing', 'clothing'),
('Books', 'books'),
('Home & Garden', 'home-garden');

-- Alter Products Table
alter table products add column category_id uuid references categories(id) on delete set null;

-- (Optional) Backfill category_id based on old category string?
-- This handles legacy data if strings match slugs/names.
update products 
set category_id = categories.id
from categories 
where lower(products.category) = lower(categories.name);

-- If we want to drop the old column later we can, but let's keep it for safety in V2 transition.
