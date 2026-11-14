import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

export interface DeleteRoleResult {
  id: string;
}

export async function deleteRole(
  roleId: string,
): Promise<ApiResponse<DeleteRoleResult>> {
  const response = await api.delete<ApiResponse<DeleteRoleResult>>(
    `/roles/${encodeURIComponent(roleId)}`,
  );

  return response.data;
}