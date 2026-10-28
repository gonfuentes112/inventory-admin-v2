
export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  owner_id: number;
  category_id: number;
  quantity: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};