import { LoginForm } from "./LoginForm";

const erroMessages: Record<string, string> = {
  "link-expirado": "O link de acesso expirou. Solicite um novo abaixo.",
  "link-invalido": "O link de acesso é inválido ou já foi usado. Solicite um novo abaixo.",
};

type PageProps = { searchParams: Promise<{ erro?: string }> };

export default async function PartnerLoginPage({ searchParams }: PageProps) {
  const { erro } = await searchParams;
  const erroMsg = erro ? (erroMessages[erro] ?? "Ocorreu um erro. Tente novamente.") : null;

  return (
    <main className="authShell">
      <div className="authCard">
        <p className="eyebrow" style={{ textAlign: "center" }}>Painel do Parceiro</p>
        <h1 style={{ textAlign: "center", marginBottom: 4 }}>Entrar</h1>
        <p style={{ textAlign: "center", color: "var(--ink-soft)", marginBottom: erroMsg ? 12 : 28, marginTop: 0 }}>
          Receba um link de acesso no seu e-mail. Sem senha!
        </p>
        {erroMsg && (
          <p style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
            fontSize: "0.9rem",
            color: "#856404",
            textAlign: "center",
          }}>
            ⚠️ {erroMsg}
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
