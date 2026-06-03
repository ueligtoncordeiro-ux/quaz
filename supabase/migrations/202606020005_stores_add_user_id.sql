-- Vincula loja a um usuário do Supabase Auth (magic link)
alter table public.stores
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists stores_user_id_idx on public.stores (user_id);

-- Política: parceiro autenticado pode ler sua própria loja
create policy "Partner can read own store"
  on public.stores for select
  using (auth.uid() = user_id);

-- Política: parceiro autenticado pode atualizar sua própria loja
create policy "Partner can update own store"
  on public.stores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Política: parceiro pode ler seus próprios achados
create policy "Partner can read own achados"
  on public.achados for select
  using (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  );

-- Política: parceiro pode criar achados para sua loja
create policy "Partner can insert own achados"
  on public.achados for insert
  with check (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  );

-- Política: parceiro pode atualizar achados da sua loja
create policy "Partner can update own achados"
  on public.achados for update
  using (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  )
  with check (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  );

-- Política: parceiro pode ler reservas da sua loja
create policy "Partner can read own reservations"
  on public.reservations for select
  using (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  );

-- Política: parceiro pode atualizar reservas da sua loja
create policy "Partner can update own reservations"
  on public.reservations for update
  using (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  )
  with check (
    store_id in (
      select id from public.stores where user_id = auth.uid()
    )
  );
