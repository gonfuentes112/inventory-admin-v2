"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

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
    <Button type="button" onClick={handleLogout}>
      Logout
    </Button>
  );
}
