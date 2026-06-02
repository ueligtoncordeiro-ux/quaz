import { SiteHeader } from "../components/SiteHeader";
import { pilotCities } from "../data/site";

export default function OndeEstamosPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">onde estamos</p>
          <h1>Primeiras cidades do lançamento.</h1>
          <p className="lead">
            Estamos chegando em cidades com parceiros interessados e consumidores
            prontos para economizar e reduzir desperdício.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="cityGrid">
          {pilotCities.map((city) => (
            <article className="city" key={city}>
              <span>{city}</span>
              <strong>em breve</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
