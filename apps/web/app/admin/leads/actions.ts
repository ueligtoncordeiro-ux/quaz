"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { isAdminAuthenticated } from "../actions";

const allowedStatuses = new Set(["new", "contacted", "approved", "rejected"]);

export async function updateLeadStatus(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const redirectTo = String(formData.get("redirect_to") ?? "/admin/leads");

  if (!id || !allowedStatuses.has(status)) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("lead_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/leads");
  redirect(redirectTo);
}

export async function updateLeadDetails(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const city = String(formData.get("city") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const handled_by = String(formData.get("handled_by") ?? "").trim() || null;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase
    .from("lead_submissions")
    .update({ city, phone, notes, handled_by })
    .eq("id", id);

  revalidatePath("/admin/leads");
}
