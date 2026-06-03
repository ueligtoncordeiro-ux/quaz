import { LoginForm } from "./LoginForm";

export default function PartnerLoginPage() {
  return (
    <main className="authShell">
      <div className="authCard">
        <p className="eyebrow" style={{ textAlign: "center" }}>Painel do Parceiro</p>
        <h1 style={{ textAlign: "center", marginBottom: 4 }}>Entrar</h1>
        <p style={{ textAlign: "center", color: "var(--ink-soft)", marginBottom: 28, marginTop: 0 }}>
          Receba um link de acesso no seu e-mail. Sem senha!
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
