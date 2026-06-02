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
          <h1>Transforme sobras em novas vendas.</h1>
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
            Preencha o formulário ao lado e nossa equipe entra em contato para
            apresentar a plataforma, tirar dúvidas e apoiar o seu cadastro.
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
