"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";

const styles = { button: { display: "inline-flex", minWidth: 0, minHeight: "44px", gap: "8px", alignItems: "center", padding: "0 18px", border: 0, borderRadius: "16px", background: "transparent", color: "var(--carbon)", font: "inherit", fontSize: "0.86rem", fontWeight: 700, cursor: "pointer" } };

export default function LogoutButton({ labels = {} }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button className="logout-button" style={styles.button} type="button" onClick={handleLogout} disabled={isLoggingOut}>
      <LogOut size={17} strokeWidth={2.2} aria-hidden="true" />
      {isLoggingOut ? labels.loggingOut || "Logging out..." : labels.logout || "Log out"}
    </button>
  );
}