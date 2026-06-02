"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions";

const initialState = {
  ok: false,
  message: ""
};

export function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [router, state.ok]);

  return (
    <form action={formAction} className="adminLogin">
      <label htmlFor="admin-password">Senha administrativa</label>
      <input
        id="admin-password"
        name="password"
        placeholder="Digite a senha"
        required
        type="password"
      />
      <button disabled={pending} type="submit">
        {pending ? "Entrando..." : "Entrar"}
      </button>
      {state.message ? (
        <p className={`adminMessage ${state.ok ? "success" : "error"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
