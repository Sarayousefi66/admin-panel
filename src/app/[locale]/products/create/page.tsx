import { CreateProductForm } from "@/features/products/create-product/components/create-product-form";

export const metadata = {
  title: "Create Product",
};

export default function CreateProductPage() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <CreateProductForm />
    </div>
  );
}