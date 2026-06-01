-- idempotent: cria o enum apenas se ainda nao existir
do $$
begin
  if not exists (
    select 1 from pg_type
    where typname = 'lead_kind'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.lead_kind as enum ('consumer', 'partner');
  end if;
end $$;

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  kind public.lead_kind not null,
  email text,
  contact text,
  business_name text,
  source text not null default 'web',
  status text not null default 'new',
  user_agent text,
  created_at timestamptz not null default now(),
  constraint lead_submissions_contact_required check (
    (kind = 'consumer' and email is not null)
    or
    (kind = 'partner' and contact is not null and business_name is not null)
  )
);

alter table public.lead_submissions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'lead_submissions'
      and policyname = 'Service role can manage lead submissions'
  ) then
    execute $policy$
      create policy "Service role can manage lead submissions"
        on public.lead_submissions
        for all
        using (auth.role() = 'service_role')
        with check (auth.role() = 'service_role')
    $policy$;
  end if;
end $$;

create index if not exists lead_submissions_kind_created_at_idx
  on public.lead_submissions (kind, created_at desc);
