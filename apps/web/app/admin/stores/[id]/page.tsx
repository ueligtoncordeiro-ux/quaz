import { isAdminAuthenticated } from "../../actions";
import { createAchado, updateAchadoStatus } from "./actions";
import { createSupabaseAdminClient } from "../../../lib/supabase";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CATEGORIES = ["pão / confeitaria", "marmita", "combo surpresa", "fruta / legume", "lanche", "bebida", "outro"];

const statusLabels: Record<string, string> = {
  active: "Ativo",
  sold_out: "Esgotado",
  expired: "Expirado",
  cancelled: "Cancelado",
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDatetime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    dateStyle: "short",
    timeStyle: "short",
  });
}

function discount(original: number, sale: number) {
  return Math.round((1 - sale / original) * 100);
}

async function getStore(id: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("stores").select("*").eq("id", id).maybeSingle();
  return data;
}

async function getAchados(storeId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("achados")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

type PageProps = { params: Promise<{ id: string }> };

export default async function StoreAchadosPage({ params }: PageProps) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/leads");

  const { id } = await params;
  const store = await getStore(id);
  if (!store) notFound();

  const achados = await getAchados(id);
  const active = achados.filter((a) => a.status === "active").length;

  // Default pickup times: today 17h–20h (Cuiabá timezone)
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Cuiaba" }));
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const defaultStart = `${dateStr}T17:00`;
  const defaultEnd = `${dateStr}T20:00`;

  return (
    <main className="adminShell">
      <section className="adminTop">
        <div>
          <p className="eyebrow">loja</p>
          <h1>{store.name}</h1>
          <p className="lead">{store.city} · {store.type || "Estabelecimento"}</p>
        </div>
        <nav className="adminNav">
          <a href="/admin/stores" className="adminGhostButton">← Lojas</a>
        </nav>
      </section>

      <section className="adminMetrics">
        <article><strong>{achados.length}</strong><span>Total achados</span></article>
        <article><strong>{active}</strong><span>Ativos</span></article>
        <article>
          <strong>{achados.reduce((s, a) => s + (a.quantity - a.quantity_reserved), 0)}</strong>
          <span>Disponíveis</span>
        </article>
      </section>

      {/* Criar novo achado */}
      <section className="adminCard">
        <h2 className="adminCardTitle">+ Novo Achado Quáz</h2>
        <form action={createAchado} className="achadoForm">
          <input type="hidden" name="store_id" value={id} />
          <div className="achadoFormGrid">
            <label className="achadoFull">
              <span>Título *</span>
              <input name="title" required placeholder="Ex: Combo surpresa de pães frescos" />
            </label>
            <label className="achadoFull">
              <span>Descrição</span>
              <input name="description" placeholder="O que o cliente vai receber (opcional)" />
            </label>
            <label>
              <span>Categoria *</span>
              <select name="category" required defaultValue="combo surpresa">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <span>Preço original (R$) *</span>
              <input name="original_price" type="number" step="0.01" min="0.01" required placeholder="25,00" />
            </label>
            <label>
              <span>Preço Quáz (R$) *</span>
              <input name="sale_price" type="number" step="0.01" min="0.01" required placeholder="9,90" />
            </label>
            <label>
              <span>Quantidade *</span>
              <input name="quantity" type="number" min="1" required defaultValue="5" />
            </label>
            <label>
              <span>Retirada — início *</span>
              <input name="pickup_start" type="datetime-local" required defaultValue={defaultStart} />
            </label>
            <label>
              <span>Retirada — fim *</span>
              <input name="pickup_end" type="datetime-local" required defaultValue={defaultEnd} />
            </label>
          </div>
          <button type="submit" className="adminDetailSave">Publicar achado</button>
        </form>
      </section>

      {/* Lista de achados */}
      <section className="adminTableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Achado</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Retirada</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {achados.length ? achados.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.title}</strong>
                  <span>{a.category}</span>
                </td>
                <td>
                  <strong>{formatPrice(a.sale_price)}</strong>
                  <span className="adminMuted">{discount(a.original_price, a.sale_price)}% off</span>
                </td>
                <td>
                  {a.quantity - a.quantity_reserved}
                  <span className="adminMuted">/{a.quantity}</span>
                </td>
                <td>
                  <span>{formatDatetime(a.pickup_start)}</span>
                  <span className="adminMuted">até {formatDatetime(a.pickup_end)}</span>
                </td>
                <td>
                  <span className={`adminBadge ${a.status === "active" ? "partner" : ""}`}>
                    {statusLabels[a.status] ?? a.status}
                  </span>
                </td>
                <td>
                  <form action={updateAchadoStatus} className="adminInlineForm">
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="store_id" value={id} />
                    <select name="status" defaultValue={a.status} aria-label="Alterar status">
                      {Object.entries(statusLabels).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                    <button type="submit">Salvar</button>
                  </form>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6}>Nenhum achado criado ainda. Use o formulário acima.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
