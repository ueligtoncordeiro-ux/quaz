import { createSupabaseServerClient } from "../../lib/supabase-server";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { redirect } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { PainelAchados } from "./PainelAchados";
import { PainelReservations } from "./PainelReservations";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

const CATEGORIES = ["pão / confeitaria", "marmita", "combo surpresa", "fruta / legume", "lanche", "bebida", "outro"];

const statusAchadoLabels: Record<string, string> = {
  active: "Ativo",
  sold_out: "Esgotado",
  expired: "Expirado",
  cancelled: "Cancelado",
};

async function getPartnerStore(userId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("stores")
    .select("id, name, city, type, hours, status")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

async function getStoreAchados(storeId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("achados")
    .select("id, title, category, sale_price, original_price, quantity, quantity_reserved, pickup_start, pickup_end, status")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getStoreReservations(storeId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("reservations")
    .select("id, name, phone, code, status, created_at, achados(title, pickup_end)")
    .eq("store_id", storeId)
    .in("status", ["pending", "confirmed"])
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export default async function PainelPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/parceiros/entrar");

  const store = await getPartnerStore(user.id);

  if (!store) {
    return (
      <main className="authShell">
        <div className="authCard">
          <p className="eyebrow" style={{ textAlign: "center" }}>Painel do Parceiro</p>
          <h2 style={{ textAlign: "center" }}>Loja não encontrada</h2>
          <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>
            Seu e-mail <strong>{user.email}</strong> ainda não está vinculado a nenhuma loja.
            Entre em contato com a equipe Quáz para ativar seu acesso.
          </p>
          <form action={signOut}>
            <button type="submit" className="authSignOutBtn">Sair</button>
          </form>
        </div>
      </main>
    );
  }

  const [achados, reservations] = await Promise.all([
    getStoreAchados(store.id),
    getStoreReservations(store.id),
  ]);

  const activeAchados = achados.filter((a) => a.status === "active").length;
  const pendingReservations = reservations.filter((r) => r.status === "pending").length;

  // Default pickup times: today 17h–20h (Cuiabá timezone)
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Cuiaba" }));
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const defaultStart = `${dateStr}T17:00`;
  const defaultEnd = `${dateStr}T20:00`;

  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="eyebrow">Painel do Parceiro</p>
            <h1>{store.name}</h1>
            <p className="lead">{store.city} · {store.type || "Estabelecimento"}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="authSignOutBtn">Sair</button>
          </form>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        {/* Métricas */}
        <div className="adminMetrics" style={{ maxWidth: 720, marginBottom: 40 }}>
          <article><strong>{achados.length}</strong><span>Achados criados</span></article>
          <article><strong>{activeAchados}</strong><span>Ativos agora</span></article>
          <article><strong>{pendingReservations}</strong><span>Reservas pendentes</span></article>
        </div>

        {/* Reservas pendentes */}
        <PainelReservations reservations={reservations} storeId={store.id} />

        {/* Criar novo achado */}
        <div className="adminCard" style={{ maxWidth: 720, marginTop: 40 }}>
          <h2 className="adminCardTitle">+ Novo Achado</h2>
          <PainelAchados
            storeId={store.id}
            categories={CATEGORIES}
            defaultStart={defaultStart}
            defaultEnd={defaultEnd}
          />
        </div>

        {/* Lista de achados */}
        <div style={{ maxWidth: 720, marginTop: 32 }}>
          <h2 style={{ marginBottom: 16 }}>Seus achados</h2>
          {achados.length === 0 ? (
            <p style={{ color: "var(--ink-soft)" }}>Nenhum achado criado ainda.</p>
          ) : (
            <div className="achadosGrid">
              {achados.map((a) => {
                const available = a.quantity - a.quantity_reserved;
                const pickupEnd = new Date(a.pickup_end).toLocaleString("pt-BR", {
                  timeZone: "America/Cuiaba",
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={a.id} className="achadoCard" style={{ cursor: "default" }}>
                    <div className="achadoCardHeader">
                      <span className={`adminBadge${a.status === "active" ? " partner" : ""}`}>
                        {statusAchadoLabels[a.status] ?? a.status}
                      </span>
                      <span className="achadoDiscount">
                        -{Math.round((1 - a.sale_price / a.original_price) * 100)}%
                      </span>
                    </div>
                    <p className="achadoTitle">{a.title}</p>
                    <p className="achadoCategory">{a.category}</p>
                    <div className="achadoFooter">
                      <div>
                        <strong className="achadoPrice">
                          {a.sale_price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </strong>
                      </div>
                      <div className="achadoMeta">
                        <span>Até {pickupEnd}</span>
                        <span>{available} disponível{available !== 1 ? "is" : ""}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
