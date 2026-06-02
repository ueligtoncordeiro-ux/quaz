"use server";

import { cookies } from "next/headers";

const ADMIN_COOKIE = "quaz_admin";

function getAdminToken() {
  return process.env.ADMIN_ACCESS_TOKEN;
}

type AdminActionState = {
  ok: boolean;
  message: string;
};

export async function loginAdmin(
  _previousState: AdminActionState,
  formData: FormData
) {
  const token = getAdminToken();
  const password = String(formData.get("password") ?? "");

  if (!token) {
    return {
      ok: false,
      message: "ADMIN_ACCESS_TOKEN ainda não está configurado."
    };
  }

  if (password !== token) {
    return {
      ok: false,
      message: "Senha inválida."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8
  });

  return {
    ok: true,
    message: "Acesso liberado."
  };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0
  });
}

export async function isAdminAuthenticated() {
  const token = getAdminToken();

  if (!token) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === token;
}
