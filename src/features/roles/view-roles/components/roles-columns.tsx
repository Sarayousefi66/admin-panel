import type { ColumnDef } from "@tanstack/react-table";

import type { Role } from "../../shared/types/role.types";
import { RoleActions } from "./role-actions";

export function createRoleColumns(
  t: (key: "name" | "slug" | "description") => string,
  systemLabel: string,
  customLabel: string,
): ColumnDef<Role>[] {
  return [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">
              {role.name}
            </span>

            <span
              className={
                role.isSystem
                  ? "inline-flex shrink-0 items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                  : "inline-flex shrink-0 items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              }
            >
              {role.isSystem ? systemLabel : customLabel}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "slug",
      header: t("slug"),
      cell: ({ row }) => (
        <span dir="ltr" className="text-start text-sm text-muted-foreground">
          {row.original.slug}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: t("description"),
      cell: ({ row }) => (
        <span className="block max-w-sm truncate text-sm text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 48,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <RoleActions role={row.original} />
        </div>
      ),
    },
  ];
}