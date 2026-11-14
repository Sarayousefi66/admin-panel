import type {
  PermissionAction,
  PermissionKey,
  PermissionResource,
} from '../constants/permission-catalog';

import type { Role } from '@/features/roles/shared/types/role.types';

export interface Permission {
  id: string;
  key: PermissionKey;
  resource: PermissionResource;
  action: PermissionAction;
  labelKey: string;
}

export interface UserRoleAssignment {
  id: string;
  userId: number;
  roleId: string;
  assignedAt?: string;
}

export interface UserAccessSnapshot {
  roles: Role[];
  permissions: PermissionKey[];
}

export interface AssignUserRolePayload {
  userId: number;
  roleId: string;
}

export interface AccessControlListResponse<T> {
  items: T[];
  total: number;
}