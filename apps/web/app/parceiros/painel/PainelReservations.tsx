"use client";

import { partnerConfirmReservation } from "./actions";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  code: string;
  status: string;
  created_at: string;
  achados: { title: string; pickup_end: string } | { title: string; pickup_end: string }[] | null;
};

function formatTime(v: string) {
  return new Date(v).toLocaleTimeString("pt-BR", {
    timeZone: "America/Cuiaba",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PainelReservations({ reservations, storeId }: { reservations: Reservation[]; storeId: string }) {
  const pending = reservations.filter((r) => r.status === "pending");

  if (pending.length === 0) {
    return (
      <div style={{ padding: "20px 0", color: "var(--ink-soft)" }}>
        Nenhuma reserva pendente no momento. 🎉
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 16 }}>Reservas para confirmar <span className="adminBadge consumer">{pending.length}</span></h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {pending.map((r) => {
          const achado = Array.isArray(r.achados) ? r.achados[0] : r.achados;
          return (
            <div key={r.id} className="painelReservaCard">
              <div className="painelReservaCode">{r.code}</div>
              <div className="painelReservaInfo">
                <strong>{r.name}</strong>
                <span>{r.phone}</span>
                {achado && (
                  <span style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>
                    {achado.title} · até {formatTime(achado.pickup_end)}
                  </span>
                )}
              </div>
              <div className="painelReservaActions">
                <form action={partnerConfirmReservation}>
                  <input type="hidden" name="reservation_id" value={r.id} />
                  <input type="hidden" name="store_id" value={storeId} />
                  <input type="hidden" name="status" value="confirmed" />
                  <button type="submit" className="painelConfirmBtn">✓ Confirmado</button>
                </form>
                <form action={partnerConfirmReservation}>
                  <input type="hidden" name="reservation_id" value={r.id} />
                  <input type="hidden" name="store_id" value={storeId} />
                  <input type="hidden" name="status" value="no_show" />
                  <button type="submit" className="painelNoShowBtn">✗ Não veio</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
