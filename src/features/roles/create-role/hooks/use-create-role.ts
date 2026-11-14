import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { createRole } from '../api/create-role.api';

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
    },
  });
}