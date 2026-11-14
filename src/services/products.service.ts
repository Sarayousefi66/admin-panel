import { fetchMockApi } from "@/shared/lib/mock-api";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/features/products/shared/schemas/product-api.schema";

import type { Product } from "@/features/products/shared/types/product.types";

interface FetchProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}

export class ProductServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}

async function readResponse<T>(
  response: Response,
  errorMessage: string,
): Promise<T> {
  if (!response.ok) {
    throw new ProductServiceError(errorMessage, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ProductServiceError(
      "Invalid response from products database",
      502,
    );
  }
}

/**
 * Fetch products from the local JSON Server.
 */
export async function fetchProducts({
  limit = 10,
  skip = 0,
  search = "",
  sortBy,
  order,
}: FetchProductsParams) {
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0
      ? Math.min(limit, 100)
      : 10;

  const normalizedSkip =
    Number.isInteger(skip) && skip >= 0 ? skip : 0;

  const params = new URLSearchParams({
    _page: String(
      Math.floor(normalizedSkip / normalizedLimit) + 1,
    ),
    _limit: String(normalizedLimit),
  });

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    params.set("q", normalizedSearch);
  }

  if (sortBy?.trim()) {
    params.set("_sort", sortBy.trim());
  }

  if (order === "asc" || order === "desc") {
    params.set("_order", order);
  }

  const response = await fetchMockApi(
    `/products?${params.toString()}`,
  );

  const products = await readResponse<unknown>(
    response,
    "Failed to fetch products",
  );

  if (!Array.isArray(products)) {
    throw new ProductServiceError(
      "Invalid products response",
      502,
    );
  }

  const totalHeader = response.headers.get("X-Total-Count");
  const total =
    totalHeader === null
      ? products.length
      : Number(totalHeader);

  if (!Number.isSafeInteger(total) || total < 0) {
    throw new ProductServiceError(
      "Invalid products count returned by database",
      502,
    );
  }

  return {
    products: products as Product[],
    total,
    skip: normalizedSkip,
    limit: normalizedLimit,
  };
}

/**
 * Create a product in the local JSON Server.
 */
export async function createProductService(
  data: CreateProductInput,
): Promise<Product> {
  const response = await fetchMockApi("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return readResponse<Product>(
    response,
    "Failed to create product",
  );
}

/**
 * Fetch a product by ID.
 */
export async function fetchProductById(
  id: number,
): Promise<Product> {
  const response = await fetchMockApi(`/products/${id}`);

  return readResponse<Product>(
    response,
    "Product not found",
  );
}

/**
 * Update a product in the local JSON Server.
 */
export async function updateProductService(
  id: number,
  data: UpdateProductInput,
): Promise<Product> {
  const response = await fetchMockApi(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return readResponse<Product>(
    response,
    "Failed to update product",
  );
}

/**
 * Delete a product from the local JSON Server.
 */
export async function deleteProductService(
  id: number,
): Promise<Product> {
  const response = await fetchMockApi(`/products/${id}`, {
    method: "DELETE",
  });

  return readResponse<Product>(
    response,
    "Failed to delete product",
  );
}