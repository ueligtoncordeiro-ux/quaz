# Deploy E Dominios

## Dominios

Dominios comprados:

```txt
quazdigraca.com.br
quazdigraca.com
```

Dominio principal recomendado:

```txt
quazdigraca.com.br
```

Motivo: a primeira operacao sera no Brasil, a marca fala em portugues e o `.com.br` transmite presenca local.

Dominio secundario:

```txt
quazdigraca.com
```

Configurar como redirect permanente para:

```txt
https://quazdigraca.com.br
```

## Quando Vincular

Vincular depois que o primeiro deploy estiver criado na Vercel.

Ordem recomendada:

1. Criar projeto na Vercel conectado ao GitHub.
2. Configurar build do monorepo.
3. Validar URL temporaria da Vercel.
4. Adicionar `quazdigraca.com.br` como dominio principal.
5. Adicionar `www.quazdigraca.com.br` como alias.
6. Adicionar `quazdigraca.com` e `www.quazdigraca.com` redirecionando para o dominio principal.
7. Configurar DNS no provedor/Cloudflare conforme instrucoes da Vercel.

Detalhes especificos para os dominios no Hostinger estao em `docs/dominios-hostinger.md`.

## Vercel

Projeto:

```txt
quaz-web
```

Repositorio:

```txt
ueligtoncordeiro-ux/quaz
```

Framework:

```txt
Next.js
```

Root directory:

```txt
/
```

Install command:

```txt
npm install
```

Build command:

```txt
npm run build
```

Output:

```txt
Next.js default
```

## Variaveis De Ambiente

No painel da Vercel, configurar:

```txt
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Enquanto o Supabase nao estiver configurado, o site ainda builda, mas os formularios mostram mensagem de configuracao pendente.

## SEO Tecnico

O app ja define:

```txt
metadataBase = https://quazdigraca.com.br
canonical = /
sitemap.xml
robots.txt
favicon.png
```
