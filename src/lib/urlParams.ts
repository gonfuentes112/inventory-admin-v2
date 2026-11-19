export function withUpdates(
  current: URLSearchParams,
  updates: Record<string, string | null>,
): URLSearchParams {
  const params = new URLSearchParams(current);

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  if (!("page" in updates)) {
    params.delete("page");
  }

  return params;
}
