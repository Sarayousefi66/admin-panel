"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useRouter } from "@/i18n/navigation";

import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { getErrorMessage } from "@/shared/lib/api-error";

import { RolePermissionsPanel } from "../../view-role-permissions/components/role-permissions-panel";
import { useRoleQuery } from "../hooks/use-role-query";

interface Props {
  roleId: string;
}

export function RoleDetailsPageView({ roleId }: Props) {
  const t = useTranslations("roles.details");
  const tableT = useTranslations("roles.table");

  const router = useRouter();

  const {
    data,
    isLoading,
    error,
  } = useRoleQuery(roleId);

  const role = data?.data;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl">
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl">
          <ErrorState
            title={t("errorTitle")}
            description={getErrorMessage(error)}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!role) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl">
          <EmptyState title={t("notFound")} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {/* Page navigation */}
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-lg px-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/roles")}
          >
            <ArrowLeft className="me-2 size-4 rtl:rotate-180" />
            {t("back")}
          </Button>
        </div>

        {/* Role information */}
        <Card className="overflow-hidden rounded-2xl border-border bg-card p-0 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border bg-muted/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-6" />
              </div>

              <div className="min-w-0 space-y-1">
                <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
                  {role.name}
                </h1>

                <p className="text-sm leading-6 text-muted-foreground">
                  {t("description")}
                </p>
              </div>
            </div>

            <span
              className={
                role.isSystem
                  ? "inline-flex w-fit shrink-0 items-center rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                  : "inline-flex w-fit shrink-0 items-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
              }
            >
              {role.isSystem ? tableT("system") : t("custom")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {/* Role slug */}
            <div className="min-w-0 space-y-2 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {tableT("slug")}
              </p>

              <p
                dir="ltr"
                className="break-all text-start font-mono text-sm font-medium text-foreground"
              >
                {role.slug}
              </p>
            </div>

            {/* Role description */}
            <div className="min-w-0 space-y-2 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {tableT("description")}
              </p>

              <p className="text-sm leading-7 text-foreground">
                {role.description || "—"}
              </p>
            </div>
          </div>
        </Card>

        {/* Role permissions */}
        <RolePermissionsPanel roleId={roleId} />
      </div>
    </DashboardLayout>
  );
}