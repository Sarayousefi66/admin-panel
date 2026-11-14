import {
    keepPreviousData,
    queryOptions,
} from "@tanstack/react-query";

import {
    DEFAULT_PAGE_SIZE,
    normalizePageSize,
} from "@/shared/constants/pagination";

import { productsKeys } from "../../shared/api/products.query-keys";
import type { GetProductsParams } from "../../shared/types/product.types";

import { getProducts } from "./products-list.api";

export function productsListQuery(params: GetProductsParams) {
  const normalizedParams: GetProductsParams = {
    ...params,
    page: Math.max(1, Number(params.page ?? 1)),
    limit: normalizePageSize(
      params.limit ?? DEFAULT_PAGE_SIZE,
    ),
  };

  return queryOptions({
    queryKey: productsKeys.list(normalizedParams),

    queryFn: () => getProducts(normalizedParams),

    staleTime: 1000 * 60 * 2,

    placeholderData: keepPreviousData,
  });
}