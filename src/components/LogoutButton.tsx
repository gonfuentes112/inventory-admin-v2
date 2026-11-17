"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        router.push("/login");
        return;
      }
      console.error("Logout failed:", res.status);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}
