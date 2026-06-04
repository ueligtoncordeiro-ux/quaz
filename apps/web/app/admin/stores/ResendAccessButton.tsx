"use client";

import { useTransition, useState } from "react";
import { resendPartnerAccess } from "./actions";

export function ResendAccessButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleClick() {
    const formData = new FormData();
    formData.set("email", email);
    startTransition(async () => {
      await resendPartnerAccess(formData);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    });
  }

  if (sent) {
    return (
      <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>
        ✓ Enviado
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      style={{
        background: "transparent",
        border: "1.5px solid rgba(36,0,61,0.2)",
        borderRadius: 8,
        padding: "5px 10px",
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "var(--purple)",
        cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.6 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {isPending ? "…" : "↗ Reenviar acesso"}
    </button>
  );
}
