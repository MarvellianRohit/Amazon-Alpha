-- Create Carts table
create table carts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Cart Items table
create table cart_items (
  id uuid default gen_random_uuid() primary key,
  cart_id uuid references carts(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1 check (quantity > 0),
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(cart_id, product_id)
);

-- Enable RLS
alter table carts enable row level security;
alter table cart_items enable row level security;

-- Policies for Carts
create policy "Users can view their own cart."
  on carts for select
  using ( auth.uid() = user_id );

create policy "Users can create their own cart."
  on carts for insert
  with check ( auth.uid() = user_id );

-- Policies for Cart Items
-- We need to check if the cart belongs to the user.
-- Subqueries in RLS can be expensive but are standard for this relationship.

create policy "Users can view their own cart items."
  on cart_items for select
  using ( 
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can insert into their own cart."
  on cart_items for insert
  with check (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can update their own cart items."
  on cart_items for update
  using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can delete their own cart items."
  on cart_items for delete
  using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

-- Auto-create cart on signup? Or create on first add?
-- Let's create on first add via API for now to keep it simple, or via trigger.
-- Trigger is robust:
create function public.handle_new_user_cart()
returns trigger as $$
begin
  insert into public.carts (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_cart
  after insert on auth.users
  for each row execute procedure public.handle_new_user_cart();
