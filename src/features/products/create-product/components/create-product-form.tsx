"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { appToast } from "@/shared/lib/toast";

import { ProductForm } from "../../shared/components/product-form";
import type { ProductFormValues } from "../../shared/schemas/product-form.schema";
import { useCreateProduct } from "../hooks/use-create-product";

interface Props {
  variant?: "card" | "dialog";
  onCreated?: () => void;
}

export function CreateProductForm({
  variant = "card",
  onCreated,
}: Props) {
  const createMutation = useCreateProduct();
  const router = useRouter();
  const t = useTranslations("products.notifications");

  const handleSubmit = async (values: ProductFormValues) => {
    await createMutation.mutateAsync(values);

    appToast.success(t("created"));

    if (onCreated) {
      onCreated();
      return;
    }

    router.push("/products");
  };

  return (
    <ProductForm
      mode="create"
      variant={variant}
      isPending={createMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}