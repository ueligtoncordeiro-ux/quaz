import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../lib/supabase";
import { sendLeadNotification } from "../../lib/email";

type LeadPayload =
  | {
      kind: "consumer";
      email: string;
    }
  | {
      kind: "partner";
      businessName: string;
      contact: string;
    };

type LeadSubmissionRow = {
  kind: "consumer" | "partner";
  email: string | null;
  contact: string | null;
  business_name: string | null;
  source: "web";
  user_agent: string | null;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parsePayload(payload: unknown): LeadPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;

  if (data.kind === "consumer" && typeof data.email === "string") {
    const email = data.email.trim().toLowerCase();

    if (!isEmail(email)) {
      return null;
    }

    return { kind: "consumer", email };
  }

  if (
    data.kind === "partner" &&
    typeof data.businessName === "string" &&
    typeof data.contact === "string"
  ) {
    const businessName = data.businessName.trim();
    const contact = data.contact.trim();

    if (!businessName || contact.length < 5) {
      return null;
    }

    return { kind: "partner", businessName, contact };
  }

  return null;
}

export async function POST(request: Request) {
  const payload = parsePayload(await request.json().catch(() => null));

  if (!payload) {
    return NextResponse.json(
      { message: "Dados inválidos. Revise as informações e tente novamente." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "Supabase ainda não está configurado. Crie o projeto grátis e preencha as variáveis de ambiente."
      },
      { status: 503 }
    );
  }

  const row: LeadSubmissionRow =
    payload.kind === "consumer"
      ? {
          kind: payload.kind,
          email: payload.email,
          business_name: null,
          contact: null,
          source: "web",
          user_agent: request.headers.get("user-agent")
        }
      : {
          kind: payload.kind,
          email: null,
          business_name: payload.businessName,
          contact: payload.contact,
          source: "web",
          user_agent: request.headers.get("user-agent")
        };

  const { error } = await supabase.from("lead_submissions").insert(row);

  if (error) {
    return NextResponse.json(
      { message: "Não foi possível registrar o interesse agora." },
      { status: 500 }
    );
  }

  // Notificação por e-mail — não bloqueia a resposta em caso de falha
  await sendLeadNotification(
    payload.kind === "consumer"
      ? { kind: "consumer", email: payload.email }
      : { kind: "partner", businessName: payload.businessName, contact: payload.contact }
  );

  return NextResponse.json({
    message: "Interesse registrado com sucesso."
  });
}
