import { useQuery } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { getRolePermissions } from '../api/get-role-permissions.api';

export function useRolePermissionsQuery(roleId: string) {
  return useQuery({
    queryKey: rolesKeys.permissions(roleId),

    queryFn: () => getRolePermissions(roleId),

    enabled: Boolean(roleId.trim()),

    staleTime: 1000 * 60,
  });
}