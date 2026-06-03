"use client";

import { partnerCreateAchado } from "./actions";

type Props = {
  storeId: string;
  categories: string[];
  defaultStart: string;
  defaultEnd: string;
};

export function PainelAchados({ storeId, categories, defaultStart, defaultEnd }: Props) {
  return (
    <form action={partnerCreateAchado} className="achadoForm">
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
      <button type="submit" className="adminDetailSave">Publicar achado</button>
    </form>
  );
}
