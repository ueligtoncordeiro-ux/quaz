"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { isAdminAuthenticated } from "../actions";

const allowedStatuses = new Set(["new", "contacted", "approved", "rejected"]);

export async function updateLeadStatus(formData: FormData) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return;
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !allowedStatuses.has(status)) {
    return;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("lead_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return;
  }

  revalidatePath("/admin/leads");
}
