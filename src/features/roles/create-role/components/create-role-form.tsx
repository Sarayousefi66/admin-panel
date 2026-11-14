"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { getErrorMessage } from "@/shared/lib/api-error";
import { appToast } from "@/shared/lib/toast";

import { RoleFormField } from "../../shared/components/role-form-field";
import type { CreateRolePayload } from "../../shared/types/role.types";

import {
    createRoleFormSchema,
    type CreateRoleFormValues,
} from "../schemas/create-role-form.schema";

import { useCreateRole } from "../hooks/use-create-role";

interface Props {
  onCreated: () => void;
}

export function CreateRoleForm({ onCreated }: Props) {
  const t = useTranslations("roles.form");
  const validationT = useTranslations("roles.validation");
  const errorT = useTranslations("errors");
  const messagesT = useTranslations("roles.messages");

  const formId = useId();

  const { mutate: createRole, isPending } = useCreateRole();

  const schema = useMemo(
    () =>
      createRoleFormSchema({
        nameMin: validationT("nameMin"),
        nameMax: validationT("nameMax"),
        slugRequired: validationT("slugRequired"),
        slugFormat: validationT("slugFormat"),
        slugMax: validationT("slugMax"),
        descriptionMax: validationT("descriptionMax"),
      }),
    [validationT],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const handleFormSubmit = (values: CreateRoleFormValues) => {
    const payload: CreateRolePayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
    };

    createRole(payload, {
      onSuccess: () => {
        appToast.success(messagesT("createSuccess"));
        onCreated();
      },
      onError: (error) => {
        appToast.error(getErrorMessage(error, errorT));
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      aria-busy={isPending}
      className="grid w-full grid-cols-1 gap-6 px-6 pb-6 sm:grid-cols-2 sm:px-7"
    >
      <div className="sm:col-span-2">
        <RoleFormField
          id={`${formId}-name`}
          label={t("name")}
          placeholder={t("name")}
          registration={register("name")}
          error={errors.name?.message}
        />
      </div>

      <div className="sm:col-span-2">
        <RoleFormField
          id={`${formId}-slug`}
          label={t("slug")}
          placeholder="e.g. content-manager"
          registration={register("slug")}
          error={errors.slug?.message}
          dir="ltr"
        />
      </div>

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

      <div className="flex justify-end border-t border-border pt-5 sm:col-span-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 w-full min-w-36 rounded-xl px-6 shadow-sm sm:w-auto"
        >
          {isPending ? t("saving") : t("create")}
        </Button>
      </div>
    </form>
  );
}