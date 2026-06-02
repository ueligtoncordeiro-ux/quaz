import { SiteHeader } from "../components/SiteHeader";

export default function PrivacidadePage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">privacidade</p>
          <h1>Política de Privacidade.</h1>
          <p className="lead">
            A Quáz di Graça respeita sua privacidade. Esta política descreve como
            coletamos, usamos e protegemos seus dados. Última atualização: junho de 2025.
          </p>
        </div>
      </section>
    </main>
  );
}
