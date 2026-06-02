"use client";

import { FormEvent, useState } from "react";

const BUSINESS_TYPES = [
  "Padaria / Confeitaria",
  "Restaurante",
  "Lanchonete / Cafeteria",
  "Mercado / Mercearia",
  "Açougue / Peixaria",
  "Frutaria / Hortifruti",
  "Outro",
];

export function PartnerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      kind: "partner",
      businessName: String(fd.get("businessName") ?? "").trim(),
      businessType: String(fd.get("businessType") ?? "").trim(),
      city: String(fd.get("city") ?? "").trim(),
      whatsapp: String(fd.get("whatsapp") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim() || null,
      hours: String(fd.get("hours") ?? "").trim() || null,
    };

    let response: Response;
    try {
      response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setStatus("error");
      setMessage("Não foi possível conectar agora. Tente novamente em instantes.");
      return;
    }

    const result = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(result?.message ?? "Não foi possível enviar agora.");
      return;
    }

    setStatus("success");
    setMessage(result?.message ?? "Cadastro recebido!");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="partnerSuccess">
        <span className="partnerSuccessIcon">🎉</span>
        <h3>Cadastro recebido!</h3>
        <p>
          Nossa equipe vai entrar em contato pelo WhatsApp informado em até 2 dias
          úteis para apresentar a plataforma e apoiar o seu onboarding.
        </p>
      </div>
    );
  }

  return (
    <form className="partnerForm" onSubmit={handleSubmit}>
      <div className="partnerFormRow">
        <label htmlFor="businessName">
          Nome do estabelecimento <span aria-hidden>*</span>
        </label>
        <input
          id="businessName"
          name="businessName"
          placeholder="Ex: Padaria São João"
          required
        />
      </div>

      <div className="partnerFormRow">
        <label htmlFor="businessType">
          Tipo de negócio <span aria-hidden>*</span>
        </label>
        <select id="businessType" name="businessType" required defaultValue="">
          <option value="" disabled>Selecione…</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="partnerFormRow">
        <label htmlFor="city">
          Cidade <span aria-hidden>*</span>
        </label>
        <input
          id="city"
          name="city"
          placeholder="Ex: Tangará da Serra"
          required
        />
      </div>

      <div className="partnerFormRow">
        <label htmlFor="whatsapp">
          WhatsApp <span aria-hidden>*</span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="(65) 9 9999-9999"
          required
        />
      </div>

      <div className="partnerFormRow">
        <label htmlFor="email">E-mail (opcional)</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="contato@seuestablecimento.com"
        />
      </div>

      <div className="partnerFormRow">
        <label htmlFor="hours">Horário de funcionamento (opcional)</label>
        <input
          id="hours"
          name="hours"
          placeholder="Ex: Seg–Sex 7h–19h, Sáb 7h–13h"
        />
      </div>

      <button
        className="button primary"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Enviando…" : "Quero ser parceiro Quáz"}
      </button>

      {status === "error" ? (
        <p className="formMessage error" aria-live="polite" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
