"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

import { handleMutationError } from "@/shared/lib/mutation-handlers";
import { getQueryClient } from "@/shared/lib/react-query";
import { appToast } from "@/shared/lib/toast";

import { logout } from "../api/auth.api";

export function useLogout() {
  const router = useRouter();

  const t = useTranslations("notifications");
  const errorT = useTranslations("errors");

  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: async () => {
      appToast.success(t("logoutSuccess"));

      await queryClient.removeQueries({
        queryKey: ["me"],
      });

      router.push("/login");
    },

    onError: (error) => {
      handleMutationError(error, errorT);
    },
  });
}