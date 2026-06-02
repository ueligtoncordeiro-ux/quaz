import { SiteHeader } from "../components/SiteHeader";
import { faqs } from "../data/site";

export default function AjudaPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">central de ajuda</p>
          <h1>Dúvidas frequentes.</h1>
          <p className="lead">
            Tem alguma pergunta que não está aqui? Fale com a gente pelo
            formulário da página de parceiros ou entre na lista de espera.
          </p>
        </div>
      </section>

      <section className="section faqList">
        {faqs.map((item) => (
          <article className="faqItem" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
