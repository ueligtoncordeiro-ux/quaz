import { LeadForm } from "../components/LeadForm";
import { SiteHeader } from "../components/SiteHeader";
import { partnerSteps } from "../data/site";

export default function SejaParceiroPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">seja parceiro</p>
          <h1>Venda mais do que ja estava pronto.</h1>
          <p className="lead">
            Publique Achados Quaz, reduza perdas e alcance consumidores que querem
            economizar sem abrir mao de comida boa.
          </p>
        </div>
      </section>

      <section className="split">
        <div>
          <p className="eyebrow">operacao simples</p>
          <h2>Seu excedente vira oportunidade.</h2>
          <p>
            No MVP, o cadastro de parceiros sera revisado manualmente para manter
            qualidade, suporte proximo e regras claras de retirada.
          </p>
        </div>
        <LeadForm kind="partner" />
      </section>

      <section className="section">
        <div className="steps">
          {partnerSteps.map((step) => (
            <article className="step" key={step.title}>
              <span>{step.title}</span>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
