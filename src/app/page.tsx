import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import LogoutButton from "@/components/LogoutButton";
import { Suspense } from "react";
export default function Home() {
  return (
    <div>
      <LogoutButton />
      <Suspense fallback={<p>Loading...</p>}>
        <ProductList />
      </Suspense>

      <CategoryList />
    </div>
  );
}
