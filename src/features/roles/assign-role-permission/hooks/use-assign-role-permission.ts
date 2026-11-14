import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { assignRolePermission } from '../api/assign-role-permission.api';

export function useAssignRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRolePermission,

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: rolesKeys.permissions(variables.roleId),
        }),
        queryClient.invalidateQueries({
          queryKey: ['me'],
        }),
      ]);
    },
  });
}