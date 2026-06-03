create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  achado_id uuid not null references public.achados(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  phone text not null,
  code text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reservations_status_check
    check (status in ('pending', 'confirmed', 'cancelled', 'no_show')),
  constraint reservations_code_length
    check (char_length(code) = 6)
);

alter table public.reservations enable row level security;

create policy "Service role can manage reservations"
  on public.reservations for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create trigger set_reservations_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

create index if not exists reservations_achado_id_idx on public.reservations (achado_id);
create index if not exists reservations_store_id_idx on public.reservations (store_id);
create index if not exists reservations_code_idx on public.reservations (code);
create index if not exists reservations_status_idx on public.reservations (status, created_at desc);
