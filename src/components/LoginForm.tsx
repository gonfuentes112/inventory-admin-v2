"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ expired }: { expired: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      //does not use apiFetch, as a wrong password would return a 401 error, causing a loop
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
    <main className="mx-auto mt-24 w-full max-w-sm rounded border border-border p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      {expired && (
        <p
          role="status"
          className="rounded bg-warning-bg p-3 text-sm text-warning-fg"
        >
          Your session has expired. Please log in again.
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className=" text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            autoComplete="username"
            className="w-full rounded border border-border px-3 py-2 bg-background text-foreground"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className=" text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            autoComplete="current-password"
            className="w-full rounded border border-border px-3 py-2 bg-background text-foreground"
          />
        </div>

        {error && (
          <p role="alert" className="text-danger-fg">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded disabled:opacity-50 "
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
