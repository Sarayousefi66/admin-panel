export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
}

export interface RolePermissionOption {
  id: string;
  key: string;
  resource: string;
  action: string;
  labelKey?: string;
}

export interface RolePermissionsData {
  permissions: RolePermissionOption[];
  assignedPermissionIds: string[];
}

export interface CreateRolePayload {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface AssignRolePermissionPayload {
  roleId: string;
  permissionId: string;
}