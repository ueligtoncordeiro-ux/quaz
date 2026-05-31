import { SiteHeader } from "../components/SiteHeader";
import { pilotCities } from "../data/site";

export default function OndeEstamosPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">onde estamos</p>
          <h1>Primeiras cidades em preparacao para o piloto.</h1>
          <p className="lead">
            Estamos organizando a operação inicial por cidade, priorizando locais
            com parceiros interessados e demanda de consumidores.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="cityGrid">
          {pilotCities.map((city) => (
            <article className="city" key={city}>
              <span>{city}</span>
              <strong>em planejamento</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
