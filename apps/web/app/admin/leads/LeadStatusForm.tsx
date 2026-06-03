"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "./actions";

const statusLabels: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

type Props = {
  leadId: string;
  currentStatus: string;
};

export function LeadStatusForm({ leadId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateLeadStatus(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="adminInlineForm">
      <input name="id" type="hidden" value={leadId} />
      <select
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="Alterar status"
        disabled={isPending}
      >
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <button type="submit" disabled={isPending}>
        {isPending ? "…" : "Salvar"}
      </button>
    </form>
  );
}
