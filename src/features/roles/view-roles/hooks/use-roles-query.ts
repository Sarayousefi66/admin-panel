import { useQuery } from '@tanstack/react-query';

import { rolesListQuery } from '../api/roles.query-options';

export function useRolesQuery() {
  return useQuery(rolesListQuery());
}