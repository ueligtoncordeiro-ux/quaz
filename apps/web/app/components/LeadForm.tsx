"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  kind: "consumer" | "partner";
};

export function LeadForm({ kind }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("success");
    event.currentTarget.reset();
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
        <button type="submit">Entrar na lista de parceiros</button>
        {status === "success" ? (
          <p className="formMessage" role="status">
            Recebido. Na próxima etapa vamos conectar este formulário ao banco.
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
        <button type="submit">Quero saber</button>
      </div>
      {status === "success" ? (
        <p className="formMessage" role="status">
          Pronto. Seu interesse foi registrado nesta experiência local.
        </p>
      ) : null}
    </form>
  );
}
