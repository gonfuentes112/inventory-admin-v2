import { NextRequest } from "next/server";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
  const base = process.env.API_BASE_URL;
  if (!base) {
    return Response.json({ detail: "Server misconfigured" }, { status: 500 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  let upstream: Response;

  try {
    upstream = await fetch(`${base}/users/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("Upstream connection error:", e);

    return Response.json(
      { detail: "Login service unavailable" },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const errorText = await upstream.text();

    const headers = new Headers();

    headers.set(
      "content-type",
      upstream.headers.get("content-type") || "application/json",
    );

    const retryAfter = upstream.headers.get("retry-after");

    if (retryAfter) {
      headers.set("retry-after", retryAfter);
    }

    return new Response(errorText, {
      status: upstream.status,
      headers,
    });
  }

  let data;

  try {
    data = await upstream.json();
  } catch {
    return Response.json(
      { detail: "Invalid response from login service" },
      { status: 502 },
    );
  }

  const access_token = data.access_token;

  if (typeof access_token !== "string" || !access_token) {
    return Response.json({ detail: "Missing access token" }, { status: 502 });
  }

  try {
    const cookieStore = await cookies();

    cookieStore.set("token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    });
  } catch (e) {
    console.error("Cookie error:", e);

    return Response.json(
      { detail: "Failed to establish session" },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
