import { notFound } from "next/navigation";

import { EditProductForm } from "@/features/products/update-product/components/edit-product-form";
import { getProductById } from "@/features/products/view-product/api/product-detail.api";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl py-10">
      <EditProductForm product={product} />
    </div>
  );
}