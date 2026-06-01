# Supabase

Usar Supabase Free como backend inicial da Quaz di Graca.

## Status Atual

Projeto dedicado criado na organizacao `Quaz`:

```txt
Project ID: wgzrncvryjfhsrmfhgap
Project URL: https://wgzrncvryjfhsrmfhgap.supabase.co
Regiao: us-west-2
```

O projeto antigo da organizacao `caseos-ux` nao deve ser usado como banco oficial de producao do Quaz.

Recomendacao: manter o Quaz sempre nessa organizacao separada.

Observacao: a migration `create_lead_submissions` foi aplicada no projeto existente `mmeansbyergxxoytvjpn` durante a validacao inicial. Se esse banco pertencer a outro produto, remova a tabela `lead_submissions` somente depois de confirmar que ela nao sera usada.

Alerta de seguranca: esse projeto existente tem tabelas publicas com RLS desativado. Nao habilite RLS automaticamente sem revisar as politicas, porque isso pode bloquear fluxos do outro sistema; mas trate como prioridade se o projeto estiver em producao.

## Criar Projeto

1. Acesse o dashboard do Supabase.
2. Entre na organizacao `Quaz`.
3. Abra o projeto `wgzrncvryjfhsrmfhgap`.
4. Copie:
   - Project URL
   - Service role key

## Variaveis De Ambiente

Crie `.env.local` na raiz do repositorio local:

```txt
NEXT_PUBLIC_SUPABASE_URL="https://wgzrncvryjfhsrmfhgap.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
```

No deploy da Hostinger, configure as mesmas variaveis no painel do projeto.

Importante:

- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador.
- Nunca coloque `.env.local` no Git.
- Use a service role key apenas em rotas server-side, como `app/api/leads`.

## Migration Inicial

Rode o SQL abaixo no Supabase SQL Editor:

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
