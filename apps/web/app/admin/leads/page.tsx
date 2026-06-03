import Link from "next/link";
import { AdminLoginForm } from "../components/AdminLoginForm";
import { isAdminAuthenticated, logoutAdmin } from "../actions";
import { updateLeadStatus, updateLeadDetails } from "./actions";
import { promoteLeadToStore } from "../stores/actions";
import { createSupabaseAdminClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ kind?: string; status?: string }>;
};

type Lead = {
  id: string;
  kind: "consumer" | "partner";
  email: string | null;
  contact: string | null;
  business_name: string | null;
  source: string;
  status: string;
  created_at: string;
  city: string | null;
  phone: string | null;
  notes: string | null;
  handled_by: string | null;
};

const statusLabels: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  approved: "Aprovado",
  rejected: "Rejeitado"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Cuiaba"
  }).format(new Date(value));
}

async function getLeads(kind?: string, status?: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      error: "Supabase ainda não está configurado.",
      leads: [] as Lead[]
    };
  }

  let query = supabase
    .from("lead_submissions")
    .select("id, kind, email, contact, business_name, source, status, created_at, city, phone, notes, handled_by")
    .order("created_at", { ascending: false })
    .limit(200);

  if (kind === "consumer" || kind === "partner") {
    query = query.eq("kind", kind);
  }
  if (status && ["new", "contacted", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return {
      error: "Não foi possível carregar os leads.",
      leads: [] as Lead[]
    };
  }

  return {
    error: "",
    leads: (data ?? []) as Lead[]
  };
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="adminShell narrow">
        <section className="adminHero">
          <p className="eyebrow">admin</p>
          <h1>Entrar no painel</h1>
          <p className="lead">
            Acesso restrito para acompanhar leads de consumidores e parceiros.
          </p>
        </section>
        <AdminLoginForm />
      </main>
    );
  }

  const { kind, status } = await searchParams;
  const { leads, error } = await getLeads(kind, status);
  const totalConsumers = leads.filter((lead) => lead.kind === "consumer").length;
  const totalPartners = leads.filter((lead) => lead.kind === "partner").length;
  const totalNew = leads.filter((lead) => lead.status === "new").length;

  return (
    <main className="adminShell">
      <section className="adminTop">
        <div>
          <p className="eyebrow">operação</p>
          <h1>Leads do Quáz</h1>
          <p className="lead">
            Acompanhe interessados, priorize parceiros e organize o início do piloto.
          </p>
        </div>
        <nav className="adminNav">
          <Link href="/admin/stores" className="adminGhostButton">🏪 Lojas</Link>
          <form action={logoutAdmin}>
            <button className="adminGhostButton" type="submit">Sair</button>
          </form>
        </nav>
      </section>

      <section className="adminMetrics" aria-label="Resumo de leads">
        <article>
          <strong>{leads.length}</strong>
          <span>Total de leads</span>
        </article>
        <article>
          <strong>{totalPartners}</strong>
          <span>Parceiros</span>
        </article>
        <article>
          <strong>{totalConsumers}</strong>
          <span>Consumidores</span>
        </article>
        <article>
          <strong>{totalNew}</strong>
          <span>Novos</span>
        </article>
      </section>

      {error ? <p className="adminMessage error">{error}</p> : null}

      <section className="adminFilters" aria-label="Filtros">
        <div className="adminFilterGroup">
          <span>Tipo:</span>
          <a className={`adminFilterChip${!kind ? " active" : ""}`} href="/admin/leads">Todos</a>
          <a className={`adminFilterChip${kind === "partner" ? " active" : ""}`} href="/admin/leads?kind=partner">Parceiros</a>
          <a className={`adminFilterChip${kind === "consumer" ? " active" : ""}`} href="/admin/leads?kind=consumer">Consumidores</a>
        </div>
        <div className="adminFilterGroup">
          <span>Status:</span>
          <a className={`adminFilterChip${!status ? " active" : ""}`} href={`/admin/leads${kind ? `?kind=${kind}` : ""}`}>Todos</a>
          {Object.entries(statusLabels).map(([value, label]) => (
            <a
              key={value}
              className={`adminFilterChip${status === value ? " active" : ""}`}
              href={`/admin/leads?${kind ? `kind=${kind}&` : ""}status=${value}`}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          className="adminCsvLink"
          href={`/admin/leads/export${kind || status ? `?${kind ? `kind=${kind}` : ""}${kind && status ? "&" : ""}${status ? `status=${status}` : ""}` : ""}`}
        >
          ↓ Exportar CSV
        </a>
      </section>

      <section className="adminTableWrap" aria-label="Tabela de leads">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nome/contato</th>
              <th>Status</th>
              <th>Origem</th>
              <th>Recebido em</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {leads.length ? (
              leads.map((lead) => (
                <>
                  <tr key={lead.id}>
                    <td>
                      <span className={`adminBadge ${lead.kind}`}>
                        {lead.kind === "partner" ? "Parceiro" : "Consumidor"}
                      </span>
                    </td>
                    <td>
                      <strong>{lead.business_name ?? lead.email}</strong>
                      {lead.contact ? <span>{lead.contact}</span> : null}
                      {lead.email && lead.kind === "partner" ? <span className="adminEmailTag">{lead.email}</span> : null}
                      {!lead.contact && !lead.email ? <span>Sem contato</span> : null}
                      {lead.city ? <span className="adminCityTag">{lead.city}</span> : null}
                      {lead.notes ? (
                        <span className="adminNotesTags">
                          {lead.notes.split(" | ").map((tag) => (
                            <span key={tag} className="adminNotesTag">{tag}</span>
                          ))}
                        </span>
                      ) : null}
                    </td>
                    <td>{statusLabels[lead.status] ?? lead.status}</td>
                    <td>{lead.source}</td>
                    <td>{formatDate(lead.created_at)}</td>
                    <td>
                      <form action={updateLeadStatus} className="adminInlineForm">
                        <input name="id" type="hidden" value={lead.id} />
                        <select aria-label="Alterar status" name="status" defaultValue={lead.status}>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button type="submit">Salvar</button>
                      </form>
                    </td>
                  </tr>
                  <tr key={`${lead.id}-details`} className="adminDetailRow">
                    <td colSpan={6}>
                      <details>
                        <summary className="adminDetailToggle">
                          Detalhes operacionais
                          {lead.phone || lead.notes || lead.handled_by ? " ✎" : ""}
                        </summary>
                        <form action={updateLeadDetails} className="adminDetailForm">
                          <input name="id" type="hidden" value={lead.id} />
                          <div className="adminDetailGrid">
                            <label>
                              <span>Cidade</span>
                              <input name="city" type="text" defaultValue={lead.city ?? ""} placeholder="Ex: Tangará da Serra" />
                            </label>
                            <label>
                              <span>Telefone / WhatsApp</span>
                              <input name="phone" type="text" defaultValue={lead.phone ?? lead.contact ?? ""} placeholder="(65) 9 9999-9999" />
                            </label>
                            <label>
                              <span>Responsável</span>
                              <input name="handled_by" type="text" defaultValue={lead.handled_by ?? ""} placeholder="Nome do atendente" />
                            </label>
                            {lead.email ? (
                              <label>
                                <span>E-mail</span>
                                <input type="email" value={lead.email} readOnly style={{background:"#f7f7f7", cursor:"default"}} />
                              </label>
                            ) : null}
                            <label className="adminDetailFull">
                              <span>Observações / Dados do cadastro</span>
                              <textarea name="notes" rows={3} defaultValue={lead.notes ?? ""} placeholder="Notas internas sobre este lead..." />
                            </label>
                          </div>
                          <button type="submit" className="adminDetailSave">Salvar detalhes</button>
                        </form>
                      </details>

                      {lead.kind === "partner" && lead.status === "approved" && (
                        <details className="adminPromoteWrap">
                          <summary className="adminPromoteToggle">🏪 Promover a loja</summary>
                          <form action={promoteLeadToStore} className="adminDetailForm">
                            <input type="hidden" name="lead_id" value={lead.id} />
                            <p className="adminPromoteHint">
                              Cria um registro ativo em <strong>Lojas</strong> a partir deste lead.
                            </p>
                            <div className="adminDetailGrid">
                              <label>
                                <span>Nome da loja *</span>
                                <input name="name" required defaultValue={lead.business_name ?? ""} />
                              </label>
                              <label>
                                <span>Tipo de negócio</span>
                                <input name="type" defaultValue={
                                  lead.notes?.match(/Tipo: ([^|]+)/)?.[1]?.trim() ?? ""
                                } placeholder="Ex: Padaria" />
                              </label>
                              <label>
                                <span>Cidade *</span>
                                <input name="city" required defaultValue={lead.city ?? ""} />
                              </label>
                              <label>
                                <span>Telefone / WhatsApp</span>
                                <input name="phone" defaultValue={lead.phone ?? lead.contact ?? ""} />
                              </label>
                              <label>
                                <span>E-mail</span>
                                <input name="email" type="email" defaultValue={lead.email ?? ""} />
                              </label>
                              <label>
                                <span>Horário</span>
                                <input name="hours" defaultValue={
                                  lead.notes?.match(/Horário: ([^|]+)/)?.[1]?.trim() ?? ""
                                } placeholder="Ex: Seg–Sex 7h–19h" />
                              </label>
                              <label className="adminDetailFull">
                                <span>Endereço</span>
                                <input name="address" placeholder="Rua, número, bairro" />
                              </label>
                            </div>
                            <button type="submit" className="adminDetailSave adminPromoteBtn">
                              ✓ Criar loja ativa
                            </button>
                          </form>
                        </details>
                      )}
                    </td>
                  </tr>
                </>
              ))
            ) : (
              <tr>
                <td colSpan={6}>Nenhum lead encontrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
