import Link from "next/link";
import { isAdminAuthenticated } from "../actions";
import { updateStoreStatus, linkPartnerUser } from "./actions";
import { DeleteStoreButton } from "./DeleteStoreButton";
import { ResendAccessButton } from "./ResendAccessButton";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  active: "Ativa",
  inactive: "Inativa",
};

const statusColors: Record<string, string> = {
  pending: "adminBadge consumer",
  active: "adminBadge partner",
  inactive: "adminBadge",
};

async function getStores() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("stores")
    .select("id, slug, name, type, city, phone, email, hours, status, user_id, created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminStoresPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/leads");

  const stores = await getStores();
  const active = stores.filter((s) => s.status === "active").length;
  const pending = stores.filter((s) => s.status === "pending").length;

  return (
    <main className="adminShell">
      <section className="adminTop">
        <div>
          <p className="eyebrow">operação</p>
          <h1>Lojas</h1>
          <p className="lead">Gerencie os estabelecimentos parceiros ativos na plataforma.</p>
        </div>
        <nav className="adminNav">
          <Link href="/admin/reservations" className="adminGhostButton">Reservas</Link>
          <Link href="/admin/leads" className="adminGhostButton">← Leads</Link>
        </nav>
      </section>

      <section className="adminMetrics" aria-label="Resumo de lojas">
        <article>
          <strong>{stores.length}</strong>
          <span>Total</span>
        </article>
        <article>
          <strong>{active}</strong>
          <span>Ativas</span>
        </article>
        <article>
          <strong>{pending}</strong>
          <span>Pendentes</span>
        </article>
      </section>

      <section className="adminTableWrap" aria-label="Tabela de lojas">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Loja</th>
              <th>Cidade</th>
              <th>Parceiro (e-mail)</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {stores.length ? (
              stores.map((store) => (
                <tr key={store.id}>
                  <td>
                    <strong>{store.name}</strong>
                    <span className="adminMuted">/{store.slug}</span>
                  </td>
                  <td>{store.city}</td>
                  <td>
                    {store.user_id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span className="adminBadge partner">✅ vinculado</span>
                        {store.email && <ResendAccessButton email={store.email} />}
                      </div>
                    ) : (
                      <form action={linkPartnerUser} className="adminInlineForm">
                        <input type="hidden" name="store_id" value={store.id} />
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder={store.email ?? "e-mail do parceiro"}
                          defaultValue={store.email ?? ""}
                          style={{ width: "180px" }}
                        />
                        <button type="submit">Vincular</button>
                      </form>
                    )}
                  </td>
                  <td>
                    <span className={statusColors[store.status] ?? "adminBadge"}>
                      {statusLabels[store.status] ?? store.status}
                    </span>
                  </td>
                  <td>
                    <div className="adminInlineForm">
                      <Link href={`/admin/stores/${store.id}`} className="adminDetailSave" style={{textDecoration:"none", fontSize:"0.8rem"}}>
                        Achados
                      </Link>
                      <form action={updateStoreStatus} className="adminInlineForm">
                        <input type="hidden" name="id" value={store.id} />
                        <select key={store.status} name="status" defaultValue={store.status} aria-label="Alterar status">
                          {Object.entries(statusLabels).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                        <button type="submit">Salvar</button>
                      </form>
                      <DeleteStoreButton storeId={store.id} storeName={store.name} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Nenhuma loja cadastrada ainda. Promova um lead aprovado em <Link href="/admin/leads">Leads</Link>.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
