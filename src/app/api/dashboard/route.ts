
import { NextRequest, NextResponse } from 'next/server';

import { fetchMockApi } from '@/shared/lib/mock-api';
import { authorizeApiRequest } from '@/shared/lib/server-auth';

interface DashboardUserRecord {
  status?: string | null;
}

interface DashboardProductRecord {
  id: string | number;
  title?: string;
  price?: number;
}

interface ProductPriceChartItem {
  title: string;
  price: number;
}

const responseHeaders = {
  'Cache-Control': 'no-store',
};

/**
 * GET /api/dashboard
 *
 * Returns dashboard statistics calculated from the actual
 * users and products collections.
 */
export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(request, [
    'dashboard.view',
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const [usersResponse, productsResponse] = await Promise.all([
      fetchMockApi('/users'),
      fetchMockApi('/products'),
    ]);

    if (!usersResponse.ok || !productsResponse.ok) {
      return NextResponse.json(
        {
          message: 'Failed to retrieve dashboard data',
        },
        {
          status: 502,
          headers: responseHeaders,
        },
      );
    }

    const [usersData, productsData]: [unknown, unknown] =
      await Promise.all([
        usersResponse.json(),
        productsResponse.json(),
      ]);

    if (!Array.isArray(usersData) || !Array.isArray(productsData)) {
      return NextResponse.json(
        {
          message: 'Invalid dashboard data response',
        },
        {
          status: 502,
          headers: responseHeaders,
        },
      );
    }

    const users = usersData as DashboardUserRecord[];
    const products = productsData as DashboardProductRecord[];

    // Calculate user status distribution.
    const statusCounts = new Map<string, number>([
      ['active', 0],
      ['pending', 0],
      ['inactive', 0],
    ]);

    for (const user of users) {
      const status =
        typeof user.status === 'string' && user.status.trim()
          ? user.status.trim().toLowerCase()
          : 'unknown';

      statusCounts.set(
        status,
        (statusCounts.get(status) ?? 0) + 1,
      );
    }

    const statusOrder = [
      'active',
      'pending',
      'inactive',
      ...Array.from(statusCounts.keys()).filter(
        (status) =>
          !['active', 'pending', 'inactive'].includes(status),
      ),
    ];

    const userStatusDistribution = statusOrder
      .filter((status) => statusCounts.get(status)! > 0)
      .map((status) => ({
        status,
        value: statusCounts.get(status)!,
      }));

    // Calculate product prices using actual database records.
    const productPrices: ProductPriceChartItem[] = products
      .filter(
        (product) =>
          typeof product.price === 'number' &&
          Number.isFinite(product.price) &&
          product.price >= 0,
      )
      .map((product) => ({
        title:
          typeof product.title === 'string' && product.title.trim()
            ? product.title.trim()
            : String(product.id),
        price: product.price as number,
      }))
      .sort((a, b) => a.price - b.price);

    return NextResponse.json(
      {
        totalProducts: products.length,
        totalUsers: users.length,

        activeUsers: statusCounts.get('active') ?? 0,
        pendingUsers: statusCounts.get('pending') ?? 0,

        productPrices,
        userStatusDistribution,
      },
      {
        headers: responseHeaders,
      },
    );
  } catch {
    return NextResponse.json(
      {
        message: 'Dashboard service is unavailable',
      },
      {
        status: 503,
        headers: responseHeaders,
      },
    );
  }
}
