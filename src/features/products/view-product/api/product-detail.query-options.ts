import { queryOptions } from "@tanstack/react-query";

import { productsKeys } from "../../shared/api/products.query-keys";

import { getProductById } from "./product-detail.api";

export function productDetailQuery(id: number) {
  return queryOptions({
    queryKey: productsKeys.detail(id),

    queryFn: () => getProductById(id),

    staleTime: 1000 * 60 * 5,
  });
}