import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { updateRole } from '../api/update-role.api';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
    },
  });
}