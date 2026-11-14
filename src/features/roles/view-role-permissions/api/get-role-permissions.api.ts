import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { RolePermissionsData } from '../../shared/types/role.types';

export async function getRolePermissions(
  roleId: string,
): Promise<ApiResponse<RolePermissionsData>> {
  const response = await api.get<ApiResponse<RolePermissionsData>>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
  );

  return response.data;
}
