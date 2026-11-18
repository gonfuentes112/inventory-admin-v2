"use client";

import { useState, useEffect } from "react";
import type { Product, Paginated } from "@/types/api";
import { apiFetch } from "@/lib/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data was received</p>;
  if (data.total === 0) return <p>No products found.</p>;

  return (
    <div>
      {data.items.length === 0 ? (
        <div>
          {page >= data.pages ? (
            <p>
              Invalid page.{" "}
              <button onClick={() => router.push(`${pathname}?page=1`)}>
                Go to page 1
              </button>
            </p>
          ) : (
            <p>This page is empty.</p>
          )}
        </div>
      ) : (
        <ul>
          {data.items.map((item) => (
            <li key={item.id}>
              <div id={"productList-name-" + item.id + item.name}>
                Name: {item.name}
              </div>
              <div id={"productList-description-" + item.id + item.name}>
                Description: {item.description ?? "No description"}
              </div>
              <div id={"productList-price-" + item.id + item.name}>
                Price: {item.price}
              </div>
              <div id={"productList-quantity-" + item.id + item.name}>
                Quantity: {item.quantity}
                {item.quantity < LOW_STOCK_THRESHOLD && (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {" "}
                    LOW QUANTITY !
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p>Total products: {data.total}</p>

      <div>
        <button
          onClick={() => router.push(`${pathname}?page=${page - 1}`)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {data.pages}
        </span>

        <button
          onClick={() => router.push(`${pathname}?page=${page + 1}`)}
          disabled={page >= data.pages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
