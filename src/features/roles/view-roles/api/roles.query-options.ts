import { queryOptions } from '@tanstack/react-query';

import { rolesKeys } from '../../shared/api/roles.query-keys';

import { getRoles } from './roles-list.api';

export function rolesListQuery() {
  return queryOptions({
    queryKey: rolesKeys.list(),

    queryFn: getRoles,

    staleTime: 1000 * 60,
  });
}