
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";

import type {
  Role,
  RolePermission,
} from '@/features/roles/shared/types/role.types';

import type { UserRoleAssignment } from '@/features/access-control/shared/types/access-control.types';

import { fetchMockApi } from "@/shared/lib/mock-api";
import { authorizeApiRequest } from "@/shared/lib/server-auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

function isUpdateRoleRequest(
  value: unknown,
): value is UpdateRoleRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;

  const hasName = Object.prototype.hasOwnProperty.call(body, "name");
  const hasDescription = Object.prototype.hasOwnProperty.call(
    body,
    "description",
  );

  if (!hasName && !hasDescription) {
    return false;
  }

  if (
    hasName &&
    (typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 80)
  ) {
    return false;
  }

  if (
    hasDescription &&
    (typeof body.description !== "string" ||
      body.description.length > 500)
  ) {
    return false;
  }

  return true;
}

async function getRole(id: string): Promise<Role | null> {
  const response = await fetchMockApi(
    `/roles/${encodeURIComponent(id)}`,
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as Role;
}

async function getCollection<T>(
  path: string,
): Promise<T[] | null> {
  const response = await fetchMockApi(path);

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();

  return Array.isArray(data) ? (data as T[]) : null;
}

/**
 * GET /api/access-control/roles/:id
 */
export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(request, [
    "roles.view",
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const { id } = await context.params;

  if (!id.trim()) {
    return errorResponse("Invalid role ID", 400);
  }

  try {
    const role = await getRole(id);

    if (!role) {
      return errorResponse("Role not found", 404);
    }

    return successResponse(role);
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}

/**
 * PATCH /api/access-control/roles/:id
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(request, [
    "roles.edit",
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const { id } = await context.params;

  if (!id.trim()) {
    return errorResponse("Invalid role ID", 400);
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    if (!isUpdateRoleRequest(body)) {
      return errorResponse("Invalid role data", 400);
    }

    const existingRole = await getRole(id);

    if (!existingRole) {
      return errorResponse("Role not found", 404);
    }

    if (existingRole.isSystem) {
      return errorResponse("System roles cannot be modified", 403);
    }

    const patch: UpdateRoleRequest = {
      ...(body.name !== undefined
        ? { name: body.name.trim() }
        : {}),
      ...(body.description !== undefined
        ? { description: body.description.trim() }
        : {}),
    };

    if (patch.name) {
      const roles = await getCollection<Role>("/roles");

      if (!roles) {
        return errorResponse("Failed to validate role name", 503);
      }

      const duplicateName = roles.some(
        (role) =>
          role.id !== id &&
          role.name.trim().toLowerCase() ===
            patch.name!.toLowerCase(),
      );

      if (duplicateName) {
        return errorResponse("Role name already exists", 409);
      }
    }

    const response = await fetchMockApi(
      `/roles/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...patch,
          updatedAt: new Date().toISOString(),
        }),
      },
    );

    if (!response.ok) {
      return errorResponse("Failed to update role", response.status);
    }

    const updatedRole = (await response.json()) as Role;

    return successResponse(updatedRole, "Role updated");
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}

/**
 * DELETE /api/access-control/roles/:id
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(request, [
    "roles.delete",
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const { id } = await context.params;

  if (!id.trim()) {
    return errorResponse("Invalid role ID", 400);
  }

  try {
    const role = await getRole(id);

    if (!role) {
      return errorResponse("Role not found", 404);
    }

    if (role.isSystem) {
      return errorResponse("System roles cannot be deleted", 403);
    }

    const assignments = await getCollection<UserRoleAssignment>(
      `/userRoles?roleId=${encodeURIComponent(id)}`,
    );

    if (!assignments) {
      return errorResponse("Failed to validate role assignments", 503);
    }

    if (assignments.length > 0) {
      return errorResponse(
        "Role is assigned to users and cannot be deleted",
        409,
      );
    }

    const response = await fetchMockApi(
      `/roles/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      return errorResponse("Failed to delete role", response.status);
    }

    // Remove orphaned role-permission relations after the role is deleted.
    const rolePermissions = await getCollection<RolePermission>(
      `/rolePermissions?roleId=${encodeURIComponent(id)}`,
    );

    if (rolePermissions) {
      await Promise.allSettled(
        rolePermissions.map((item) =>
          fetchMockApi(
            `/rolePermissions/${encodeURIComponent(item.id)}`,
            { method: "DELETE" },
          ),
        ),
      );
    }

    return successResponse({ id }, "Role deleted");
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}
