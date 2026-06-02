import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "../../../lib/supabase";

async function isAuthenticated() {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) return false;
  const cookieStore = await cookies();
  return cookieStore.get("quaz_admin")?.value === token;
}

function escapeCSV(value: string | null | undefined) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/leads", req.url));
  }

  const { searchParams } = req.nextUrl;
  const kind = searchParams.get("kind");
  const status = searchParams.get("status");

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return new NextResponse("Supabase não configurado", { status: 500 });
  }

  let query = supabase
    .from("lead_submissions")
    .select("id, kind, email, contact, business_name, source, status, city, phone, notes, handled_by, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (kind === "consumer" || kind === "partner") query = query.eq("kind", kind);
  if (status && ["new", "contacted", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return new NextResponse("Erro ao buscar leads", { status: 500 });
  }

  const headers = ["id", "tipo", "email", "contato", "estabelecimento", "cidade", "telefone", "status", "origem", "responsavel", "observacoes", "criado_em"];
  const rows = (data ?? []).map((lead) => [
    lead.id,
    lead.kind === "partner" ? "Parceiro" : "Consumidor",
    lead.email,
    lead.contact,
    lead.business_name,
    lead.city,
    lead.phone,
    lead.status,
    lead.source,
    lead.handled_by,
    lead.notes,
    new Date(lead.created_at).toLocaleString("pt-BR", { timeZone: "America/Cuiaba" }),
  ].map(escapeCSV).join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  const filename = `leads-quaz-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
