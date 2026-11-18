import type { NextRequest, NextResponse } from 'next/server';

import { errorResponse } from '@/lib/api-response';

import type { User } from '@/features/users/shared/types/user.types';

import { fetchMockApi } from '@/shared/lib/mock-api';
import { hasPermission } from '@/shared/lib/permissions';

import {
  deleteAuthSession,
  findCredentialByUserId,
  findSessionsByToken,
  type AuthCredential,
  type AuthSession,
} from '@/shared/lib/auth-session';

import { resolveUserAccess } from '@/features/access-control/shared/services/permission-resolver.service';

interface AuthenticatedSession {
  user: User;
  credential: AuthCredential;
  mustChangeCredentials: boolean;
  session: AuthSession;
}

export type AuthenticationResult =
  | {
      authenticated: true;
      data: AuthenticatedSession;
    }
  | {
      authenticated: false;
      status: 401 | 403 | 503;
      message: string;
    };

type AuthorizationResult =
  | {
      authorized: true;
      user: User;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

export async function resolveAuthenticatedSession(
  request: NextRequest,
): Promise<AuthenticationResult> {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return {
      authenticated: false,
      status: 401,
      message: 'Unauthorized',
    };
  }

  try {
    const sessions = await findSessionsByToken(token);

    if (sessions.length === 0) {
      return {
        authenticated: false,
        status: 401,
        message: 'Unauthorized',
      };
    }

    if (sessions.length !== 1) {
      return {
        authenticated: false,
        status: 503,
        message: 'Invalid authentication session',
      };
    }

    const session = sessions[0];
    const expirationTime = Date.parse(session.expiresAt);

    if (
      !Number.isFinite(expirationTime) ||
      expirationTime <= Date.now()
    ) {
      await deleteAuthSession(session.id).catch(() => undefined);

      return {
        authenticated: false,
        status: 401,
        message: 'Session expired',
      };
    }

    const userId = Number(session.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return {
        authenticated: false,
        status: 401,
        message: 'Unauthorized',
      };
    }

    const credential = await findCredentialByUserId(userId);

    if (!credential) {
      return {
        authenticated: false,
        status: 401,
        message: 'Unauthorized',
      };
    }

    const response = await fetchMockApi(`/users/${userId}`);

    if (response.status === 404) {
      return {
        authenticated: false,
        status: 401,
        message: 'Unauthorized',
      };
    }

    if (!response.ok) {
      return {
        authenticated: false,
        status: 503,
        message: 'Authentication service unavailable',
      };
    }

    const baseUser = (await response.json()) as User;

    if (
      baseUser.status !== undefined &&
      baseUser.status !== 'active'
    ) {
      return {
        authenticated: false,
        status: 403,
        message: 'User account is inactive',
      };
    }

    const access = await resolveUserAccess(baseUser);

    const user: User = {
      ...baseUser,
      ...access,
    };

    return {
      authenticated: true,
      data: {
        user,
        credential,
        mustChangeCredentials:
          credential.mustChangeCredentials === true,
        session,
      },
    };
  } catch {
    return {
      authenticated: false,
      status: 503,
      message: 'Authentication service unavailable',
    };
  }
}

export async function authorizeApiRequest(
  request: NextRequest,
  requiredPermissions: string[] = [],
): Promise<AuthorizationResult> {
  const authentication = await resolveAuthenticatedSession(request);

  if (!authentication.authenticated) {
    return {
      authorized: false,
      response: errorResponse(
        authentication.message,
        authentication.status,
      ),
    };
  }

  if (authentication.data.mustChangeCredentials) {
    return {
      authorized: false,
      response: errorResponse(
        'You must change your login credentials before accessing this resource',
        403,
      ),
    };
  }

  const user = authentication.data.user;

  const allowed = requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );

  if (!allowed) {
    return {
      authorized: false,
      response: errorResponse('Forbidden', 403),
    };
  }

  return {
    authorized: true,
    user,
  };
}

export function hasApiPermissions(
  user: User,
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );
}