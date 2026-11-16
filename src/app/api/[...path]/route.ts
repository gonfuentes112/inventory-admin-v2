import { NextRequest } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const upstreamUrl =
    `${process.env.API_BASE_URL}/${path.join("/")}` + request.nextUrl.search;

  try {
    const upstream = await fetch(upstreamUrl);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e) {
    const base = process.env.API_BASE_URL;
    if (!base)
      return Response.json({ detail: "Server misconfigured" }, { status: 500 });
    console.error("proxy error:", e);
    return Response.json({ detail: "Upstream unavailable" }, { status: 502 });
  }
}
