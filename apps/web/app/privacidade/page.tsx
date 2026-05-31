import { SiteHeader } from "../components/SiteHeader";

export default function PrivacidadePage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">privacidade</p>
          <h1>Política de privacidade em elaboração.</h1>
          <p className="lead">
            Esta página vai detalhar dados coletados, finalidade, segurança e
            direitos dos usuários antes do lançamento.
          </p>
        </div>
      </section>
    </main>
  );
}
