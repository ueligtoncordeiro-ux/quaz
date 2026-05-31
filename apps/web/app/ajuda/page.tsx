import { SiteHeader } from "../components/SiteHeader";
import { faqs } from "../data/site";

export default function AjudaPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">central de ajuda</p>
          <h1>Respostas rápidas para consumidores e parceiros.</h1>
          <p className="lead">
            Esta central será expandida junto com o piloto. Por enquanto, ela
            registra as dúvidas principais da experiência.
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
