import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { Product } from "../../shared/types/product.types";

export async function getProductById(
  id: number,
): Promise<ApiResponse<Product>> {
  const response = await api.get<ApiResponse<Product>>(
    `/products/${id}`,
  );

  return response.data;
}