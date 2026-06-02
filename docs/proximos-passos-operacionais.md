# Proximos Passos Operacionais

## 1. Infraestrutura Atual

Infraestrutura definida:

```txt
Deploy: Vercel
Banco: Supabase na organizacao Quaz
Dominio principal: quazdigraca.com.br
Dominio secundario: quazdigraca.com
```

Nao usar a organizacao Supabase `caseos-ux`.

Projeto criado no Supabase:

```txt
Organizacao: Quaz
Projeto: wgzrncvryjfhsrmfhgap
Project URL: https://wgzrncvryjfhsrmfhgap.supabase.co
Regiao: us-west-2
Plano: Free
```

Configuracao atual:

1. A migration `supabase/migrations/202605310001_create_lead_submissions.sql` deve estar aplicada.
2. A `service_role key` deve ficar apenas na Vercel.
3. As variaveis devem estar configuradas na Vercel:

```txt
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NOTIFY_EMAIL
ADMIN_ACCESS_TOKEN
```

Usar:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://wgzrncvryjfhsrmfhgap.supabase.co
```

## 2. Vercel

Configurar/publicar o site institucional:

```txt
Root Directory: apps/web
Install command: npm install
Build command: npm run build
Output directory: .next
```

Dominio principal:

```txt
quazdigraca.com.br
```

Dominio secundario:

```txt
quazdigraca.com
```

Configurar o secundario para redirecionar para o `.com.br` no painel de dominio/DNS e manter o middleware como reforco.

## 3. App Consumidor

Publicar depois do site institucional e do admin de leads:

```txt
Subdominio: app.quazdigraca.com.br
Build command: npm run build:app
Start command: npm run start:app
```

## 4. Teste De Producao

Depois do deploy:

1. Abrir `https://quazdigraca.com.br`.
2. Testar formulario de lista de espera.
3. Testar formulario de parceiro.
4. Conferir se os registros aparecem em `public.lead_submissions`.
5. Testar redirecionamento do `.com` para `.com.br`.
6. Conferir notificacao por e-mail.

## 5. Admin De Leads

Rota operacional inicial:

```txt
/admin/leads
```

Variavel obrigatoria:

```txt
ADMIN_ACCESS_TOKEN
```

Fluxo:

1. Acessar `/admin/leads`.
2. Entrar com a senha definida em `ADMIN_ACCESS_TOKEN`.
3. Ver leads de consumidores e parceiros.
4. Atualizar status entre `Novo`, `Contatado`, `Aprovado` e `Rejeitado`.

Esse admin e a base para iniciar a operacao do piloto antes de criar painel completo de parceiros.
