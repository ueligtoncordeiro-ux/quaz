import { SiteHeader } from "../components/SiteHeader";

export default function TermosPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">termos de uso</p>
          <h1>Termos de Uso.</h1>
          <p className="lead">
            Ao usar a plataforma Quáz di Graça, você concorda com as condições
            descritas neste documento. Última atualização: junho de 2025.
          </p>
        </div>
      </section>
    </main>
  );
}
