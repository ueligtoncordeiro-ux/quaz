import { brandColors } from "@quaz/config";
import { SiteHeader } from "./components/SiteHeader";

const steps = [
  {
    title: "Ache",
    text: "Encontre Achados Quaz perto de voce, com retirada no horario combinado."
  },
  {
    title: "Resgate",
    text: "Reserve e pague pelo app com uma experiencia simples, segura e transparente."
  },
  {
    title: "Aproveite",
    text: "Retire comida boa pagando menos e ajudando a reduzir desperdicio local."
  }
];

const benefits = [
  "Bom pro bolso: precos incriveis todos os dias.",
  "Bom pro planeta: menos desperdicio, mais futuro.",
  "Bom pra todos: comercios locais vendem mais e perdem menos."
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <SiteHeader />

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">ache. resgate. aproveite.</p>
            <h1 id="hero-title">Comida boa, preco quaz, desperdicio nao.</h1>
            <p className="lead">
              A Quaz di Graca conecta voce a restaurantes, padarias e mercados
              com Achados Quaz por precos muito reduzidos.
            </p>
            <div className="actions">
              <a className="button primary" href="#lista-espera">
                Entrar na lista
              </a>
              <a className="button secondary" href="/seja-parceiro">
                Quero ser parceiro
              </a>
            </div>
          </div>

          <div className="heroCard" aria-label="Previa do aplicativo">
            <div className="phone">
              <div className="phoneTop">
                <span>Proximos de voce</span>
                <strong>Sao Paulo, SP</strong>
              </div>
              <div className="offer">
                <div>
                  <span className="tag">Achado Quaz</span>
                  <h2>Padaria da Vila</h2>
                  <p>Combo surpresa de paes e doces</p>
                </div>
                <strong>R$ 9,90</strong>
              </div>
              <div className="offer green">
                <div>
                  <span className="tag">Retirada hoje</span>
                  <h2>Mercado Central</h2>
                  <p>Frutas e legumes selecionados</p>
                </div>
                <strong>R$ 12,90</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="como-funciona">
        <p className="eyebrow">Como funciona</p>
        <h2>Tres passos para salvar comida boa.</h2>
        <div className="steps">
          {steps.map((step) => (
            <article className="step" key={step.title}>
              <span>{step.title}</span>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <a className="textLink" href="/como-funciona">
          Ver detalhes do processo
        </a>
      </section>

      <section className="split" id="parceiros">
        <div>
          <p className="eyebrow">Para estabelecimentos</p>
          <h2>Venda o excedente antes que ele vire perda.</h2>
          <p>
            Parceiros publicam Achados Quaz, definem quantidade, preco e horario
            de retirada. A plataforma cuida da descoberta, pedido e suporte.
          </p>
        </div>
        <ul>
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>

      <section className="impact" id="impacto">
        <p className="eyebrow">Impacto positivo</p>
        <h2>Economia para pessoas, receita para comercios e menos desperdicio.</h2>
        <div className="metrics">
          <span style={{ backgroundColor: brandColors.orange }}>preco quaz</span>
          <span style={{ backgroundColor: brandColors.green }}>menos perda</span>
          <span style={{ backgroundColor: brandColors.purple }}>mais conexao</span>
        </div>
      </section>

      <section className="waitlist" id="lista-espera">
        <div>
          <p className="eyebrow">Piloto em breve</p>
          <h2>Entre na lista para acompanhar o lancamento.</h2>
        </div>
        <form>
          <label htmlFor="email">E-mail</label>
          <div>
            <input id="email" name="email" type="email" placeholder="voce@email.com" />
            <button type="submit">Quero saber</button>
          </div>
        </form>
      </section>
    </main>
  );
}
