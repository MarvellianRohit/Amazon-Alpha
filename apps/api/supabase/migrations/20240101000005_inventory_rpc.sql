-- Create a function for atomic inventory updates
create or replace function update_inventory(p_id uuid, p_quantity_change int)
returns int
language plpgsql
security definer
as $$
declare
  current_stock int;
  new_stock int;
begin
  -- Lock the row for update
  select stock into current_stock
  from products
  where id = p_id
  for update;

  if not found then
    raise exception 'Product not found';
  end if;

  new_stock := current_stock + p_quantity_change;

  if new_stock < 0 then
    raise exception 'Insufficient stock';
  end if;

  update products
  set stock = new_stock
  where id = p_id;

  return new_stock;
end;
$$;
