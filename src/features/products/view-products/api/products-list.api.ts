import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type {
    GetProductsParams,
    ProductListData,
} from "../../shared/types/product.types";

export async function getProducts(
  params: GetProductsParams,
): Promise<ApiResponse<ProductListData>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const skip = (page - 1) * limit;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (params.search) {
    searchParams.set("q", params.search);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.order) {
    searchParams.set("order", params.order);
  }

  const response = await api.get<ApiResponse<ProductListData>>(
    `/products?${searchParams.toString()}`,
  );

  return response.data;
}