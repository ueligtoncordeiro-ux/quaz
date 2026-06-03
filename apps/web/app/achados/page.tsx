import { createSupabaseAdminClient } from "../lib/supabase";
import { SiteHeader } from "../components/SiteHeader";

export const revalidate = 60;

async function getAchados(city?: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  let query = supabase
    .from("achados")
    .select(`
      id, title, description, category,
      original_price, sale_price, quantity, quantity_reserved,
      pickup_start, pickup_end, status,
      stores!inner ( id, name, city, slug, status )
    `)
    .eq("status", "active")
    .eq("stores.status", "active")
    .gt("pickup_end", new Date().toISOString())
    .order("pickup_end", { ascending: true })
    .limit(50);

  if (city) query = query.eq("stores.city", city);

  const { data } = await query;
  return (data ?? []) as unknown as AchadoWithStore[];
}

async function getCities() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("stores")
    .select("city")
    .eq("status", "active");
  return [...new Set((data ?? []).map((s: { city: string }) => s.city))].sort();
}

type AchadoWithStore = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  original_price: number;
  sale_price: number;
  quantity: number;
  quantity_reserved: number;
  pickup_start: string;
  pickup_end: string;
  status: string;
  stores: { id: string; name: string; city: string; slug: string; status: string };
};

function formatPrice(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatTime(v: string) {
  return new Date(v).toLocaleTimeString("pt-BR", {
    timeZone: "America/Cuiaba",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function discount(original: number, sale: number) {
  return Math.round((1 - sale / original) * 100);
}

type PageProps = { searchParams: Promise<{ cidade?: string }> };

export default async function AchadosPage({ searchParams }: PageProps) {
  const { cidade } = await searchParams;
  const [achados, cities] = await Promise.all([getAchados(cidade), getCities()]);

  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">Achados Quáz</p>
          <h1>Comida boa perto de você.</h1>
          <p className="lead">
            Ofertas de hoje, com retirada no horário combinado.
          </p>
        </div>
      </section>

      {cities.length > 0 && (
        <section className="achadosFilters">
          <a className={`adminFilterChip${!cidade ? " active" : ""}`} href="/achados">
            Todas as cidades
          </a>
          {cities.map((c) => (
            <a
              key={c}
              className={`adminFilterChip${cidade === c ? " active" : ""}`}
              href={`/achados?cidade=${encodeURIComponent(c)}`}
            >
              {c}
            </a>
          ))}
        </section>
      )}

      <section className="section">
        {achados.length === 0 ? (
          <div className="achadosEmpty">
            <p>Nenhum achado disponível agora{cidade ? ` em ${cidade}` : ""}.</p>
            <p>Novos achados aparecem ao longo do dia — volte mais tarde!</p>
          </div>
        ) : (
          <div className="achadosGrid">
            {achados.map((a) => {
              const available = a.quantity - a.quantity_reserved;
              return (
                <a key={a.id} href={`/achados/${a.id}`} className="achadoCard">
                  <div className="achadoCardHeader">
                    <span className="achadoTag">Achado Quáz</span>
                    <span className="achadoDiscount">-{discount(a.original_price, a.sale_price)}%</span>
                  </div>
                  <strong className="achadoStore">{a.stores.name}</strong>
                  <p className="achadoTitle">{a.title}</p>
                  <p className="achadoCategory">{a.category}</p>
                  <div className="achadoFooter">
                    <div>
                      <strong className="achadoPrice">{formatPrice(a.sale_price)}</strong>
                      <span className="achadoOriginal">{formatPrice(a.original_price)}</span>
                    </div>
                    <div className="achadoMeta">
                      <span>Retirar até {formatTime(a.pickup_end)}</span>
                      <span>{available} disponível{available !== 1 ? "is" : ""}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
