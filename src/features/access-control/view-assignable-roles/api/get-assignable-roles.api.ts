import { api } from '@/shared/lib/axios';

import type { ApiResponse } from '@/shared/types/api-response';

import type { Role } from '@/features/roles/shared/types/role.types';

export async function getAssignableRoles(): Promise<ApiResponse<Role[]>> {
  const response = await api.get<ApiResponse<Role[]>>(
    '/access-control/roles',
  );

  return response.data;
}
