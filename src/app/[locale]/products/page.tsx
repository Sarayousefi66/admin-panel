import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import type { Metadata } from "next";

import { DEFAULT_PAGE_SIZE, normalizePageSize } from "@/shared/constants/pagination";
import { getQueryClient } from "@/shared/lib/react-query";

import { productsListQuery } from "@/features/products/view-products/api/products.query-options";
import ProductsPageView from "@/features/products/view-products/components/products-page-view";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products",
};

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);

  const pageSize = normalizePageSize(
    params.pageSize ?? String(DEFAULT_PAGE_SIZE),
  );

  const search = params.search || "";
  const sortBy = params.sortBy || "";
  const order = params.order || "";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    productsListQuery({
      page,
      limit: pageSize,
      search,
      sortBy,
      order,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsPageView />
    </HydrationBoundary>
  );
}