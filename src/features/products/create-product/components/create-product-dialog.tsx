
"use client";

import { PackagePlus, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateProductForm } from "./create-product-form";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("products");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 rounded-lg shadow-sm">
          <Plus className="me-2 size-4" />
          {t("create")}
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-y-auto rounded-2xl border-border bg-card p-0 shadow-2xl sm:max-w-[38rem]"
      >
        <DialogHeader className="shrink-0 border-b border-border bg-muted/30 px-6 py-4 text-start pe-0 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PackagePlus className="size-4" />
              </div>

              <div className="min-w-0 space-y-0.5">
                <DialogTitle className="text-sm font-semibold leading-5 text-foreground">
                  {t("form.createTitle")}
                </DialogTitle>

                <DialogDescription className="text-xs leading-5 text-muted-foreground">
                  {t("form.manageDescription")}
                </DialogDescription>
              </div>
            </div>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close dialog"
                title="Close"
                className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
                <span className="sr-only">Close dialog</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="mt-6 min-w-0">
          <CreateProductForm
            variant="dialog"
            onCreated={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
