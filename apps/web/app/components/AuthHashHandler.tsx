"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Detects Supabase implicit-flow tokens in the URL hash (#access_token=...)
 * and redirects the partner to their panel.
 */
export function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      // Clear the hash from the URL so it's not visible
      history.replaceState(null, "", window.location.pathname + window.location.search);
      router.replace("/parceiros/painel");
    }
  }, [router]);

  return null;
}
