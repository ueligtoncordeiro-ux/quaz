"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { sendReservationConfirmation } from "../../lib/email";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I pra evitar confusão
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export type ReserveResult =
  | { ok: true; code: string; achadoTitle: string; storeName: string; pickupEnd: string }
  | { error: string };

export async function createReservation(formData: FormData): Promise<ReserveResult> {
  const achado_id = String(formData.get("achado_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!achado_id || !name || !phone) return { error: "Preencha nome e WhatsApp." };
  if (phone.replace(/\D/g, "").length < 10) return { error: "WhatsApp inválido." };

  const supabase = createSupabaseAdminClient();
  if (!supabase) return { error: "Erro interno. Tente novamente." };

  // Busca achado + loja com lock implícito
  const { data: achado } = await supabase
    .from("achados")
    .select("id, title, store_id, quantity, quantity_reserved, pickup_end, status, stores(name)")
    .eq("id", achado_id)
    .eq("status", "active")
    .maybeSingle();

  if (!achado) return { error: "Achado não encontrado ou indisponível." };

  const available = achado.quantity - achado.quantity_reserved;
  if (available <= 0) return { error: "Esgotado! Todas as unidades já foram reservadas." };

  // Verifica se já tem reserva ativa do mesmo telefone
  const { data: existing } = await supabase
    .from("reservations")
    .select("id")
    .eq("achado_id", achado_id)
    .eq("phone", phone.replace(/\D/g, ""))
    .in("status", ["pending", "confirmed"])
    .maybeSingle();

  if (existing) return { error: "Você já tem uma reserva ativa para este achado." };

  const code = generateCode();
  const phoneClean = phone.replace(/\D/g, "");

  // Insere reserva
  const { error: insertErr } = await supabase.from("reservations").insert({
    achado_id,
    store_id: achado.store_id,
    name,
    phone: phoneClean,
    code,
    status: "pending",
  });

  if (insertErr) return { error: "Não foi possível criar a reserva. Tente novamente." };

  // Incrementa quantity_reserved
  await supabase
    .from("achados")
    .update({ quantity_reserved: achado.quantity_reserved + 1 })
    .eq("id", achado_id);

  // Envia e-mail de confirmação (se tiver e-mail disponível)
  const emailParam = String(formData.get("email") ?? "").trim();
  if (emailParam) {
    const storeName = Array.isArray(achado.stores) ? achado.stores[0]?.name : (achado.stores as { name: string } | null)?.name ?? "";
    await sendReservationConfirmation({
      to: emailParam,
      name,
      code,
      achadoTitle: achado.title,
      storeName,
      pickupEnd: achado.pickup_end,
    }).catch(() => {}); // não falha a reserva se o email falhar
  }

  revalidatePath(`/achados/${achado_id}`);
  revalidatePath("/achados");

  const storeName = Array.isArray(achado.stores) ? achado.stores[0]?.name : (achado.stores as { name: string } | null)?.name ?? "";

  return {
    ok: true,
    code,
    achadoTitle: achado.title,
    storeName,
    pickupEnd: achado.pickup_end,
  };
}
