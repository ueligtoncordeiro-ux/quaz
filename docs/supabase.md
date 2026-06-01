# Supabase

Usar Supabase Free como backend inicial da Quaz di Graca.

## Criar Projeto

1. Acesse o dashboard do Supabase.
2. Crie um projeto gratuito.
3. Copie:
   - Project URL
   - Service role key

## Variaveis De Ambiente

Crie `.env.local` na raiz do repositorio local:

```txt
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
```

No deploy da Vercel, configure as mesmas variaveis no painel do projeto.

Importante:

- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador.
- Nunca coloque `.env.local` no Git.
- Use a service role key apenas em rotas server-side, como `app/api/leads`.

## Migration Inicial

Rode o SQL abaixo no Supabase SQL Editor ou aplique via CLI:

```txt
supabase/migrations/202605310001_create_lead_submissions.sql
```

Essa migration cria a tabela:

```txt
lead_submissions
```

Ela armazena leads de consumidores e parceiros vindos do site institucional.

## Fluxo Atual

```txt
LeadForm
-> POST /api/leads
-> Supabase service role server-side
-> public.lead_submissions
```

Se as variaveis de ambiente ainda nao estiverem configuradas, o formulario mostra uma mensagem explicando que o Supabase precisa ser conectado.

