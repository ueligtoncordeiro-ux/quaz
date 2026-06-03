import { isAdminAuthenticated } from "../actions";
import { updateReservationStatus } from "./actions";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  no_show: "Não retirou",
};

const statusColors: Record<string, string> = {
  pending: "adminBadge consumer",
  confirmed: "adminBadge partner",
  cancelled: "adminBadge",
  no_show: "adminBadge",
};

function formatDatetime(v: string) {
  return new Date(v).toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function getReservations(storeId?: string, status?: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  let query = supabase
    .from("reservations")
    .select(`
      id, name, phone, code, status, created_at,
      achados ( id, title, pickup_end ),
      stores ( id, name, city )
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  if (storeId) query = query.eq("store_id", storeId);
  if (status) query = query.eq("status", status);

  const { data } = await query;
  return data ?? [];
}

async function getStores() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase.from("stores").select("id, name").eq("status", "active").order("name");
  return data ?? [];
}

type PageProps = { searchParams: Promise<{ loja?: string; status?: string }> };

export default async function AdminReservationsPage({ searchParams }: PageProps) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/leads");

  const { loja, status } = await searchParams;
  const [reservations, stores] = await Promise.all([
    getReservations(loja, status),
    getStores(),
  ]);

  const pending = reservations.filter((r) => r.status === "pending").length;
  const confirmed = reservations.filter((r) => r.status === "confirmed").length;

  return (
    <main className="adminShell">
      <section className="adminTop">
        <div>
          <p className="eyebrow">operação</p>
          <h1>Reservas</h1>
          <p className="lead">Gerencie as reservas de achados recebidas.</p>
        </div>
        <nav className="adminNav">
          <a href="/admin/stores" className="adminGhostButton">← Lojas</a>
        </nav>
      </section>

      <section className="adminMetrics" aria-label="Resumo de reservas">
        <article><strong>{reservations.length}</strong><span>Total</span></article>
        <article><strong>{pending}</strong><span>Pendentes</span></article>
        <article><strong>{confirmed}</strong><span>Confirmados</span></article>
      </section>

      {/* Filtros */}
      <section className="achadosFilters">
        <a className={`adminFilterChip${!loja && !status ? " active" : ""}`} href="/admin/reservations">
          Todas
        </a>
        {stores.map((s) => (
          <a
            key={s.id}
            className={`adminFilterChip${loja === s.id ? " active" : ""}`}
            href={`/admin/reservations?loja=${s.id}${status ? `&status=${status}` : ""}`}
          >
            {s.name}
          </a>
        ))}
        <span style={{ borderLeft: "1px solid rgba(36,0,61,0.15)", margin: "0 4px" }} />
        {Object.entries(statusLabels).map(([v, l]) => (
          <a
            key={v}
            className={`adminFilterChip${status === v ? " active" : ""}`}
            href={`/admin/reservations?status=${v}${loja ? `&loja=${loja}` : ""}`}
          >
            {l}
          </a>
        ))}
      </section>

      <section className="adminTableWrap" aria-label="Tabela de reservas">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Achado</th>
              <th>Loja</th>
              <th>Retirar até</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length ? (
              reservations.map((r) => {
                const achado = Array.isArray(r.achados) ? r.achados[0] : r.achados as { id: string; title: string; pickup_end: string } | null;
                const store = Array.isArray(r.stores) ? r.stores[0] : r.stores as { id: string; name: string; city: string } | null;
                return (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ letterSpacing: "0.1em", fontFamily: "monospace", fontSize: "1.05rem" }}>{r.code}</strong>
                    </td>
                    <td>
                      <strong>{r.name}</strong>
                      <span className="adminMuted">{r.phone}</span>
                    </td>
                    <td>{achado?.title ?? "—"}</td>
                    <td>
                      <span>{store?.name ?? "—"}</span>
                      <span className="adminMuted">{store?.city}</span>
                    </td>
                    <td>{achado?.pickup_end ? formatDatetime(achado.pickup_end) : "—"}</td>
                    <td>
                      <span className={statusColors[r.status] ?? "adminBadge"}>
                        {statusLabels[r.status] ?? r.status}
                      </span>
                    </td>
                    <td>
                      <form action={updateReservationStatus} className="adminInlineForm">
                        <input type="hidden" name="id" value={r.id} />
                        <select name="status" defaultValue={r.status} aria-label="Alterar status">
                          {Object.entries(statusLabels).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                        <button type="submit">Salvar</button>
                      </form>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={7}>Nenhuma reserva ainda.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
