# Deploy E Dominios

## Decisao Atual

Vercel saiu da rota do projeto. O caminho recomendado agora e:

1. Hostinger para deploy inicial do Next.js, aproveitando a conta e os dominios ja comprados.
2. Supabase em uma organizacao separada do produto CaseOS.
3. Cloudflare como alternativa futura para DNS/CDN/Workers, se quisermos separar DNS da Hostinger.

Referencias consultadas:

- Hostinger informa suporte a Next.js em hospedagem Node.js: https://www.hostinger.com/web-apps-hosting/nextjs-hosting
- Cloudflare recomenda OpenNext/Workers para Next.js full-stack e Pages para export estatico: https://developers.cloudflare.com/pages/framework-guides/nextjs/

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

O dominio `.com` deve redirecionar de forma permanente para:

```txt
https://quazdigraca.com.br
```

O middleware do app tambem reforca esse redirecionamento quando a aplicacao recebe trafego por `www` ou pelo `.com`.

## Hostinger

Usar o deploy Node.js/Next.js da Hostinger, nao upload estatico simples, porque o site tem rota API em:

```txt
apps/web/app/api/leads/route.ts
```

Configuracao sugerida para o projeto web:

```txt
Repositorio: ueligtoncordeiro-ux/quaz
Diretorio do projeto: /
Install command: npm install
Build command: npm run build
Start command: npm run start
Dominio principal: quazdigraca.com.br
```

Variaveis de ambiente:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-quaz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

Se o painel da Hostinger pedir caminho ou pasta do app, usar a raiz do repositorio e os scripts acima. O monorepo resolve `@quaz/web` via npm workspaces.

## App Consumidor

O app consumidor ainda e separado do site institucional:

```txt
npm run dev:app
npm run build:app
npm run start:app
```

Quando for publicar, usar subdominio separado:

```txt
app.quazdigraca.com.br
```

Configuracao sugerida:

```txt
Repositorio: ueligtoncordeiro-ux/quaz
Diretorio do projeto: /
Install command: npm install
Build command: npm run build:app
Start command: npm run start:app
```

## Supabase

Nao usar a organizacao `caseos-ux` para o Quaz. Criar uma nova organizacao no Supabase, por exemplo:

```txt
quaz
```

Depois criar um projeto dedicado:

```txt
quaz-prod
```

Aplicar a migration:

```txt
supabase/migrations/202605310001_create_lead_submissions.sql
```

## SEO Tecnico

O app ja define:

```txt
metadataBase = https://quazdigraca.com.br
canonical = /
sitemap.xml
robots.txt
favicon.png
```
