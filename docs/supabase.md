# Supabase

Usar Supabase Free como backend inicial da Quaz di Graca.

## Status Atual

Foi encontrado um projeto Supabase existente na conta, mas ele contem tabelas de outro sistema (`usuarios`, `sessoes`, `revisoes`, entre outras). Por isso, ele nao deve ser usado como banco oficial de producao do Quaz.

Recomendacao: criar um projeto Supabase dedicado, por exemplo `quaz-prod`, antes de configurar a Vercel e os formularios em producao.

Observacao: a migration `create_lead_submissions` foi aplicada no projeto existente `mmeansbyergxxoytvjpn` durante a validacao inicial. Se esse banco pertencer a outro produto, remova a tabela `lead_submissions` somente depois de confirmar que ela nao sera usada.

Alerta de seguranca: esse projeto existente tem tabelas publicas com RLS desativado. Nao habilite RLS automaticamente sem revisar as politicas, porque isso pode bloquear fluxos do outro sistema; mas trate como prioridade se o projeto estiver em producao.

## Criar Projeto

1. Acesse o dashboard do Supabase.
2. Crie um projeto gratuito dedicado ao Quaz.
3. Copie:
   - Project URL
   - Service role key

## Variaveis De Ambiente

Crie `.env.local` na raiz do repositorio local:

```txt
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto-quaz.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
```

No deploy da Vercel, configure as mesmas variaveis no painel do projeto.

Importante:

- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador.
- Nunca coloque `.env.local` no Git.
- Use a service role key apenas em rotas server-side, como `app/api/leads`.

## Migration Inicial

Depois que o projeto dedicado estiver criado, rode o SQL abaixo no Supabase SQL Editor ou aplique via CLI:

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
