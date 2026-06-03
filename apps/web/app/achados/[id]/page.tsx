import { createSupabaseAdminClient } from "../../lib/supabase";
import { SiteHeader } from "../../components/SiteHeader";
import { notFound } from "next/navigation";

export const revalidate = 60;

type AchadoFull = {
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
  stores: { id: string; name: string; city: string; slug: string; address: string | null; hours: string | null };
};

async function getAchado(id: string): Promise<AchadoFull | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("achados")
    .select(`
      id, title, description, category,
      original_price, sale_price, quantity, quantity_reserved,
      pickup_start, pickup_end, status,
      stores!inner ( id, name, city, slug, address, hours )
    `)
    .eq("id", id)
    .eq("status", "active")
    .eq("stores.status", "active")
    .maybeSingle();

  return data as AchadoFull | null;
}

function formatPrice(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDatetime(v: string) {
  return new Date(v).toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
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

type PageProps = { params: Promise<{ id: string }> };

export default async function AchadoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const achado = await getAchado(id);
  if (!achado) notFound();

  const available = achado.quantity - achado.quantity_reserved;

  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">Achado Quáz</p>
          <h1>{achado.title}</h1>
          <p className="lead">{achado.stores.name} · {achado.stores.city}</p>
        </div>
      </section>

      <section className="section achadoDetail">
        <div className="achadoDetailCard">
          {/* Header */}
          <div className="achadoDetailHeader">
            <span className="achadoTag">Achado Quáz</span>
            <span className="achadoDiscount">-{discount(achado.original_price, achado.sale_price)}%</span>
          </div>

          {/* Category */}
          <p className="achadoCategory">{achado.category}</p>

          {/* Description */}
          {achado.description && (
            <p className="achadoDescription">{achado.description}</p>
          )}

          {/* Price block */}
          <div className="achadoPriceBlock">
            <strong className="achadoDetailPrice">{formatPrice(achado.sale_price)}</strong>
            <span className="achadoDetailOriginal">de {formatPrice(achado.original_price)}</span>
          </div>

          {/* Pickup info */}
          <div className="achadoPickupBlock">
            <div className="achadoPickupRow">
              <span className="achadoPickupLabel">📅 Retirada</span>
              <span>{formatDatetime(achado.pickup_start)}</span>
            </div>
            <div className="achadoPickupRow">
              <span className="achadoPickupLabel">⏰ Até</span>
              <span>{formatTime(achado.pickup_end)}</span>
            </div>
            <div className="achadoPickupRow">
              <span className="achadoPickupLabel">🛍️ Disponíveis</span>
              <span><strong>{available}</strong> unidade{available !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Store info */}
          <div className="achadoStoreBlock">
            <strong>{achado.stores.name}</strong>
            <span>{achado.stores.city}</span>
            {achado.stores.address && <span>{achado.stores.address}</span>}
            {achado.stores.hours && <span>⏱ {achado.stores.hours}</span>}
          </div>

          {/* Reserve CTA (Sprint 4) */}
          {available > 0 ? (
            <div className="achadoReserveCta">
              <p className="achadoReserveHint">Em breve você poderá reservar direto por aqui. Por enquanto, vá até a loja no horário combinado!</p>
              <a href="/achados" className="achadoBackLink">← Ver outros achados</a>
            </div>
          ) : (
            <div className="achadoReserveCta">
              <p className="achadoSoldOut">😢 Este achado já foi embora. Mas tem outros esperando por você!</p>
              <a href="/achados" className="achadoBackLink">← Ver outros achados</a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
