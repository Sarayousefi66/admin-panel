import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";

import {
  deleteProductService,
  fetchProductById,
  ProductServiceError,
  updateProductService,
} from "@/services/products.service";

import { updateProductSchema } from "@/features/products/shared/schemas/product-api.schema";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parseProductId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function getErrorStatus(error: unknown): number {
  if (
    error instanceof ProductServiceError &&
    error.status >= 400 &&
    error.status <= 599
  ) {
    return error.status;
  }

  return 502;
}

/**
 * GET /api/products/:id
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  const { id } = await context.params;
  const productId = parseProductId(id);

  if (!productId) {
    return errorResponse("Invalid product ID", 400);
  }

  try {
    const data = await fetchProductById(productId);

    return successResponse(data);
  } catch (error) {
    const status = getErrorStatus(error);

    return errorResponse(
      status === 404
        ? "Product not found"
        : "Failed to fetch product",
      status,
    );
  }
}

/**
 * PATCH /api/products/:id
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  const { id } = await context.params;
  const productId = parseProductId(id);

  if (!productId) {
    return errorResponse("Invalid product ID", 400);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(
      result.error.issues[0]?.message ?? "Invalid product data",
      400,
    );
  }

  try {
    const data = await updateProductService(
      productId,
      result.data,
    );

    return successResponse(data, "Product updated");
  } catch (error) {
    const status = getErrorStatus(error);

    return errorResponse(
      status === 404
        ? "Product not found"
        : "Failed to update product",
      status,
    );
  }
}

/**
 * DELETE /api/products/:id
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  const { id } = await context.params;
  const productId = parseProductId(id);

  if (!productId) {
    return errorResponse("Invalid product ID", 400);
  }

  try {
    const data = await deleteProductService(productId);

    return successResponse(data, "Product deleted");
  } catch (error) {
    const status = getErrorStatus(error);

    return errorResponse(
      status === 404
        ? "Product not found"
        : "Failed to delete product",
      status,
    );
  }
}