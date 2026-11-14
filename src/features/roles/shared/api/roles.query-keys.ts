export const rolesKeys = {
  all: ['roles'] as const,

  lists: () => [...rolesKeys.all, 'list'] as const,

  list: () => [...rolesKeys.lists()] as const,

  details: () => [...rolesKeys.all, 'detail'] as const,

  detail: (roleId: string) =>
    [...rolesKeys.details(), roleId] as const,

  permissions: (roleId: string) =>
    [...rolesKeys.detail(roleId), 'permissions'] as const,
};