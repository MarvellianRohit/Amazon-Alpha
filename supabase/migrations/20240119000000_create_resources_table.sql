-- Create resources table
create table resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  content text not null,
  language text default 'c',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add simple RLS policies (optional but good practice)
alter table resources enable row level security;

create policy "Enable read access for all users"
on resources for select using (true);

create policy "Enable insert for authenticated users only"
on resources for insert with check (auth.role() = 'authenticated');
