
import type { ColumnDef } from "@tanstack/react-table";

import { ProductImage } from "../../shared/components/product-image";
import type { Product } from "../../shared/types/product.types";
import { ProductActions } from "./product-actions";

export function createProductColumns(
  t: (key: "title" | "price") => string,
  imageAlt: string,
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "title",
      header: t("title"),
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-3">
          <ProductImage
            src={row.original.image}
            alt={imageAlt}
            variant="thumbnail"
          />

          <span className="min-w-0 truncate text-sm font-medium">
            {row.original.title}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: t("price"),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row.original.price}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 48,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ProductActions id={row.original.id} />
        </div>
      ),
    },
  ];
}
