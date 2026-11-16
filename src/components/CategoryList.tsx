"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types/api";

export default function CategoryList() {
  const [data, setData] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Category[] = await res.json();
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
  if (data.length === 0) {
    return <div>No categories found</div>;
  }
  return (
    <div>
      <ul>
        {data.map((cat) => (
          <li key={cat.id}>
            <div id={"productList-name-" + cat.id + cat.name}>
              Name: {cat.name}
            </div>
          </li>
        ))}
      </ul>
      <p>Total categories: {data.length}</p>
    </div>
  );
}
