
"use client";

import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useRouter } from "@/i18n/navigation";

import { DataTable } from "@/shared/components/common/data-table";
import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";
import { Pagination } from "@/shared/components/common/pagination";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { getErrorMessage } from "@/shared/lib/api-error";

import { CreateProductDialog } from "../../create-product/components/create-product-dialog";
import { useProductsView } from "../hooks/use-products-view";
import { createProductColumns } from "./products-columns";
import { ProductsFilters } from "./products-filters";

export default function ProductsPageView() {
  const t = useTranslations("products");
  const tableT = useTranslations("products.table");
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    page,
    pageSize,
    search,
    sortBy,
    order,
    setSearch,
    setPage,
    setPageSize,
    setSortBy,
    setOrder,
  } = useProductsView();

  const columns = useMemo(
    () =>
      createProductColumns(
        (key) => tableT(key),
        t("form.imagePreviewAlt"),
      ),
    [tableT, t],
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl">
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl">
          <ErrorState
            title={t("states.errorTitle")}
            description={getErrorMessage(error)}
          />
        </div>
      </DashboardLayout>
    );
  }

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">
                {t("title")}
              </h1>
            </div>
          </div>

          <CreateProductDialog />
        </div>

        {/* Filters */}
        <ProductsFilters
          search={search}
          sortBy={sortBy}
          order={order}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />

        {/* Table */}
        <div className="space-y-3">
          {products.length > 0 ? (
            <DataTable
              columns={columns}
              data={products}
              onRowClick={(product) =>
                router.push(`/products/${product.id}`)
              }
            />
          ) : (
            <EmptyState title={t("states.empty")} />
          )}

          {data && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
