"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

import { handleMutationError } from "@/shared/lib/mutation-handlers";
import { appToast } from "@/shared/lib/toast";

import { login } from "../api/auth.api";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const t = useTranslations("notifications");
  const errorT = useTranslations("errors");

  return useMutation({
    mutationFn: login,

    onSuccess: () => {
      appToast.success(t("loginSuccess"));

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      router.push("/products");
    },

    onError: (error) => {
      handleMutationError(error, errorT);
    },
  });
}