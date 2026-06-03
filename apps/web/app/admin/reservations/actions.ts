"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { isAdminAuthenticated } from "../actions";

export async function updateReservationStatus(formData: FormData): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["pending", "confirmed", "cancelled", "no_show"].includes(status)) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("reservations").update({ status }).eq("id", id);
  revalidatePath("/admin/reservations");
}
