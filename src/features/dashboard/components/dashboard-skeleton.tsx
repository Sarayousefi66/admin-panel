
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';

function ProductsChartSkeleton() {
  const barHeights = [
    'h-16',
    'h-24',
    'h-20',
    'h-32',
    'h-28',
    'h-40',
    'h-36',
    'h-48',
  ];

  return (
    <div className="flex h-[300px] w-full gap-3">
      {/* Y axis */}
      <div className="flex shrink-0 flex-col justify-between pb-9 pt-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-2.5 w-7"
          />
        ))}
      </div>

      {/* Chart area */}
      <div className="relative flex min-w-0 flex-1 flex-col justify-end">
        <div className="absolute inset-0 flex flex-col justify-between pb-9 pt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border-t border-dashed border-border"
            />
          ))}
        </div>

        <div className="relative flex h-full items-end justify-around gap-2 px-2 pb-9">
          {barHeights.map((height, index) => (
            <div
              key={index}
              className="flex h-full flex-1 items-end"
            >
              <Skeleton
                className={`w-full rounded-t-md rounded-b-none ${height}`}
              />
            </div>
          ))}
        </div>

        {/* X axis labels */}
        <div className="absolute inset-x-0 bottom-0 flex justify-around gap-2 px-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-2 w-5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserStatusChartSkeleton() {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
      {/* Donut chart */}
      <div className="relative flex size-48 shrink-0 items-center justify-center">
        <Skeleton className="size-44 rounded-full" />

        <div className="absolute inset-0 m-auto size-24 rounded-full border border-border bg-card" />
      </div>

      {/* Legend */}
      <div className="flex w-full max-w-44 flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <Skeleton className="size-3 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-3 w-24 max-w-full" />
              <Skeleton className="h-8 w-20" />
            </div>

            <Skeleton className="size-11 shrink-0 rounded-lg" />
          </div>

          <Skeleton className="mt-5 h-2.5 w-28 max-w-full" />
        </Card>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
      className="space-y-6"
    >
      {/* Page heading */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <Skeleton className="h-5 w-40 max-w-full" />
          </CardHeader>

          <CardContent>
            <ProductsChartSkeleton />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <Skeleton className="h-5 w-36 max-w-full" />
          </CardHeader>

          <CardContent>
            <UserStatusChartSkeleton />
          </CardContent>
        </Card>
      </div>

      {/* Statistics cards */}
      <DashboardStatsSkeleton />

      <span className="sr-only">Loading dashboard...</span>
    </div>
  );
}
