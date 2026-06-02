import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "contato@quazdigraca.com.br";
const FROM = "Quáz di Graça <onboarding@resend.dev>";

type ConsumerLead = {
  kind: "consumer";
  email: string;
};

type PartnerLead = {
  kind: "partner";
  businessName: string;
  contact: string;
  businessType?: string | null;
  city?: string | null;
  email?: string | null;
  hours?: string | null;
};

export async function sendLeadNotification(lead: ConsumerLead | PartnerLead) {
  if (!resend) return;

  const isPartner = lead.kind === "partner";

  const subject = isPartner
    ? `🤝 Novo parceiro: ${(lead as PartnerLead).businessName}`
    : `👋 Novo consumidor na lista de espera`;

  const html = isPartner
    ? (() => {
        const p = lead as PartnerLead;
        const cell = (label: string, value: string) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#666;">${label}</td><td style="padding:6px 0;">${value}</td></tr>`;
        const rows = [
          cell("Estabelecimento", `<strong>${p.businessName}</strong>`),
          p.businessType ? cell("Tipo", p.businessType) : "",
          p.city ? cell("Cidade", p.city) : "",
          cell("WhatsApp", p.contact),
          p.email ? cell("E-mail", p.email) : "",
          p.hours ? cell("Horário", p.hours) : "",
        ].join("");
        return `
          <h2 style="color:#ff6900;">Novo cadastro de parceiro</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px;">${rows}</table>
          <p style="margin-top:24px;color:#888;font-size:13px;">Enviado via quazdigraca.com.br</p>
        `;
      })()
    : `
      <h2 style="color:#8ccf00;">Novo consumidor na lista de espera</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px;">
        <tr><td style="padding:6px 16px 6px 0;color:#666;">E-mail</td><td style="padding:6px 0;">${(lead as ConsumerLead).email}</td></tr>
      </table>
      <p style="margin-top:24px;color:#888;font-size:13px;">Enviado via quazdigraca.com.br</p>
    `;

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    subject,
    html,
  }).catch((err) => {
    console.error("[email] falha ao enviar notificação:", err);
  });
}
