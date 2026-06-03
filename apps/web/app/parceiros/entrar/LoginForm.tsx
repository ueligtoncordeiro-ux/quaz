"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/parceiros/auth/callback`,
      },
    });

    setLoading(false);

    if (err) {
      setError("Não foi possível enviar o link. Verifique o e-mail e tente novamente.");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="authSuccess">
        <p className="authSuccessIcon">✉️</p>
        <p className="authSuccessTitle">Link enviado!</p>
        <p className="authSuccessHint">
          Verifique sua caixa de entrada em <strong>{email}</strong> e clique no link para acessar o painel.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="authForm">
      {error && <p className="reserveError">{error}</p>}
      <label className="reserveLabel">
        <span>E-mail cadastrado</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="voce@seurestaurante.com"
          autoFocus
        />
      </label>
      <button type="submit" className="reserveButton" disabled={loading}>
        {loading ? "Enviando…" : "Enviar link de acesso →"}
      </button>
    </form>
  );
}
