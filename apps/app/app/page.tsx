import Image from "next/image";
import { brand } from "@quaz/config";

const categories = ["Todos", "Padarias", "Mercados", "Refeições", "Hortifruti"];

const offers = [
  {
    store: "Padaria da Vila",
    title: "Combo surpresa de pães e doces",
    distance: "1,2 km",
    pickup: "Retire hoje, 17:30-19:00",
    oldPrice: "R$ 32,00",
    price: "R$ 9,90",
    left: 4,
    tone: "orange"
  },
  {
    store: "Mercado Central",
    title: "Sacola de frutas e legumes",
    distance: "2,4 km",
    pickup: "Retire hoje, 18:00-20:00",
    oldPrice: "R$ 38,00",
    price: "R$ 12,90",
    left: 7,
    tone: "green"
  },
  {
    store: "Cantina Boa Mesa",
    title: "Marmita executiva do dia",
    distance: "3,1 km",
    pickup: "Retire hoje, 14:30-15:30",
    oldPrice: "R$ 28,00",
    price: "R$ 8,90",
    left: 3,
    tone: "purple"
  }
];

export default function ConsumerAppPage() {
  return (
    <main className="appShell">
      <header className="topbar">
        <Image
          src="/logo-quaz.png"
          alt={brand.displayName}
          width={132}
          height={88}
          priority
          className="logo"
        />
        <button className="profileButton" aria-label="Abrir perfil">
          U
        </button>
      </header>

      <section className="locationPanel" aria-labelledby="location-title">
        <span className="eyebrow">sua região</span>
        <h1 id="location-title">Achados Quáz perto de você</h1>
        <p>Comece pelo piloto em uma cidade, com retirada local e ofertas de última hora.</p>
        <div className="searchBox" role="search">
          <span aria-hidden="true">⌕</span>
          <input aria-label="Buscar achados" placeholder="Buscar padaria, mercado ou refeição" />
        </div>
      </section>

      <nav className="categoryRail" aria-label="Categorias">
        {categories.map((category, index) => (
          <button className={index === 0 ? "active" : ""} key={category}>
            {category}
          </button>
        ))}
      </nav>

      <section className="contentHeader">
        <div>
          <span className="eyebrow">disponíveis hoje</span>
          <h2>{offers.length} Achados Quáz</h2>
        </div>
        <button>Filtros</button>
      </section>

      <section className="offerList" aria-label="Lista de Achados Quáz">
        {offers.map((offer) => (
          <article className="offerCard" data-tone={offer.tone} key={offer.title}>
            <div className="offerMedia">
              <span>{offer.left}</span>
              <small>restam</small>
            </div>
            <div className="offerBody">
              <div>
                <span className="storeLine">{offer.store} · {offer.distance}</span>
                <h3>{offer.title}</h3>
                <p>{offer.pickup}</p>
              </div>
              <div className="priceRow">
                <span>{offer.oldPrice}</span>
                <strong>{offer.price}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      <nav className="bottomNav" aria-label="Navegação do app">
        <a href="#">Início</a>
        <a href="#">Pedidos</a>
        <a href="#">Impacto</a>
        <a href="#">Perfil</a>
      </nav>
    </main>
  );
}
