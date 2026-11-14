import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type {
  CreateRolePayload,
  Role,
} from '../../shared/types/role.types';

export async function createRole(
  payload: CreateRolePayload,
): Promise<ApiResponse<Role>> {
  const response = await api.post<ApiResponse<Role>>(
    '/roles',
    payload,
  );

  return response.data;
}