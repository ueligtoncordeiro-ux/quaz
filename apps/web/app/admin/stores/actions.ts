"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { isAdminAuthenticated } from "../actions";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, base: string) {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const { data } = await supabase.from("stores").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    suffix++;
  }
}

export async function promoteLeadToStore(formData: FormData): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const leadId = String(formData.get("lead_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const hours = String(formData.get("hours") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (!leadId || !name || !city) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const slug = await uniqueSlug(supabase, name);

  const { error } = await supabase.from("stores").insert({
    lead_id: leadId,
    slug,
    name,
    type,
    city,
    phone,
    email,
    hours,
    address,
    status: "active",
  });

  if (error) return;

  await supabase.from("lead_submissions").update({ status: "approved" }).eq("id", leadId);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/stores");
}

export async function updateStoreStatus(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["pending", "active", "inactive"].includes(status)) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("stores").update({ status }).eq("id", id);
  revalidatePath("/admin/stores");
}
