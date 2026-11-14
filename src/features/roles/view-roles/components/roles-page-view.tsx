"use client";

import { Search, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useRouter } from "@/i18n/navigation";

import { Input } from "@/components/ui/input";

import { DataTable } from "@/shared/components/common/data-table";
import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { getErrorMessage } from "@/shared/lib/api-error";

import { usePermission } from "@/features/auth/hooks/use-permission";

import { CreateRoleDialog } from "../../create-role/components/create-role-dialog";
import type { Role } from "../../shared/types/role.types";
import { useRolesQuery } from "../hooks/use-roles-query";
import { createRoleColumns } from "./roles-columns";

export default function RolesPageView() {
  const t = useTranslations("roles");
  const tableT = useTranslations("roles.table");

  const router = useRouter();
  const { canAccess } = usePermission();

  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useRolesQuery();

  const roles = data?.data ?? [];

  const filteredRoles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return roles;
    }

    return roles.filter((role: Role) =>
      [role.name, role.slug, role.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [roles, search]);

  const columns = useMemo(
    () =>
      createRoleColumns(
        (key) => tableT(key),
        tableT("system"),
        tableT("custom"),
      ),
    [tableT],
  );

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
            title={t("states.errorTitle")}
            description={getErrorMessage(error)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">
                {t("title")}
              </h1>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </div>

          {canAccess("roles.create") && <CreateRoleDialog />}
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 rounded-xl ps-9"
          />
        </div>

        <div className="space-y-3">
          {filteredRoles.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredRoles}
              onRowClick={(role) => router.push(`/roles/${role.id}`)}
            />
          ) : (
            <EmptyState
              title={
                search.trim()
                  ? t("states.noSearchResults")
                  : t("states.empty")
              }
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}