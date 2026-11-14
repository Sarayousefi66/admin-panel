import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { revokeRolePermission } from '../api/revoke-role-permission.api';

export function useRevokeRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeRolePermission,

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