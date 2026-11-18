
'use client';

import { useTranslations } from 'next-intl';

import {
  Clock,
  LayoutDashboard,
  Package,
  UserCheck,
  Users,
} from 'lucide-react';

import { ErrorState } from '@/shared/components/common/error-state';
import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { getErrorMessage } from '@/shared/lib/api-error';

import { useDashboardStats } from '../hooks/use-dashboard-stats';

import { ChartCard } from './chart-card';
import { ProductsChart } from './charts/products-chart';
import { UserStatusChart } from './charts/user-status-chart';
import { DashboardSkeleton } from './dashboard-skeleton';
import { StatsCard } from './stats-card';

export function DashboardPageView() {
  const t = useTranslations('dashboard');

  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState
          title={t('loadError')}
          description={getErrorMessage(error)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Compact Dashboard Header */}
        <header className="flex items-center gap-3 border-b border-border/70 pb-5 sm:gap-4">
          <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/15 sm:size-12">
            <div className="absolute inset-0 bg-white/10" />
            <LayoutDashboard className="relative size-5 sm:size-[22px]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                {t('title')}
              </span>
            </div>

            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {t('title')}
            </h1>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {t('description')}
            </p>
          </div>
        </header>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={t('stats.totalProducts')}
            value={data?.totalProducts ?? 0}
            icon={Package}
          />

          <StatsCard
            title={t('stats.totalUsers')}
            value={data?.totalUsers ?? 0}
            icon={Users}
          />

          <StatsCard
            title={t('stats.activeUsers')}
            value={data?.activeUsers ?? 0}
            icon={UserCheck}
          />

          <StatsCard
            title={t('stats.pendingUsers')}
            value={data?.pendingUsers ?? 0}
            icon={Clock}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={t('charts.productPrices')}>
            <ProductsChart
              data={data?.productPrices ?? []}
            />
          </ChartCard>

          <ChartCard title={t('charts.userStatus')}>
            <UserStatusChart
              data={data?.userStatusDistribution ?? []}
            />
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
