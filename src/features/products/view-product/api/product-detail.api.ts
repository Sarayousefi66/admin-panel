import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { Product } from "../../shared/types/product.types";

export async function getProductById(
  id: number,
  cookieHeader?: string,
  requestOrigin?: string,
): Promise<ApiResponse<Product>> {
  const requestConfig = {
    ...(requestOrigin
      ? {
          baseURL: `${requestOrigin.replace(/\/+$/, "")}/api`,
        }
      : {}),
    ...(cookieHeader
      ? {
          headers: {
            Cookie: cookieHeader,
          },
        }
      : {}),
  };

  const response = await api.get<ApiResponse<Product>>(
    `/products/${id}`,
    requestConfig,
  );

  return response.data;
}