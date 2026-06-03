# Quáz di Graça — Contexto para Agentes de IA

Leia este arquivo **antes de qualquer ação** neste repositório.
Ele é a fonte única de verdade sobre o estado do projeto.

---

## O que é este projeto

Marketplace anti-desperdício que conecta consumidores a estabelecimentos
locais (padarias, restaurantes, mercados) com ofertas de até 70% off em
excedentes do dia. Modelo: consumidor reserva → retira presencialmente.

**Produto:** Quáz di Graça
**Domínio principal:** quazdigraca.com.br
**Domínio secundário:** quazdigraca.com (redireciona para .com.br)

---

## Infraestrutura — verdade única

| Serviço | Detalhe |
|---|---|
| Deploy | Vercel — projeto `quaz-web`, team `ueligtoncordeiro-2320s-projects` |
| Banco | Supabase — projeto `wgzrncvryjfhsrmfhgap`, org `Quaz`, região us-west-2 |
| E-mail | Resend — sender `onboarding@resend.dev`, destino `contato@quazdigraca.com.br` |
| Domínios | Hostinger (DNS) → Vercel |
| Repo | GitHub `ueligtoncordeiro-ux/quaz` — monorepo npm workspaces |

**Nunca usar** a org Supabase `caseos-ux` — pertence a outro produto.

---

## Estrutura do monorepo

```
apps/
  web/          → site institucional + admin + futuro app consumidor (Next.js 15)
  app/          → ESQUELETO VAZIO — não usar até Sprint 4+ ser decidida
  admin/        → ESQUELETO VAZIO — admin está em apps/web/app/admin/
  partner/      → ESQUELETO VAZIO — painel parceiro futuro
packages/
  config/       → brand colors, constantes compartilhadas
supabase/
  migrations/   → todas as migrations SQL versionadas aqui
docs/           → documentação técnica e operacional
```

---

## Variáveis de ambiente (Vercel — Production)

```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NOTIFY_EMAIL=contato@quazdigraca.com.br
ADMIN_ACCESS_TOKEN=<senha do /admin/leads>
```

Nunca commitar nenhuma dessas variáveis.

---

## Banco de dados — estado atual

### `public.lead_submissions`
Tabela principal de leads do site institucional.

| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| kind | lead_kind enum | 'consumer' ou 'partner' |
| email | text | consumidor ou e-mail do parceiro |
| contact | text | WhatsApp do parceiro |
| business_name | text | nome do estabelecimento |
| city | text | cidade (novo) |
| phone | text | telefone operacional (novo) |
| notes | text | tipo de negócio + horário + obs internas (novo) |
| handled_by | text | responsável pelo atendimento (novo) |
| source | text | 'web' |
| status | text | new / contacted / approved / rejected |
| user_agent | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | trigger automático (novo) |

Migrations aplicadas:
- `202605310001_create_lead_submissions.sql`
- `202606020001_extend_lead_submissions_operations.sql`

### Tabelas ainda não criadas (próximas migrations)
- `stores` — Sprint 2
- `achados` — Sprint 3
- `reservations` — Sprint 4

---

## Rotas em produção — apps/web

### Públicas
| Rota | Descrição |
|---|---|
| `/` | Home institucional |
| `/como-funciona` | Como funciona (consumidor + parceiro) |
| `/seja-parceiro` | Cadastro real de parceiro (PartnerForm) |
| `/onde-estamos` | Cidades do piloto |
| `/ajuda` | FAQ |
| `/termos` | Termos de uso |
| `/privacidade` | Política de privacidade |

### Admin (senha via ADMIN_ACCESS_TOKEN)
| Rota | Descrição |
|---|---|
| `/admin/leads` | Lista de leads, filtros, status, detalhes operacionais |
| `/admin/leads/export` | Download CSV com filtros ativos |

---

## Decisões de arquitetura já tomadas

1. **Apps/web concentra tudo até o piloto.** `apps/app` fica vazio até Sprint 4+.
   Evita segundo deploy, segundo contexto de auth e overhead desnecessário.

2. **Sem auth de consumidor no piloto.** Reserva por nome + telefone, código gerado.
   Auth (Supabase Auth) entra só na Sprint 5+.

3. **Sem pagamento no piloto.** Consumidor paga presencialmente.
   Mercado Pago entra na Fase 5 do roadmap.

4. **Admin em `/admin` dentro de apps/web.** Não usar `apps/admin` (esqueleto vazio).

5. **Tabela `partners` separada não existe ainda.** Lead aprovado vira `store` diretamente.
   Tabela `partners` só quando o fluxo de aprovação estiver claro (Fase 3).

6. **Migrations sempre em `supabase/migrations/`** com prefixo `YYYYMMDDNNNN_`.

7. **Font:** Baloo 2 via `next/font/google`. Não importar via CSS diretamente.

8. **Styles:** CSS puro em `apps/web/app/styles.css`. Sem Tailwind, sem CSS modules.

---

## Roadmap — fases do Codex

| Fase | Status | Descrição |
|---|---|---|
| 0 — Base | ✅ | Infra, repo, domínios |
| 1 — Site Institucional | ✅ | Home, formulários, todas as páginas |
| 4 — Admin Interno | 🔶 | Leads ✅ — Stores/Achados pendentes |
| 2 — Web App Consumidor | ⬜ | Listagem + reserva (sem auth/pagamento) |
| 3 — Painel Parceiro | ⬜ | Login + criar achados + confirmar retirada |
| 5 — Pagamentos e Piloto | ⬜ | Mercado Pago, PIX, piloto real |
| 6 — App Mobile | 🚫 | Fora de escopo agora |
| 7 — IA e Escala | 🚫 | Fora de escopo agora |

---

## Sprint atual

Veja `docs/sprint-atual.md` para o que está em andamento agora.

---

## Convenções de código

- TypeScript strict em todos os apps
- Server Actions para mutações (não API routes quando possível)
- `export const dynamic = "force-dynamic"` em páginas admin
- Sempre rodar `npm run typecheck` antes de commitar
- Commits em português, imperativo: `feat:`, `fix:`, `chore:`, `docs:`
- Co-authored com o agente que implementou

## Comandos úteis

```bash
npm run dev          # dev server (roda de apps/web/)
npm run typecheck    # verificação de tipos
npm run lint         # linting
npm run build        # build de produção
```

---

## Não fazer sem discutir primeiro

- Mudar a estrutura do monorepo
- Adicionar um novo framework CSS
- Criar tabelas no Supabase sem migration versionada
- Mexer em `apps/app`, `apps/admin`, `apps/partner` (esqueletos)
- Adicionar dependência externa pesada sem justificativa
- Alterar middleware.ts sem testar redirecionamentos
