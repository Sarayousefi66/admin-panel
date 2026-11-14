import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";

import type {
    Role,
    RolePermission,
    RolePermissionOption,
} from "@/features/roles/shared/types/role.types";

import { fetchMockApi } from "@/shared/lib/mock-api";
import { authorizeApiRequest } from "@/shared/lib/server-auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface AssignPermissionRequest {
  permissionId: string;
}

function isAssignPermissionRequest(
  value: unknown,
): value is AssignPermissionRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.permissionId === "string" &&
    body.permissionId.trim().length > 0
  );
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

async function getRolePermissions(
  roleId: string,
): Promise<RolePermission[] | null> {
  return getCollection<RolePermission>(
    `/rolePermissions?roleId=${encodeURIComponent(roleId)}`,
  );
}

/**
 * GET /api/roles/:id/permissions
 *
 * Returns all available permissions and the permissions
 * currently assigned to the requested role.
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

    const [permissions, rolePermissions] = await Promise.all([
      getCollection<RolePermissionOption>("/permissions"),
      getRolePermissions(id),
    ]);

    if (!permissions || !rolePermissions) {
      return errorResponse(
        "Failed to fetch role permissions",
        503,
      );
    }

    return successResponse({
      permissions,
      assignedPermissionIds: rolePermissions.map(
        (item) => String(item.permissionId),
      ),
    });
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}

/**
 * POST /api/roles/:id/permissions
 *
 * Assigns a permission to the requested role.
 */
export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(request, [
    "roles.assignPermissions",
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

    if (!isAssignPermissionRequest(body)) {
      return errorResponse("Invalid permission data", 400);
    }

    const permissionId = body.permissionId.trim();

    const role = await getRole(id);

    if (!role) {
      return errorResponse("Role not found", 404);
    }

    const [permissions, rolePermissions] = await Promise.all([
      getCollection<RolePermissionOption>("/permissions"),
      getRolePermissions(id),
    ]);

    if (!permissions || !rolePermissions) {
      return errorResponse(
        "Failed to validate permission assignment",
        503,
      );
    }

    const permissionExists = permissions.some(
      (permission) => String(permission.id) === permissionId,
    );

    if (!permissionExists) {
      return errorResponse("Permission not found", 404);
    }

    const existingAssignment = rolePermissions.find(
      (item) => String(item.permissionId) === permissionId,
    );

    if (existingAssignment) {
      return successResponse(
        existingAssignment,
        "Permission already assigned",
      );
    }

    const newAssignment: RolePermission = {
      id: `${id}::${permissionId}`,
      roleId: id,
      permissionId,
    };

    const response = await fetchMockApi("/rolePermissions", {
      method: "POST",
      body: JSON.stringify(newAssignment),
    });

    if (!response.ok) {
      return errorResponse(
        "Failed to assign permission",
        response.status,
      );
    }

    const assignedPermission =
      (await response.json()) as RolePermission;

    return successResponse(
      assignedPermission,
      "Permission assigned",
      201,
    );
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}

/**
 * DELETE /api/roles/:id/permissions?permissionId=...
 *
 * Removes a permission assignment without deleting
 * the permission itself.
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(request, [
    "roles.assignPermissions",
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const { id } = await context.params;

  if (!id.trim()) {
    return errorResponse("Invalid role ID", 400);
  }

  const permissionId = request.nextUrl.searchParams
    .get("permissionId")
    ?.trim();

  if (!permissionId) {
    return errorResponse("Permission ID is required", 400);
  }

  try {
    const role = await getRole(id);

    if (!role) {
      return errorResponse("Role not found", 404);
    }

    const rolePermissions = await getRolePermissions(id);

    if (!rolePermissions) {
      return errorResponse(
        "Failed to fetch role permissions",
        503,
      );
    }

    const assignment = rolePermissions.find(
      (item) => String(item.permissionId) === permissionId,
    );

    if (!assignment) {
      return errorResponse("Role permission not found", 404);
    }

    const response = await fetchMockApi(
      `/rolePermissions/${encodeURIComponent(assignment.id)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      return errorResponse(
        "Failed to revoke permission",
        response.status,
      );
    }

    return successResponse(
      assignment,
      "Permission revoked",
    );
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}