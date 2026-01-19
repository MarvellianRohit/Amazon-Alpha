-- Create Orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Order Items table (Snapshot of what was bought)
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null, -- Keep item even if product deleted? Or set null
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(10, 2) not null, -- Critical for history
  added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies
create policy "Users can view their own orders."
  on orders for select
  using ( auth.uid() = user_id );

-- Ideally backend creates orders with service role or user needs insert policy.
-- We will use service role / backend logic largely, but let's allow user insert for now if we use user token in backend.
create policy "Users can insert their own orders."
  on orders for insert
  with check ( auth.uid() = user_id );


create policy "Users can view their own order items."
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
  
create policy "Users can insert their own order items."
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
