import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { deleteRole } from '../api/delete-role.api';

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
    },
  });
}