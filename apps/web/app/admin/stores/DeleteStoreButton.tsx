"use client";

import { useTransition } from "react";
import { deleteStore } from "./actions";

export function DeleteStoreButton({ storeId, storeName }: { storeId: string; storeName: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Excluir "${storeName}"?\n\nEssa ação não pode ser desfeita.`)) return;
    const formData = new FormData();
    formData.set("id", storeId);
    startTransition(() => deleteStore(formData));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      style={{
        background: isPending ? "#999" : "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "6px 12px",
        cursor: isPending ? "not-allowed" : "pointer",
        fontSize: "0.8rem",
      }}
    >
      {isPending ? "…" : "Excluir"}
    </button>
  );
}
