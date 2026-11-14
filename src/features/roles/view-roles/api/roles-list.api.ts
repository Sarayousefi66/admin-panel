import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { Role } from '../../shared/types/role.types';

export async function getRoles(): Promise<ApiResponse<Role[]>> {
  const response = await api.get<ApiResponse<Role[]>>('/roles');

  return response.data;
}