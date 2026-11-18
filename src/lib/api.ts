// Full reload on purpose: apiFetch is not a component (no useRouter), and
// a hard navigation discards all in-memory state from the expired session.
// eslint-disable-next-line @next/next/no-location-assign-relative-destination
window.location.assign("/login?expired=1");
export async function apiFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    window.location.assign("/login?expired=1");
  }
  return res;
}
