create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.lead_submissions(id) on delete set null,
  slug text not null unique,
  name text not null,
  type text not null default '',
  city text not null default '',
  address text,
  phone text,
  email text,
  hours text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint stores_status_check check (status in ('pending', 'active', 'inactive'))
);

alter table public.stores enable row level security;

create policy "Service role can manage stores"
  on public.stores for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create trigger set_stores_updated_at
  before update on public.stores
  for each row execute function public.set_updated_at();

create index if not exists stores_status_city_idx on public.stores (status, city);
create index if not exists stores_slug_idx on public.stores (slug);
