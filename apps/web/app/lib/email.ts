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

type ReservationConfirmation = {
  to: string;
  name: string;
  code: string;
  achadoTitle: string;
  storeName: string;
  pickupEnd: string;
};

export async function sendReservationConfirmation(data: ReservationConfirmation) {
  if (!resend) return;

  const pickupFormatted = new Date(data.pickupEnd).toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#ff6900;margin-bottom:4px;">Reserva confirmada! 🎉</h2>
      <p style="color:#666;margin-top:0;">Seu Achado Quáz está guardado.</p>

      <div style="background:#fff7e8;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
        <p style="margin:0 0 8px;color:#666;font-size:14px;">SEU CÓDIGO</p>
        <p style="margin:0;font-size:2.5rem;font-weight:900;letter-spacing:0.15em;color:#24003d;">${data.code}</p>
      </div>

      <table style="border-collapse:collapse;font-size:15px;width:100%;">
        <tr>
          <td style="padding:8px 16px 8px 0;color:#888;white-space:nowrap;">Achado</td>
          <td style="padding:8px 0;font-weight:700;">${data.achadoTitle}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px 8px 0;color:#888;white-space:nowrap;">Loja</td>
          <td style="padding:8px 0;">${data.storeName}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px 8px 0;color:#888;white-space:nowrap;">Retirar até</td>
          <td style="padding:8px 0;">${pickupFormatted}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px 8px 0;color:#888;white-space:nowrap;">Seu nome</td>
          <td style="padding:8px 0;">${data.name}</td>
        </tr>
      </table>

      <p style="margin-top:24px;font-size:14px;color:#666;">
        Apresente este código na loja na hora da retirada. Sem necessidade de pagamento antecipado!
      </p>
      <p style="margin-top:16px;font-size:12px;color:#aaa;">Quáz di Graça · quazdigraca.com.br</p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Seu código Quáz: ${data.code} — ${data.achadoTitle}`,
    html,
  }).catch((err) => {
    console.error("[email] falha ao enviar confirmação de reserva:", err);
  });
}

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
