import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { ProductFormValues } from "../../shared/schemas/product-form.schema";
import type { Product } from "../../shared/types/product.types";

export type UpdateProductVariables = {
  id: number;
  data: ProductFormValues;
};

export async function updateProduct({
  id,
  data,
}: UpdateProductVariables): Promise<ApiResponse<Product>> {
  const response = await api.patch<ApiResponse<Product>>(
    `/products/${id}`,
    data,
  );

  return response.data;
}