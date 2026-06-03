"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "../../../lib/supabase";
import { isAdminAuthenticated } from "../../actions";

export async function createAchado(formData: FormData): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const store_id = String(formData.get("store_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "outro").trim();
  const original_price = parseFloat(String(formData.get("original_price") ?? "0"));
  const sale_price = parseFloat(String(formData.get("sale_price") ?? "0"));
  const quantity = parseInt(String(formData.get("quantity") ?? "1"), 10);
  const pickup_start = String(formData.get("pickup_start") ?? "").trim();
  const pickup_end = String(formData.get("pickup_end") ?? "").trim();

  if (!store_id || !title || !pickup_start || !pickup_end) return;
  if (isNaN(original_price) || isNaN(sale_price) || sale_price <= 0) return;
  if (original_price < sale_price) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("achados").insert({
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

  revalidatePath(`/admin/stores/${store_id}`);
  revalidatePath("/achados");
}

export async function updateAchadoStatus(formData: FormData): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const id = String(formData.get("id") ?? "");
  const store_id = String(formData.get("store_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["active", "sold_out", "expired", "cancelled"].includes(status)) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("achados").update({ status }).eq("id", id);
  revalidatePath(`/admin/stores/${store_id}`);
  revalidatePath("/achados");
}
