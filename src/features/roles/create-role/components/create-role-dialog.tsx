"use client";

import { Plus, ShieldPlus, X } from "lucide-react";
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

import { CreateRoleForm } from "./create-role-form";

export function CreateRoleDialog() {
  const [open, setOpen] = useState(false);

  const t = useTranslations("roles");
  const formT = useTranslations("roles.form");

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
                <ShieldPlus className="size-4" />
              </div>

              <div className="min-w-0 space-y-0.5">
                <DialogTitle className="text-sm font-semibold leading-5 text-foreground">
                  {formT("createTitle")}
                </DialogTitle>

                <DialogDescription className="text-xs leading-5 text-muted-foreground">
                  {formT("manageDescription")}
                </DialogDescription>
              </div>
            </div>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={formT("close")}
                className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="mt-6 min-w-0">
          <CreateRoleForm onCreated={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}