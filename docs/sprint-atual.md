# Sprint Atual

> Atualize este arquivo ao **iniciar** e ao **concluir** cada tarefa.
> Tanto Claude quanto Codex devem ler isso antes de agir.

---

## Sprint 2 — Stores (em planejamento)

**Objetivo:** transformar lead aprovado em loja ativa no sistema.
**Status:** ⬜ não iniciada
**Responsável:** —

### Tarefas

- [ ] Migration `stores` — id, slug, name, type, city, address, phone, email, hours, status, lead_id, created_at, updated_at
- [ ] Admin: botão "Promover a loja" no lead com status `approved`
- [ ] Admin: `/admin/stores` — lista lojas, ativar/desativar
- [ ] Público: `/parceiros/[slug]` — página da loja

### Decisões desta sprint
- `stores.status`: `pending | active | inactive`
- `stores.slug`: gerado a partir do `business_name` (slugify)
- `stores.lead_id`: FK para `lead_submissions.id` (nullable — loja pode existir sem lead)

---

## Sprint 3 — Achados (planejada)

**Objetivo:** criar primeiro Achado Quáz manualmente via admin.
**Status:** ⬜ aguarda Sprint 2

### Tarefas
- [ ] Migration `achados`
- [ ] Admin: `/admin/stores/[id]/achados` — criar/editar/desativar
- [ ] Público: `/achados` — listagem por cidade
- [ ] Público: `/achados/[id]` — página do achado

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
