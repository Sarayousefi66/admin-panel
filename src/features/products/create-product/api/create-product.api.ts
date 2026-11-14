import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { ProductFormValues } from "../../shared/schemas/product-form.schema";
import type { Product } from "../../shared/types/product.types";

export async function createProduct(
  data: ProductFormValues,
): Promise<ApiResponse<Product>> {
  const response = await api.post<ApiResponse<Product>>(
    "/products",
    data,
  );

  return response.data;
}