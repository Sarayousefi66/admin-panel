import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';

import {
  createProductService,
  fetchProducts,
  ProductServiceError,
} from '@/services/products.service';

import { createProductSchema } from '@/features/products/shared/schemas/product-api.schema';

import { authorizeApiRequest } from '@/shared/lib/server-auth';

function getNonNegativeInteger(
  value: string | null,
  fallback: number,
): number {
  if (value === null || value.trim() === '') {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= 0
    ? parsedValue
    : fallback;
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
 * GET /api/products
 */
export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(request, [
    'products.view',
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const searchParams = request.nextUrl.searchParams;

  const requestedLimit = getNonNegativeInteger(
    searchParams.get('limit'),
    10,
  );

  const limit = Math.min(Math.max(1, requestedLimit), 100);

  const skip = getNonNegativeInteger(
    searchParams.get('skip'),
    0,
  );

  const search = searchParams.get('q') ?? '';
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const order = searchParams.get('order') ?? undefined;

  try {
    const data = await fetchProducts({
      limit,
      skip,
      search,
      sortBy,
      order,
    });

    return successResponse(data);
  } catch (error) {
    return errorResponse(
      'Failed to fetch products',
      getErrorStatus(error),
    );
  }
}

/**
 * POST /api/products
 */
export async function POST(request: NextRequest) {
  const authorization = await authorizeApiRequest(request, [
    'products.create',
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request body', 400);
  }

  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(
      result.error.issues[0]?.message ?? 'Invalid product data',
      400,
    );
  }

  try {
    const data = await createProductService(result.data);

    return successResponse(data, 'Product created', 201);
  } catch (error) {
    return errorResponse(
      'Failed to create product',
      getErrorStatus(error),
    );
  }
}