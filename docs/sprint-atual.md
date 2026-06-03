# Sprint Atual

> Atualize este arquivo ao **iniciar** e ao **concluir** cada tarefa.
> Tanto Claude quanto Codex devem ler isso antes de agir.

---

## Sprint 2 — Stores ✅

**Objetivo:** transformar lead aprovado em loja ativa no sistema.
**Status:** ✅ concluída

### Tarefas

- [x] Migration `stores` — `202606020002_create_stores.sql`
- [x] Admin: botão "Promover a loja" em leads `partner` + `approved`
- [x] Admin: `/admin/stores` — lista lojas, altera status
- [ ] Público: `/parceiros/[slug]` — página da loja ← deixado para após Sprint 3

---

## Sprint 3 — Achados ✅

**Objetivo:** criar primeiro Achado Quáz manualmente via admin.
**Status:** ✅ concluída

### Tarefas
- [x] Migration `achados` — `202606020003_create_achados.sql`
- [x] Admin: `/admin/stores/[id]` — criar achado, alterar status
- [x] Público: `/achados` — listagem por cidade (ISR 60s)
- [x] Público: `/achados/[id]` — página do achado com CTA placeholder para Sprint 4

---

## Sprint 4 — Reserva (planejada)

**Objetivo:** consumidor reserva sem auth e sem pagamento.
**Status:** ⬜ aguarda Sprint 3

### Tarefas
- [ ] Migration `reservations`
- [ ] Público: botão "Reservar" → nome + telefone → código 6 chars
- [ ] Email: código enviado ao consumidor via Resend
- [ ] Admin: ver reservas por achado, marcar como retirado

---

## Concluído

### Sprint 1 — Admin de Leads + Infra ✅
- [x] Admin `/admin/leads` com login, lista, status, detalhes operacionais
- [x] Filtros por tipo e status
- [x] Exportação CSV
- [x] DB: campos `city`, `phone`, `notes`, `handled_by`, `updated_at`
- [x] Cadastro real de parceiro (`PartnerForm` com 6 campos)
- [x] DNS Vercel atualizado (quazdigraca.com e .com.br)
- [x] Favicon corrigido (512x512 quadrado)
- [x] AGENTS.md, CLAUDE.md, sprint-atual.md criados

---

## Notas inter-agentes

> Use esta seção para deixar recados entre Claude e Codex.

*Nenhuma nota pendente.*
