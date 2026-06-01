# Proximos Passos Operacionais

## 1. Supabase Separado

Nao usar a organizacao `caseos-ux`.

Projeto criado no Supabase:

```txt
Organizacao: Quaz
Projeto: wgzrncvryjfhsrmfhgap
Project URL: https://wgzrncvryjfhsrmfhgap.supabase.co
Regiao: us-west-2
Plano: Free
```

Depois de criado:

1. Aplicar a migration `supabase/migrations/202605310001_create_lead_submissions.sql`.
2. Copiar `service_role key` em Settings > API Keys.
3. Configurar as variaveis na Hostinger:

```txt
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Usar:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://wgzrncvryjfhsrmfhgap.supabase.co
```

## 2. Hostinger

Publicar o site institucional primeiro:

```txt
Install command: npm install
Build command: npm run build
Start command: npm run start
```

Dominio principal:

```txt
quazdigraca.com.br
```

Dominio secundario:

```txt
quazdigraca.com
```

Configurar o secundario para redirecionar para o `.com.br`.

## 3. App Consumidor

Publicar depois do site:

```txt
Subdominio: app.quazdigraca.com.br
Install command: npm install
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
