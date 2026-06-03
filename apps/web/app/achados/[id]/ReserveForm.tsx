"use client";

import { useActionState } from "react";
import { createReservation, ReserveResult } from "./actions";

const initialState: ReserveResult | null = null;

function formatTime(v: string) {
  return new Date(v).toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReserveForm({ achadoId }: { achadoId: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: ReserveResult | null, formData: FormData) => createReservation(formData),
    initialState
  );

  if (state && "ok" in state && state.ok) {
    return (
      <div className="reserveSuccess">
        <div className="reserveCode">{state.code}</div>
        <p className="reserveSuccessTitle">Reserva confirmada! 🎉</p>
        <p className="reserveSuccessInfo">
          <strong>{state.achadoTitle}</strong> em <strong>{state.storeName}</strong>
        </p>
        <p className="reserveSuccessPickup">Retire até {formatTime(state.pickupEnd)}</p>
        <p className="reserveSuccessHint">
          Apresente este código na loja. Não precisa de pagamento antecipado!
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="reserveForm">
      <input type="hidden" name="achado_id" value={achadoId} />
      <h3 className="reserveTitle">Reservar agora</h3>
      <p className="reserveHint">Gratuito. Sem cadastro. Só aparecer na hora!</p>

      {state && "error" in state && (
        <p className="reserveError">{state.error}</p>
      )}

      <label className="reserveLabel">
        <span>Seu nome *</span>
        <input name="name" required placeholder="Como prefere ser chamado?" />
      </label>
      <label className="reserveLabel">
        <span>WhatsApp *</span>
        <input name="phone" type="tel" required placeholder="(65) 99999-9999" />
      </label>
      <label className="reserveLabel">
        <span>E-mail <em>(opcional — para receber o código)</em></span>
        <input name="email" type="email" placeholder="seu@email.com" />
      </label>

      <button type="submit" className="reserveButton" disabled={pending}>
        {pending ? "Reservando…" : "Confirmar reserva →"}
      </button>
    </form>
  );
}
