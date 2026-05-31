import { SiteHeader } from "../components/SiteHeader";
import { consumerSteps, partnerSteps } from "../data/site";

export default function ComoFuncionaPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">como funciona</p>
          <h1>Ache, resgate e aproveite comida boa por preco quaz.</h1>
          <p className="lead">
            A Quaz di Graca conecta consumidores a estabelecimentos com excedentes
            e ofertas de ultima hora, com retirada combinada e impacto positivo.
          </p>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Para consumidores</p>
        <h2>Um fluxo simples para economizar.</h2>
        <div className="steps">
          {consumerSteps.map((step) => (
            <article className="step" key={step.title}>
              <span>{step.title}</span>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Para parceiros</p>
        <h2>Transforme excedente em receita.</h2>
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
