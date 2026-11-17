import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import LogoutButton from "@/components/LogoutButton";
export default function Home() {
  return (
    <div>
      <LogoutButton />
      <ProductList />
      <CategoryList />
    </div>
  );
}
