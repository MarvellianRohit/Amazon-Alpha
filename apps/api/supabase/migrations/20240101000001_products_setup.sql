create table products (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  images text[] default '{}',
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table products enable row level security;

-- Policies

-- 1. Everyone can view products
create policy "Products are viewable by everyone."
  on products for select
  using ( true );

-- 2. Vendors can insert their own products
create policy "Vendors can insert their own products."
  on products for insert
  with check ( auth.uid() = vendor_id );

-- 3. Vendors can update their own products
create policy "Vendors can update their own products."
  on products for update
  using ( auth.uid() = vendor_id );

-- 4. Vendors can delete their own products
create policy "Vendors can delete their own products."
  on products for delete
  using ( auth.uid() = vendor_id );
