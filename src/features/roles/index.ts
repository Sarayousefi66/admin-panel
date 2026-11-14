export { getRoles } from './view-roles/api/roles-list.api';
export { useRolesQuery } from './view-roles/hooks/use-roles-query';

export { getRole } from './view-role/api/get-role.api';
export { useRoleQuery } from './view-role/hooks/use-role-query';

export { createRole } from './create-role/api/create-role.api';
export { useCreateRole } from './create-role/hooks/use-create-role';

export { updateRole } from './update-role/api/update-role.api';
export { useUpdateRole } from './update-role/hooks/use-update-role';

export { deleteRole } from './delete-role/api/delete-role.api';
export { useDeleteRole } from './delete-role/hooks/use-delete-role';

export {
  getRolePermissions
} from './view-role-permissions/api/get-role-permissions.api';

export {
  useRolePermissionsQuery
} from './view-role-permissions/hooks/use-role-permissions-query';

export {
  assignRolePermission
} from './assign-role-permission/api/assign-role-permission.api';

export {
  useAssignRolePermission
} from './assign-role-permission/hooks/use-assign-role-permission';

export {
  revokeRolePermission
} from './revoke-role-permission/api/revoke-role-permission.api';

export {
  useRevokeRolePermission
} from './revoke-role-permission/hooks/use-revoke-role-permission';

export type {
  AssignRolePermissionPayload, CreateRolePayload, Role,
  RolePermission,
  RolePermissionOption,
  RolePermissionsData, UpdateRolePayload
} from './shared/types/role.types';
