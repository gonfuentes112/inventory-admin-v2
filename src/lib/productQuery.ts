export const SORT_FIELDS = ["id", "name", "price", "quantity"] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export type ProductQuery = {
  page: number;
  search: string;
  categoryId: number | null;
  minPrice: string;
  maxPrice: string;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
};

function isSortField(value: string): value is SortField {
  return (SORT_FIELDS as readonly string[]).includes(value);
}

function isValidPrice(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value);
}

export function parseProductQuery(params: URLSearchParams): ProductQuery {
  const requestedPage = Number(params.get("page") ?? "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const search = (params.get("search") ?? "").trim().slice(0, 100);

  const requestedCategory = Number(params.get("category_id"));
  const categoryId =
    Number.isSafeInteger(requestedCategory) && requestedCategory > 0
      ? requestedCategory
      : null;

  const requestedMinPrice = params.get("min_price") ?? "";
  const minPrice = isValidPrice(requestedMinPrice) ? requestedMinPrice : "";

  const requestedMaxPrice = params.get("max_price") ?? "";
  const maxPrice = isValidPrice(requestedMaxPrice) ? requestedMaxPrice : "";

  const requestedSortBy = params.get("sort_by") ?? "";
  const sortBy = isSortField(requestedSortBy) ? requestedSortBy : "id";

  const sortOrder = params.get("sort_order") === "desc" ? "desc" : "asc";

  return {
    page,
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  };
}

export function toSearchParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.page !== 1) {
    params.set("page", String(query.page));
  }

  if (query.search !== "") {
    params.set("search", query.search);
  }

  if (query.categoryId !== null) {
    params.set("category_id", String(query.categoryId));
  }

  if (query.minPrice !== "") {
    params.set("min_price", query.minPrice);
  }

  if (query.maxPrice !== "") {
    params.set("max_price", query.maxPrice);
  }

  if (query.sortBy !== "id") {
    params.set("sort_by", query.sortBy);
  }

  if (query.sortOrder !== "asc") {
    params.set("sort_order", query.sortOrder);
  }

  return params;
}

export function hasActiveFilters(query: ProductQuery): boolean {
  return (
    query.search !== "" ||
    query.categoryId !== null ||
    query.minPrice !== "" ||
    query.maxPrice !== ""
  );
}
