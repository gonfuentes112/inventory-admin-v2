"use client";

import { useState, useEffect } from "react";
import type { Product, Paginated } from "@/types/api";

export default function ProductList() {
  const [data, setData] = useState<Paginated<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "http://3.27.38.78:8000/products?page=1&page_size=20",
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Paginated<Product> = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data was received</p>;
  if (data.items.length === 0) {
    return <div>No products found</div>;
  }
  return (
    <div>
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
            </div>
          </li>
        ))}
      </ul>
      <p>Total products: {data?.total}</p>
    </div>
  );
}
