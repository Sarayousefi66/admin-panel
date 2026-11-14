import type { QueryClient } from "@tanstack/react-query";

import { DEFAULT_PAGE_SIZE } from "@/shared/constants/pagination";

import type { GetProductsParams } from "../../shared/types/product.types";

import { productsListQuery } from "./products.query-options";

interface PrefetchProductsParams extends GetProductsParams {
  page: number;
  search: string;
}

export function prefetchProducts(
  queryClient: QueryClient,
  params: PrefetchProductsParams,
) {
  return queryClient.prefetchQuery(
    productsListQuery({
      ...params,
      limit: params.limit ?? DEFAULT_PAGE_SIZE,
    }),
  );
}