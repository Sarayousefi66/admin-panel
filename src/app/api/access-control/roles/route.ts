
import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

import { errorResponse, successResponse } from "@/lib/api-response";

import type { Role } from "@/features/roles/shared/types/role.types";

import { fetchMockApi } from "@/shared/lib/mock-api";
import { authorizeApiRequest } from "@/shared/lib/server-auth";

interface CreateRoleRequest {
  name: string;
  slug: string;
  description?: string;
}

function isCreateRoleRequest(
  value: unknown,
): value is CreateRoleRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";

  const description = body.description;

  return (
    name.length >= 2 &&
    name.length <= 80 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length <= 60 &&
    (description === undefined ||
      (typeof description === "string" && description.length <= 500))
  );
}

async function getRoles(): Promise<Role[] | null> {
  const response = await fetchMockApi("/roles");

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();

  return Array.isArray(data) ? (data as Role[]) : null;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(request);

  if (!authorization.authorized) {
    return authorization.response;
  }

  // Keep this compatibility for assigning roles to users.
  const canViewRoles =
    authorization.user.permissions?.includes("users.changeRole") ||
    authorization.user.permissions?.includes("roles.view");

  if (!canViewRoles) {
    return errorResponse("Forbidden", 403);
  }

  try {
    const response = await fetchMockApi("/roles?_sort=name&_order=asc");

    if (!response.ok) {
      return errorResponse("Failed to fetch roles", response.status);
    }

    const roles = (await response.json()) as Role[];

    return successResponse(roles);
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeApiRequest(request, [
    "roles.create",
  ]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    if (!isCreateRoleRequest(body)) {
      return errorResponse("Invalid role data", 400);
    }

    const name = body.name.trim();
    const slug = body.slug.trim();
    const description = body.description?.trim() ?? "";

    const roles = await getRoles();

    if (!roles) {
      return errorResponse("Failed to validate role data", 503);
    }

    const duplicateRole = roles.some(
      (role) =>
        role.slug.toLowerCase() === slug.toLowerCase() ||
        role.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (duplicateRole) {
      return errorResponse("Role name or slug already exists", 409);
    }

    const now = new Date().toISOString();

    const newRole: Role = {
      id: `role-${randomUUID()}`,
      name,
      slug,
      description,
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    };

    const response = await fetchMockApi("/roles", {
      method: "POST",
      body: JSON.stringify(newRole),
    });

    if (!response.ok) {
      return errorResponse("Failed to create role", response.status);
    }

    const createdRole = (await response.json()) as Role;

    return successResponse(createdRole, "Role created", 201);
  } catch {
    return errorResponse("Roles service is unavailable", 503);
  }
}
