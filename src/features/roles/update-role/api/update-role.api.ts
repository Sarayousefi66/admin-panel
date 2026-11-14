import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type {
  Role,
  UpdateRolePayload,
} from '../../shared/types/role.types';

export interface UpdateRoleVariables {
  roleId: string;
  payload: UpdateRolePayload;
}

export async function updateRole({
  roleId,
  payload,
}: UpdateRoleVariables): Promise<ApiResponse<Role>> {
  const response = await api.patch<ApiResponse<Role>>(
    `/roles/${encodeURIComponent(roleId)}`,
    payload,
  );

  return response.data;
}