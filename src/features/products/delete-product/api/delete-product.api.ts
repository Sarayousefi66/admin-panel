import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { Product } from "../../shared/types/product.types";

export type DeletedProduct = Product & {
  isDeleted?: boolean;
  deletedOn?: string;
};

export async function deleteProduct(
  id: number,
): Promise<ApiResponse<DeletedProduct>> {
  const response = await api.delete<ApiResponse<DeletedProduct>>(
    `/products/${id}`,
  );

  return response.data;
}