"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { ErrorState } from "@/shared/components/common/error-state";
import { getErrorMessage } from "@/shared/lib/api-error";
import { appToast } from "@/shared/lib/toast";

import { usePermission } from "@/features/auth/hooks/use-permission";

import { useAssignRolePermission } from "../../assign-role-permission/hooks/use-assign-role-permission";
import { useRevokeRolePermission } from "../../revoke-role-permission/hooks/use-revoke-role-permission";
import { useRolePermissionsQuery } from "../hooks/use-role-permissions-query";

interface Props {
  roleId: string;
}

export function RolePermissionsPanel({ roleId }: Props) {
  const t = useTranslations("roles.permissions");
  const permissionT = useTranslations("permissions");
  const errorT = useTranslations("errors");

  const { canAccess } = usePermission();
  const canManage = canAccess("roles.assignPermissions");

  const {
    data,
    isLoading,
    error,
  } = useRolePermissionsQuery(roleId);

  const {
    mutate: assignPermission,
    isPending: isAssigning,
  } = useAssignRolePermission();

  const {
    mutate: revokePermission,
    isPending: isRevoking,
  } = useRevokeRolePermission();

const permissions = useMemo(
  () => data?.data?.permissions ?? [],
  [data?.data?.permissions],
);

const assignedPermissionIds = useMemo(
  () => data?.data?.assignedPermissionIds ?? [],
  [data?.data?.assignedPermissionIds],
);

  const assignedSet = useMemo(
    () => new Set(assignedPermissionIds),
    [assignedPermissionIds],
  );

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, typeof permissions>();

    for (const permission of permissions) {
      const current = groups.get(permission.resource) ?? [];

      current.push(permission);
      groups.set(permission.resource, current);
    }

    return Array.from(groups.entries());
  }, [permissions]);

  const isPending = isAssigning || isRevoking;

  const handlePermissionChange = (
    permissionId: string,
    checked: boolean,
  ) => {
    const variables = {
      roleId,
      permissionId,
    };

    const mutation = checked ? assignPermission : revokePermission;

    mutation(variables, {
      onError: (mutationError) => {
        appToast.error(getErrorMessage(mutationError, errorT));
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border p-6">
        <div className="flex min-h-32 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t("errorTitle")}
        description={getErrorMessage(error)}
      />
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border p-0 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-border bg-muted/20 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold">
              {t("title")}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>

        {!canManage && (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {t("readOnly")}
          </p>
        )}
      </div>

      {permissions.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {groupedPermissions.map(([resource, resourcePermissions]) => (
            <section
              key={resource}
              className="space-y-4 px-5 py-5 sm:px-6"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {t(`resources.${resource}`)}
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {resourcePermissions.map((permission) => {
                  const checked = assignedSet.has(permission.id);

                  return (
                    <label
                      key={permission.id}
                      className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3 py-3 transition-colors hover:bg-muted/30 has-[:disabled]:cursor-not-allowed"
                    >
                      <Checkbox
                        checked={checked}
                        disabled={!canManage || isPending}
                        onCheckedChange={(value) =>
                          handlePermissionChange(
                            permission.id,
                            value === true,
                          )
                        }
                      />

                      <span className="min-w-0 flex-1 text-sm">
                        {permissionT(
                          `${permission.resource}.${permission.action}`,
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Card>
  );
}