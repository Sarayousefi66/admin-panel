"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { getErrorMessage } from "@/shared/lib/api-error";
import { appToast } from "@/shared/lib/toast";

import { RoleFormField } from "../../shared/components/role-form-field";
import type {
    Role,
    UpdateRolePayload,
} from "../../shared/types/role.types";

import {
    updateRoleFormSchema,
    type UpdateRoleFormValues,
} from "../schemas/update-role-form.schema";

import { useUpdateRole } from "../hooks/use-update-role";

interface Props {
  role: Role;
  onUpdated: () => void;
}

export function EditRoleForm({ role, onUpdated }: Props) {
  const t = useTranslations("roles.form");
  const validationT = useTranslations("roles.validation");
  const errorT = useTranslations("errors");
  const messagesT = useTranslations("roles.messages");

  const formId = useId();

  const { mutate: updateRole, isPending } = useUpdateRole();

  const schema = useMemo(
    () =>
      updateRoleFormSchema({
        nameMin: validationT("nameMin"),
        nameMax: validationT("nameMax"),
        descriptionMax: validationT("descriptionMax"),
      }),
    [validationT],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role.name,
      description: role.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: role.name,
      description: role.description ?? "",
    });
  }, [role, reset]);

  const handleFormSubmit = (values: UpdateRoleFormValues) => {
    const payload: UpdateRolePayload = {
      name: values.name,
      description: values.description,
    };

    updateRole(
      {
        roleId: role.id,
        payload,
      },
      {
        onSuccess: () => {
          appToast.success(messagesT("updateSuccess"));
          onUpdated();
        },
        onError: (error) => {
          appToast.error(getErrorMessage(error, errorT));
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      aria-busy={isPending}
      className="grid w-full grid-cols-1 gap-6 px-6 pb-6 sm:grid-cols-2 sm:px-7"
    >
      {/* Role name */}
      <div className="sm:col-span-2">
        <RoleFormField
          id={`${formId}-name`}
          label={t("name")}
          placeholder={t("name")}
          registration={register("name")}
          error={errors.name?.message}
        />
      </div>

      {/* Role slug - Read only */}
      <div className="flex min-w-0 flex-col gap-2.5 sm:col-span-2">
        <label
          htmlFor={`${formId}-slug`}
          className="text-sm font-medium text-foreground"
        >
          {t("slug")}
        </label>

        <input
          id={`${formId}-slug`}
          type="text"
          value={role.slug}
          readOnly
          dir="ltr"
          className="h-11 w-full rounded-xl border border-border bg-muted/40 px-3 text-start text-sm text-muted-foreground outline-none"
        />

        <p className="text-xs leading-5 text-muted-foreground">
          {t("slugReadonly")}
        </p>
      </div>

      {/* Role description */}
      <div className="sm:col-span-2">
        <RoleFormField
          id={`${formId}-description`}
          label={t("description")}
          placeholder={t("description")}
          registration={register("description")}
          error={errors.description?.message}
          multiline
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end border-t border-border pt-5 sm:col-span-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 w-full min-w-36 rounded-xl px-6 shadow-sm sm:w-auto"
        >
          {isPending ? t("saving") : t("update")}
        </Button>
      </div>
    </form>
  );
}