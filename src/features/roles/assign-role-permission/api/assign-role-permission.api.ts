import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type {
    AssignRolePermissionPayload,
    RolePermission,
} from '../../shared/types/role.types';

export async function assignRolePermission({
  roleId,
  permissionId,
}: AssignRolePermissionPayload): Promise<ApiResponse<RolePermission>> {
  const response = await api.post<ApiResponse<RolePermission>>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
    { permissionId },
  );

  return response.data;
}