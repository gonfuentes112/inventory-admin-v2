import ProductList from "@/components/ProductList";
import LogoutButton from "@/components/LogoutButton";
import { Suspense } from "react";
import ProductFilters from "@/components/ProductFilters";
export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="font-semibold">Inventory Admin</span> <LogoutButton />
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Products</h1>
        <Suspense fallback={<p className="text-muted">Loading...</p>}>
          <ProductFilters />
          <div className="mt-4">
            <ProductList />
          </div>
        </Suspense>
      </main>
    </div>
  );
}
