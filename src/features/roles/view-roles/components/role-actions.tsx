"use client";

import { MoreHorizontal, Pencil, Settings2, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/navigation";

import { ConfirmDialog } from "@/shared/components/common/confirm-dialog";
import { getErrorMessage } from "@/shared/lib/api-error";
import { appToast } from "@/shared/lib/toast";

import { usePermission } from "@/features/auth/hooks/use-permission";

import { useDeleteRole } from "../../delete-role/hooks/use-delete-role";
import type { Role } from "../../shared/types/role.types";
import { EditRoleDialog } from "../../update-role/components/edit-role-dialog";

interface Props {
  role: Role;
}

export function RoleActions({ role }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";

  const t = useTranslations("roles.actions");
  const messagesT = useTranslations("roles.messages");
  const errorT = useTranslations("errors");

  const { canAccess } = usePermission();

  const canEdit =
    !role.isSystem && canAccess("roles.edit");

  const canDelete =
    !role.isSystem && canAccess("roles.delete");

  const { mutate: deleteRole, isPending } = useDeleteRole();

  const handleDelete = () => {
    deleteRole(role.id, {
      onSuccess: () => {
        appToast.success(messagesT("deleteSuccess"));
        setDeleteOpen(false);
      },
      onError: (error) => {
        appToast.error(getErrorMessage(error, errorT));
      },
    });
  };

  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              aria-label={t("open")}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            style={{ direction }}
            className="w-52 rounded-xl p-1"
          >
            <DropdownMenuItem asChild>
              <Link
                href={`/roles/${role.id}`}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg py-2"
              >
                <Settings2 className="size-4 shrink-0" />
                <span>{t("managePermissions")}</span>
              </Link>
            </DropdownMenuItem>

            {canEdit && (
              <EditRoleDialog
                role={role}
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                    className="cursor-pointer gap-2 rounded-lg py-2"
                  >
                    <Pencil className="size-4 shrink-0" />
                    <span>{t("edit")}</span>
                  </DropdownMenuItem>
                }
              />
            )}

            {(canEdit || canDelete) && <DropdownMenuSeparator className="my-1" />}

            {canDelete && (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setDeleteOpen(true);
                }}
                className="cursor-pointer gap-2 rounded-lg py-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 shrink-0" />
                <span>{t("delete")}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {canDelete && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={t("deleteTitle")}
          description={t("deleteDescription")}
          confirmText={t("confirmDelete")}
          loading={isPending}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}