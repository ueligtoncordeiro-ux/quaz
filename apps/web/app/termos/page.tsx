import { SiteHeader } from "../components/SiteHeader";

export default function TermosPage() {
  return (
    <main>
      <section className="pageHero">
        <SiteHeader />
        <div>
          <p className="eyebrow">termos de uso</p>
          <h1>Termos em elaboracao.</h1>
          <p className="lead">
            Esta página será substituída pelo documento jurídico final antes do
            piloto transacional.
          </p>
        </div>
      </section>
    </main>
  );
}
