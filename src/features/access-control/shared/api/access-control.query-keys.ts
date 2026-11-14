export const accessControlKeys = {
  all: ['access-control'] as const,

  assignableRoles: () =>
    [...accessControlKeys.all, 'assignable-roles'] as const,

  userRoles: (userId: number) =>
    [...accessControlKeys.all, 'users', userId, 'roles'] as const,
};