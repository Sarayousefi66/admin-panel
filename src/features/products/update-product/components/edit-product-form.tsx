
"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { appToast } from "@/shared/lib/toast";
import type { ApiResponse } from "@/shared/types/api-response";

import { ProductForm } from "../../shared/components/product-form";
import type { Product } from "../../shared/types/product.types";
import { useUpdateProduct } from "../hooks/use-update-product";

interface Props {
  product: ApiResponse<Product>;
}

export function EditProductForm({ product }: Props) {
  const updateMutation = useUpdateProduct();
  const router = useRouter();
  const t = useTranslations("products");
  const notificationsT = useTranslations("products.notifications");

  const productData = product.data;

  const handleSubmit = async (
    values: Parameters<
      typeof updateMutation.mutateAsync
    >[0]["data"],
  ) => {
    await updateMutation.mutateAsync({
      id: productData.id,
      data: values,
    });

    appToast.success(notificationsT("updated"));
    router.push("/products");
  };

  return (
    <div className="w-full space-y-4">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-lg"
        onClick={() => router.push("/products")}
      >
        <ArrowLeft className="me-2 size-4 rtl:rotate-180" />
        {t("title")}
      </Button>

      <ProductForm
        mode="edit"
        initialData={productData}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
