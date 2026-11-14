import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type {
    AssignRolePermissionPayload,
    RolePermission,
} from '../../shared/types/role.types';

export async function revokeRolePermission({
  roleId,
  permissionId,
}: AssignRolePermissionPayload): Promise<ApiResponse<RolePermission>> {
  const response = await api.delete<ApiResponse<RolePermission>>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
    {
      params: { permissionId },
    },
  );

  return response.data;
}