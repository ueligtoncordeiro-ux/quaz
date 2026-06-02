alter table public.lead_submissions
  add column if not exists city text,
  add column if not exists phone text,
  add column if not exists notes text,
  add column if not exists handled_by text,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_submissions_updated_at on public.lead_submissions;

create trigger set_lead_submissions_updated_at
  before update on public.lead_submissions
  for each row
  execute function public.set_updated_at();

create index if not exists lead_submissions_status_created_at_idx
  on public.lead_submissions (status, created_at desc);

create index if not exists lead_submissions_city_created_at_idx
  on public.lead_submissions (city, created_at desc);
