import { SiteHeader } from "../components/SiteHeader";

export default function PrivacidadePage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">privacidade</p>
          <h1>Politica de privacidade em elaboracao.</h1>
          <p className="lead">
            Esta pagina vai detalhar dados coletados, finalidade, seguranca e
            direitos dos usuarios antes do lancamento.
          </p>
        </div>
      </section>
    </main>
  );
}
