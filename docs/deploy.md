# Deploy E Dominios

## Decisao Atual

A infraestrutura atual do Quaz e:

- Vercel para deploy do site institucional em Next.js.
- Supabase dedicado da organizacao `Quaz` para banco e backend inicial.
- Hostinger como origem dos dominios comprados.
- Cloudflare fica como alternativa futura para DNS/CDN/Workers, se precisarmos.

## Vercel

Projeto atual:

```txt
Repositorio: ueligtoncordeiro-ux/quaz
App publicado: apps/web
Framework: Next.js
Root Directory no painel da Vercel: apps/web
```

Configuracao esperada no projeto Vercel:

```txt
Install command: npm install
Build command: npm run build
Output directory: .next
```

O arquivo `vercel.json` da raiz registra essa configuracao. Como a Vercel esta com root em `apps/web`, o output `.next` se refere a `apps/web/.next`.

Variaveis de ambiente na Vercel:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://wgzrncvryjfhsrmfhgap.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key do projeto Quaz>
RESEND_API_KEY=<chave da Resend>
NOTIFY_EMAIL=contato@quazdigraca.com.br
```

Nunca commitar `SUPABASE_SERVICE_ROLE_KEY` nem `RESEND_API_KEY`.

## Supabase

Projeto dedicado:

```txt
Organizacao: Quaz
Project ID: wgzrncvryjfhsrmfhgap
Project URL: https://wgzrncvryjfhsrmfhgap.supabase.co
Regiao: us-west-2
```

Tabela operacional atual:

```txt
public.lead_submissions
```

Migration:

```txt
supabase/migrations/202605310001_create_lead_submissions.sql
```

Nao usar a organizacao `caseos-ux`, que pertence a outro produto.

## Dominios

Dominios comprados:

```txt
quazdigraca.com.br
quazdigraca.com
```

Dominio principal:

```txt
quazdigraca.com.br
```

Dominio secundario:

```txt
quazdigraca.com
```

O dominio `.com` deve redirecionar permanentemente para:

```txt
https://quazdigraca.com.br
```

O middleware do app reforca esse redirecionamento para trafego por `www` ou pelo `.com`.

## App Consumidor

O app consumidor em `apps/app` ainda e prototipo interno. Quando for publicar:

```txt
Subdominio: app.quazdigraca.com.br
Build command: npm run build:app
Start command: npm run start:app
```

Por enquanto, o foco de producao e o site institucional e o fluxo de leads.

## Checklist De Producao

1. Conferir deploy ativo na Vercel.
2. Conferir dominio `quazdigraca.com.br`.
3. Conferir redirecionamento de `quazdigraca.com`.
4. Enviar lead consumidor pelo site.
5. Enviar lead parceiro pelo site.
6. Confirmar registros em `public.lead_submissions`.
7. Confirmar e-mail de notificacao via Resend.
