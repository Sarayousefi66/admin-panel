
"use client";

import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { ProductImage } from "../../shared/components/product-image";
import { productDetailQuery } from "../api/product-detail.query-options";

interface Props {
  id: number;
}

export function ProductDetails({ id }: Props) {
  const t = useTranslations("products");
  const router = useRouter();

  const { data: product } = useQuery(productDetailQuery(id));

  if (!product) {
    return null;
  }

  const productData = product.data;

  const handleEdit = () => {
    router.push(`/products/edit/${productData.id}`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
              {productData.title}
            </h1>

            <p className="text-sm text-muted-foreground">
              {t("details")}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleEdit}
            className="h-10 shrink-0 rounded-xl px-4 shadow-sm"
          >
            <Pencil className="me-2 size-4" />
            {t("actions.edit")}
          </Button>
        </div>

        {/* Product information */}
        <Card className="overflow-hidden rounded-2xl border-border bg-card p-0 shadow-sm">
          <div className="grid min-w-0 grid-cols-1 md:grid-cols-2">
            {/* Product image */}
            <div className="flex min-w-0 items-center justify-center bg-muted/20 p-5 sm:p-7">
              <div className="w-full max-w-lg">
                <ProductImage
                  src={productData.image}
                  alt={t("form.imagePreviewAlt")}
                  variant="detail"
                />
              </div>
            </div>

            {/* Product information */}
            <div className="flex min-w-0 flex-col gap-7 p-5 sm:p-7">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  {t("form.description")}
                </h2>

                <p className="whitespace-pre-wrap break-words text-sm leading-8 text-foreground">
                  {productData.description || "—"}
                </p>
              </div>

              <div className="mt-auto rounded-xl border border-border bg-muted/30 p-5">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {t("form.price")}
                </p>

                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  ${productData.price}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
