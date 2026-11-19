"use client";
import { Category } from "@/types/api";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import DebouncedInput from "@/components/DebouncedInput";
import { apiFetch } from "@/lib/api";
import { parseProductQuery, SORT_FIELDS } from "@/lib/productQuery";
import { withUpdates } from "@/lib/urlParams";

export default function ProductFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = parseProductQuery(searchParams);

  function update(
    updates: Record<string, string | null>,
    mode: "push" | "replace",
  ) {
    const params = withUpdates(searchParams, updates);
    const url = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    if (mode === "push") {
      router.push(url);
    } else {
      router.replace(url);
    }
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const res = await apiFetch("/api/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Category[] = await res.json();
        if (!ignore) setCategories(json);
      } catch (e) {
        if (!ignore)
          setCategoryError(e instanceof Error ? e.message : "Unknown error");
      }
    }

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  const inputClassName =
    "rounded border border-border bg-background px-3 py-2 text-foreground";

  const selectClassName =
    "rounded border border-border bg-background px-3 py-2 text-foreground";

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Search</span>
        <DebouncedInput
          value={query.search}
          onCommit={(value) => update({ search: value }, "replace")}
          placeholder="Search products"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Category</span>
        <select
          value={query.categoryId ?? ""}
          onChange={(event) =>
            update({ category_id: event.target.value }, "push")
          }
          className={selectClassName}
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {categoryError && (
          <span className="text-xs text-danger-fg">
            Failed to load categories: {categoryError}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Minimum price</span>
        <DebouncedInput
          value={query.minPrice}
          onCommit={(value) => update({ min_price: value }, "replace")}
          placeholder="Minimum"
          inputMode="decimal"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Maximum price</span>
        <DebouncedInput
          value={query.maxPrice}
          onCommit={(value) => update({ max_price: value }, "replace")}
          placeholder="Maximum"
          inputMode="decimal"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Sort by</span>
        <select
          value={query.sortBy}
          onChange={(event) => update({ sort_by: event.target.value }, "push")}
          className={selectClassName}
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Sort order</span>
        <select
          value={query.sortOrder}
          onChange={(event) =>
            update({ sort_order: event.target.value }, "push")
          }
          className={selectClassName}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

      <Button onClick={() => router.push(pathname)}>Clear filters</Button>
    </div>
  );
}
