import { AdminLoginForm } from "../components/AdminLoginForm";
import { isAdminAuthenticated, logoutAdmin } from "../actions";
import { updateLeadStatus } from "./actions";
import { createSupabaseAdminClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  kind: "consumer" | "partner";
  email: string | null;
  contact: string | null;
  business_name: string | null;
  source: string;
  status: string;
  created_at: string;
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

async function getLeads() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      error: "Supabase ainda não está configurado.",
      leads: [] as Lead[]
    };
  }

  const { data, error } = await supabase
    .from("lead_submissions")
    .select("id, kind, email, contact, business_name, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

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

export default async function AdminLeadsPage() {
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

  const { leads, error } = await getLeads();
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
        <form action={logoutAdmin}>
          <button className="adminGhostButton" type="submit">
            Sair
          </button>
        </form>
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
                <tr key={lead.id}>
                  <td>
                    <span className={`adminBadge ${lead.kind}`}>
                      {lead.kind === "partner" ? "Parceiro" : "Consumidor"}
                    </span>
                  </td>
                  <td>
                    <strong>{lead.business_name ?? lead.email}</strong>
                    <span>{lead.contact ?? lead.email ?? "Sem contato"}</span>
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
