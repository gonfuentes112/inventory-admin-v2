"use client";

import { useState, useEffect } from "react";
import type { Product, Paginated } from "@/types/api";
import { apiFetch } from "@/lib/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Button from "./Button";

const LOW_STOCK_THRESHOLD = 10;
const PAGE_SIZE = 20;

export default function ProductList() {
  const [data, setData] = useState<Paginated<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const requestedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch(
          `/api/products?page=${page}&page_size=${PAGE_SIZE}`,
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: Paginated<Product> = await res.json();

        if (!ignore) {
          setData(json);
        }
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page]);

  if (loading) return <p className="text-muted">loading...</p>;
  if (error) return <p className="text-danger-fg">Error: {error}</p>;
  if (!data) return <p>No data was received</p>;
  if (data.total === 0) return <p>No products found.</p>;

  return (
    <div>
      {data.items.length === 0 ? (
        <div>
          {page >= data.pages ? (
            <p>
              Invalid page.{" "}
              <Button onClick={() => router.push(`${pathname}?page=1`)}>
                Go to page 1
              </Button>
            </p>
          ) : (
            <p>This page is empty.</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-border px-3 py-2 font-medium">
                  Name
                </th>
                <th className="border-b border-border px-3 py-2 font-medium">
                  Description
                </th>
                <th className="border-b border-border px-3 py-2 font-medium text-right">
                  Price
                </th>
                <th className="border-b border-border px-3 py-2 font-medium text-right">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border"
                  data-testid={`product-row-${item.id}`}
                >
                  <td className="px-3 py-2">
                    {item.name}
                    {item.quantity < LOW_STOCK_THRESHOLD && (
                      <span className="ml-2 rounded-full bg-danger-bg px-2 py-1 text-xs font-medium text-danger-fg">
                        Low stock
                      </span>
                    )}
                  </td>

                  <td className="max-w-xs truncate px-3 py-2">
                    {item.description ?? "No description"}
                  </td>

                  <td className="px-3 py-2 text-right">{item.price}</td>

                  <td className="px-3 py-2 text-right">
                    {item.quantity < LOW_STOCK_THRESHOLD ? (
                      <span className="text-danger-fg">{item.quantity}</span>
                    ) : (
                      item.quantity
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-4 text-sm text-center">
        <p className="mb-3">Total products: {data.total}</p>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => router.push(`${pathname}?page=${page - 1}`)}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span>
            Page {page} of {data.pages}
          </span>

          <Button
            onClick={() => router.push(`${pathname}?page=${page + 1}`)}
            disabled={page >= data.pages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
