
"use client";

import { ArrowUpDown, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  sortBy?: string;
  order?: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: string) => void;
};

export function ProductsFilters({
  search,
  sortBy,
  order,
  onSearchChange,
  onSortChange,
  onOrderChange,
}: Props) {
  const t = useTranslations("products.filters");

  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("search")}
          className="h-9 rounded-lg ps-9 text-xs"
        />
      </div>

      {/* Sort field */}
      <Select
        dir={direction}
        value={sortBy || undefined}
        onValueChange={onSortChange}
      >
        <SelectTrigger className="h-9 w-full rounded-lg text-xs sm:w-40">
          <SelectValue placeholder={t("sortBy")} />
        </SelectTrigger>

        <SelectContent style={{ direction }}>
          <SelectItem value="title">
            {t("title")}
          </SelectItem>

          <SelectItem value="price">
            {t("price")}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Sort order */}
      <Select
        dir={direction}
        value={order || "asc"}
        onValueChange={onOrderChange}
      >
        <SelectTrigger className="h-9 w-full rounded-lg text-xs sm:w-40">
          <ArrowUpDown className="me-2 size-3.5 shrink-0 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>

        <SelectContent style={{ direction }}>
          <SelectItem value="asc">
            {t("ascending")}
          </SelectItem>

          <SelectItem value="desc">
            {t("descending")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
