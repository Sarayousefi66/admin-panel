
'use client';

import { useLocale, useTranslations } from 'next-intl';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ProductPriceChartItem } from '../../types/dashboard.types';

interface ProductsChartProps {
  data: ProductPriceChartItem[];
}

export function ProductsChart({ data }: ProductsChartProps) {
  const locale = useLocale();
  const t = useTranslations('dashboard.charts');

  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        {t('noProductData')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 10,
          right: 12,
          bottom: 10,
          left: 12,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          vertical
          stroke="var(--border)"
        />

        <XAxis
          type="number"
          tickFormatter={(value) =>
            numberFormatter.format(Number(value))
          }
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />

        <YAxis
          type="category"
          dataKey="title"
          width={110}
          orientation={locale === 'fa' ? 'right' : 'left'}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />

        <Tooltip
          formatter={(value) => [
            numberFormatter.format(Number(value)),
            t('price'),
          ]}
          labelFormatter={(label) => String(label)}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
          }}
        />

        <Bar
          dataKey="price"
          fill="hsl(var(--primary))"
          radius={[0, 6, 6, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
