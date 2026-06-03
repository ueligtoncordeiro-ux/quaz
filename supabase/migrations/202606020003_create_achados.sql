create table if not exists public.achados (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'outro',
  original_price numeric(10,2) not null,
  sale_price numeric(10,2) not null,
  quantity int not null default 1,
  quantity_reserved int not null default 0,
  pickup_start timestamptz not null,
  pickup_end timestamptz not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint achados_status_check
    check (status in ('active', 'sold_out', 'expired', 'cancelled')),
  constraint achados_price_check
    check (sale_price > 0 and original_price >= sale_price),
  constraint achados_quantity_check
    check (quantity > 0 and quantity_reserved >= 0 and quantity_reserved <= quantity),
  constraint achados_pickup_check
    check (pickup_end > pickup_start)
);

alter table public.achados enable row level security;

create policy "Service role can manage achados"
  on public.achados for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Public can read active achados"
  on public.achados for select
  using (status = 'active');

create trigger set_achados_updated_at
  before update on public.achados
  for each row execute function public.set_updated_at();

create index if not exists achados_store_id_idx on public.achados (store_id);
create index if not exists achados_status_pickup_idx on public.achados (status, pickup_end);
