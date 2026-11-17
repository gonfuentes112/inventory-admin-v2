import { NextRequest } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const base = process.env.API_BASE_URL;
  if (!base)
    return Response.json({ detail: "Server misconfigured" }, { status: 500 });
  const { path } = await params;
  const upstreamUrl = `${base}/${path.join("/")}` + request.nextUrl.search;

  const token = request.cookies.get("token")?.value;

  const headers = new Headers();

  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const method = request.method;
  const body = method !== "GET" ? await request.text() : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, { method, headers, body });
  } catch (e) {
    console.error("proxy error:", e);
    return Response.json({ detail: "Upstream unavailable" }, { status: 502 });
  }

  const responseHeaders = new Headers();

  const retryAfter = upstream.headers.get("retry-after");

  if (retryAfter) {
    responseHeaders.set("retry-after", retryAfter);
  }

  const responseBody = upstream.status === 204 ? null : await upstream.text();

  if (responseBody !== null) {
    responseHeaders.set(
      "content-type",
      upstream.headers.get("content-type") || "application/json",
    );
  }

  return new Response(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
