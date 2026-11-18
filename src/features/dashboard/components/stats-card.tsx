
import { useLocale } from 'next-intl';

import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
}: Props) {
  const locale = useLocale();

  const formattedValue = new Intl.NumberFormat(locale).format(value);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2
            className="mt-2 text-3xl font-bold tabular-nums"
            dir="auto"
          >
            {formattedValue}
          </h2>
        </div>

        <div className="shrink-0 rounded-lg border p-3">
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
