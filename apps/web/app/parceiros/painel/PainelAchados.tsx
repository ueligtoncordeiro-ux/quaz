"use client";

import { useRef, useState, useTransition } from "react";
import { partnerCreateAchado } from "./actions";

type Props = {
  storeId: string;
  categories: string[];
  defaultStart: string;
  defaultEnd: string;
};

export function PainelAchados({ storeId, categories, defaultStart, defaultEnd }: Props) {
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await partnerCreateAchado(formData);
      setFormKey((k) => k + 1);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  }

  return (
    <form key={formKey} action={handleSubmit} className="achadoForm">
      <input type="hidden" name="store_id" value={storeId} />
      <div className="achadoFormGrid">
        <label className="achadoFull">
          <span>Título *</span>
          <input name="title" required placeholder="Ex: Combo surpresa de pães frescos" />
        </label>
        <label className="achadoFull">
          <span>Descrição</span>
          <input name="description" placeholder="O que o cliente vai receber (opcional)" />
        </label>
        <label>
          <span>Categoria *</span>
          <select name="category" required defaultValue="combo surpresa">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span>Preço original (R$) *</span>
          <input name="original_price" type="number" step="0.01" min="0.01" required placeholder="25,00" />
        </label>
        <label>
          <span>Preço Quáz (R$) *</span>
          <input name="sale_price" type="number" step="0.01" min="0.01" required placeholder="9,90" />
        </label>
        <label>
          <span>Quantidade *</span>
          <input name="quantity" type="number" min="1" required defaultValue="5" />
        </label>
        <label>
          <span>Retirada — início *</span>
          <input name="pickup_start" type="datetime-local" required defaultValue={defaultStart} />
        </label>
        <label>
          <span>Retirada — fim *</span>
          <input name="pickup_end" type="datetime-local" required defaultValue={defaultEnd} />
        </label>
      </div>
      {success && (
        <p style={{ color: "var(--green, #1a7f4b)", marginBottom: 8, fontWeight: 600 }}>
          ✓ Achado publicado com sucesso!
        </p>
      )}
      <button type="submit" className="adminDetailSave" disabled={isPending}>
        {isPending ? "Publicando…" : "Publicar achado"}
      </button>
    </form>
  );
}
