
import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm"
    >
      <table className="w-full min-w-[760px] border-collapse text-start">
        <thead>
          <tr className="border-b border-border/70 bg-muted/40">
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="h-3 w-20" />
            </th>
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="h-3 w-24" />
            </th>
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="h-3 w-28" />
            </th>
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="h-3 w-10" />
            </th>
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="h-3 w-16" />
            </th>
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="h-3 w-14" />
            </th>
            <th className="px-3 py-4 sm:px-4">
              <Skeleton className="size-4 rounded" />
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr
              key={index}
              className="border-b border-border/60 last:border-b-0"
            >
              {/* First name and avatar */}
              <td className="px-3 py-3.5 sm:px-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              </td>

              {/* Last name */}
              <td className="px-3 py-3.5 sm:px-4">
                <Skeleton className="h-3.5 w-24" />
              </td>

              {/* Email */}
              <td className="px-3 py-3.5 sm:px-4">
                <Skeleton className="h-3.5 w-32 max-w-full" />
              </td>

              {/* Age */}
              <td className="px-3 py-3.5 sm:px-4">
                <Skeleton className="h-3.5 w-7" />
              </td>

              {/* Roles */}
              <td className="px-3 py-3.5 sm:px-4">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
              </td>

              {/* Status */}
              <td className="px-3 py-3.5 sm:px-4">
                <Skeleton className="h-6 w-16 rounded-md" />
              </td>

              {/* Actions */}
              <td className="px-3 py-3.5 sm:px-4">
                <Skeleton className="size-8 rounded-md" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
