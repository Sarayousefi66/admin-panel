
"use client";

import {
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
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

import { useDeleteProduct } from "../../delete-product/hooks/use-delete-product";

interface Props {
  id: number;
}

export function ProductActions({ id }: Props) {
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";

  const t = useTranslations("products.actions");

  const {
    mutate: deleteProduct,
    isPending,
  } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: () => setOpen(false),
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
            className="w-48 rounded-xl p-1"
          >
            <DropdownMenuItem asChild>
              <Link
                href={`/products/${id}`}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg py-2"
              >
                <Eye className="size-4 shrink-0" />
                <span>{t("view")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/products/edit/${id}`}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg py-2"
              >
                <Pencil className="size-4 shrink-0" />
                <span>{t("edit")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="cursor-pointer gap-2 rounded-lg py-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 shrink-0" />
              <span>{t("delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmText={t("confirmDelete")}
        loading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
