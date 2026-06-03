"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase-server";
import { createSupabaseAdminClient } from "../../lib/supabase";

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/parceiros/entrar");
}

export async function partnerCreateAchado(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const store_id = String(formData.get("store_id") ?? "").trim();
  if (!store_id) return;

  // Verifica que a loja pertence ao usuário
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  const { data: store } = await admin
    .from("stores")
    .select("id")
    .eq("id", store_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!store) return;

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "outro").trim();
  const original_price = parseFloat(String(formData.get("original_price") ?? "0"));
  const sale_price = parseFloat(String(formData.get("sale_price") ?? "0"));
  const quantity = parseInt(String(formData.get("quantity") ?? "1"), 10);
  const pickup_start = String(formData.get("pickup_start") ?? "").trim();
  const pickup_end = String(formData.get("pickup_end") ?? "").trim();

  if (!title || !pickup_start || !pickup_end) return;
  if (isNaN(original_price) || isNaN(sale_price) || sale_price <= 0) return;
  if (original_price < sale_price) return;

  await admin.from("achados").insert({
    store_id,
    title,
    description,
    category,
    original_price,
    sale_price,
    quantity,
    pickup_start,
    pickup_end,
    status: "active",
  });

  revalidatePath("/parceiros/painel");
}

export async function partnerConfirmReservation(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const reservation_id = String(formData.get("reservation_id") ?? "");
  const store_id = String(formData.get("store_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!["confirmed", "cancelled", "no_show"].includes(status)) return;

  const admin = createSupabaseAdminClient();
  if (!admin) return;

  // Verifica ownership
  const { data: store } = await admin
    .from("stores")
    .select("id")
    .eq("id", store_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!store) return;

  await admin.from("reservations").update({ status }).eq("id", reservation_id).eq("store_id", store_id);
  revalidatePath("/parceiros/painel");
}
