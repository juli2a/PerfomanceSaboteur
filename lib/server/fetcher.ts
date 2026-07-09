import { DUMMYJSON_API } from "@/lib/config";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${DUMMYJSON_API}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`[DummyJSON] ${path} → ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
