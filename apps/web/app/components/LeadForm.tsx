"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  kind: "consumer" | "partner";
};

export function LeadForm({ kind }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload =
      kind === "consumer"
        ? {
            kind,
            email: String(formData.get("email") ?? "")
          }
        : {
            kind,
            businessName: String(formData.get("business") ?? ""),
            contact: String(formData.get("contact") ?? "")
          };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(result?.message ?? "Não foi possível enviar agora.");
      return;
    }

    setStatus("success");
    setMessage(result?.message ?? "Interesse registrado com sucesso.");
    form.reset();
  }

  if (kind === "partner") {
    return (
      <form className="leadForm" onSubmit={handleSubmit}>
        <label htmlFor="business">Nome do estabelecimento</label>
        <input
          id="business"
          name="business"
          placeholder="Padaria, mercado ou restaurante"
          required
        />
        <label htmlFor="contact">Contato</label>
        <input
          id="contact"
          name="contact"
          placeholder="WhatsApp ou e-mail"
          required
        />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Entrar na lista de parceiros"}
        </button>
        {status === "success" || status === "error" ? (
          <p className={`formMessage ${status}`} role="status">
            {message}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form className="leadForm compact" onSubmit={handleSubmit}>
      <label htmlFor="email">E-mail</label>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
        />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Quero saber"}
        </button>
      </div>
      {status === "success" || status === "error" ? (
        <p className={`formMessage ${status}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
