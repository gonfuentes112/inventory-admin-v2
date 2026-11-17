"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/");
        return;
      }
      if (res.status === 401) {
        setError("Invalid username or password");
      } else if (res.status === 429) {
        const retryAfter = res.headers.get("retry-after");

        setError(
          retryAfter
            ? `Too many attempts. Try again in ${retryAfter} seconds.`
            : "Too many attempts",
        );
      } else {
        setError("Something went wrong, please try again");
      }
    } catch {
      setError("Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          autoComplete="username"
        />
        <label htmlFor="username">Username</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          autoComplete="current-password"
        />
        <label htmlFor="password">Password</label>
        <br />
        {error && <p role="alert">{error}</p>}
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
