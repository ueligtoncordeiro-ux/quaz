import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "../../../actions";
import { promoteLeadToStore } from "../../../stores/actions";
import { createSupabaseAdminClient } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

async function getLead(id: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("lead_submissions")
    .select("id, business_name, city, phone, email, notes, kind")
    .eq("id", id)
    .maybeSingle();
  return data;
}

function parseNote(notes: string | null, key: string) {
  if (!notes) return "";
  const match = notes.match(new RegExp(`${key}: ([^|]+)`));
  return match?.[1]?.trim() ?? "";
}

export default async function PromoverLeadPage({ params }: PageProps) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/leads");

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead || lead.kind !== "partner") notFound();

  return (
    <main className="adminShell">
      <section className="adminTop">
        <div>
          <p className="eyebrow">leads</p>
          <h1>Promover parceiro</h1>
          <p className="lead">Cria uma loja ativa a partir de <strong>{lead.business_name}</strong>.</p>
        </div>
        <nav className="adminNav">
          <Link href="/admin/leads" className="adminGhostButton">← Leads</Link>
        </nav>
      </section>

      <section className="adminCard">
        <form action={promoteLeadToStore} className="adminDetailForm">
          <input type="hidden" name="lead_id" value={lead.id} />
          <div className="adminDetailGrid">
            <label>
              <span>Nome da loja *</span>
              <input name="name" required defaultValue={lead.business_name ?? ""} />
            </label>
            <label>
              <span>Tipo de negócio</span>
              <input name="type" defaultValue={parseNote(lead.notes, "Tipo")} placeholder="Ex: Padaria" />
            </label>
            <label>
              <span>Cidade *</span>
              <input name="city" required defaultValue={lead.city ?? ""} />
            </label>
            <label>
              <span>Telefone / WhatsApp</span>
              <input name="phone" defaultValue={lead.phone ?? ""} />
            </label>
            <label>
              <span>E-mail</span>
              <input name="email" type="email" defaultValue={lead.email ?? ""} />
            </label>
            <label>
              <span>Horário</span>
              <input name="hours" defaultValue={parseNote(lead.notes, "Horário")} placeholder="Ex: Seg–Sex 7h–19h" />
            </label>
            <label className="adminDetailFull">
              <span>Endereço</span>
              <input name="address" placeholder="Rua, número, bairro" />
            </label>
          </div>
          <button type="submit" className="adminDetailSave">✓ Criar loja ativa</button>
        </form>
      </section>
    </main>
  );
}
