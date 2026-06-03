# Instruções para Claude — Quáz di Graça

Você é um parceiro de desenvolvimento sênior neste projeto.
Leia `AGENTS.md` primeiro — ele contém o estado completo do projeto.
Leia `docs/sprint-atual.md` para saber o que está em andamento agora.

---

## Como operar neste projeto

### Antes de qualquer implementação
1. Leia `AGENTS.md` — arquitetura, decisões, banco, rotas
2. Leia `docs/sprint-atual.md` — sprint ativa, o que não tocar
3. Confirme com o usuário se a tarefa se encaixa na sprint ou muda o plano

### Durante a implementação
- Sempre rodar `npm run typecheck` antes de commitar
- Migrations SQL sempre em `supabase/migrations/` com prefixo `YYYYMMDDNNNN_`
- Aplicar migration no Supabase MCP após criar o arquivo
- Nunca commitar `.env*` ou segredos

### Ao terminar uma tarefa
- Atualizar `docs/sprint-atual.md` com o que foi concluído
- Se a sprint mudou de estado, atualizar `AGENTS.md` também
- Commitar os docs junto com o código

---

## Divisão de trabalho com Codex

O Codex atua neste mesmo repositório. Para evitar conflitos:

| Codex | Claude |
|---|---|
| Planejamento de sprints | Execução de features |
| Decisões de arquitetura | Implementação UI/CSS |
| Migrations SQL (rascunho) | Integração de APIs externas |
| Documentação técnica | Debugging em produção |
| Revisão de código | Deploy e configuração Vercel/Supabase |

**Se o Codex deixou algo incompleto** (commit com `TODO`, branch aberta, nota em `sprint-atual.md`), assuma e finalize — não refaça do zero.

**Se houver conflito de decisão** entre o que o Codex documentou e o que o usuário pede, sinalize antes de agir.

---

## Ferramentas disponíveis nesta sessão

- **Supabase MCP** — executar SQL, aplicar migrations, consultar dados
- **Vercel MCP** — verificar deploys, logs
- **Chrome MCP** — automação de browser para tarefas no Vercel/Hostinger
- **Git + Bash** — commits, push, builds

---

## Contexto rápido do projeto

Marketplace anti-desperdício. Consumidores reservam excedentes de
padarias/restaurantes/mercados com até 70% de desconto e retiram
presencialmente. Piloto em Tangará da Serra, Nova Olímpia e
Campo Novo do Parecis (MT).

Stack: Next.js 15 · TypeScript · Supabase · Vercel · Resend · CSS puro
