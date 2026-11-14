import { useQuery } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { getRole } from '../api/get-role.api';

export function useRoleQuery(roleId: string) {
  return useQuery({
    queryKey: rolesKeys.detail(roleId),

    queryFn: () => getRole(roleId),

    enabled: Boolean(roleId.trim()),

    staleTime: 1000 * 60,
  });
}