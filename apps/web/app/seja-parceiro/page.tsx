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
          <h1>Venda mais do que já estava pronto.</h1>
          <p className="lead">
            Publique Achados Quáz, reduza perdas e alcance consumidores que querem
            economizar sem abrir mão de comida boa.
          </p>
        </div>
      </section>

      <section className="split">
        <div>
          <p className="eyebrow">operação simples</p>
          <h2>Seu excedente vira oportunidade.</h2>
          <p>
            No MVP, o cadastro de parceiros será revisado manualmente para manter
            qualidade, suporte próximo e regras claras de retirada.
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
