
'use client';

import { useLocale, useTranslations } from 'next-intl';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import type { UserStatusChartItem } from '../../types/dashboard.types';

interface UserStatusChartProps {
  data: UserStatusChartItem[];
}

const COLORS: Record<string, string> = {
  active: '#22c55e',
  pending: '#f59e0b',
  inactive: '#ef4444',
};

export function UserStatusChart({ data }: UserStatusChartProps) {
  const locale = useLocale();

  const t = useTranslations('dashboard.charts');
  const statusT = useTranslations('users.statuses');

  const numberFormatter = new Intl.NumberFormat(locale);

  const statusLabels: Record<string, string> = {
    active: statusT('active'),
    pending: statusT('pending'),
    inactive: statusT('inactive'),
  };

  const localizedData = data.map((item) => ({
    ...item,
    label: statusLabels[item.status] ?? t('unknownStatus'),
  }));

  if (localizedData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        {t('noUserData')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={localizedData}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="45%"
          innerRadius={58}
          outerRadius={96}
          paddingAngle={3}
          stroke="none"
          label={({ percent }) =>
            `${Math.round((percent ?? 0) * 100)}%`
          }
          labelLine={false}
        >
          {data.map((item, index) => (
            <Cell
              key={`${item.status}-${index}`}
              fill={COLORS[item.status] ?? '#94a3b8'}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value) => [
            numberFormatter.format(Number(value)),
            t('usersCount'),
          ]}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
          }}
        />

        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">
              {String(value)}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
