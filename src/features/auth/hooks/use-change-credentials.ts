'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { handleMutationError } from '@/shared/lib/mutation-handlers';
import { appToast } from '@/shared/lib/toast';

import { changeCredentials } from '../api/auth.api';

export function useChangeCredentials() {
  const queryClient = useQueryClient();

  const t = useTranslations('notifications');
  const errorT = useTranslations('errors');

  return useMutation({
    mutationFn: changeCredentials,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['me'],
      });

      appToast.success(t('credentialsChanged'));

      // AuthGuard receives mustChangeCredentials=false
      // and redirects the user to the dashboard.
    },

    onError: (error) => {
      handleMutationError(error, errorT);
    },
  });
}