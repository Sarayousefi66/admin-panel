
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import type { User } from '@/features/users/shared/types/user.types';

import {
  createSessionToken,
  isValidUsername,
  normalizeUsername,
  verifyPassword,
} from '@/shared/lib/auth-crypto';

import {
  createAuthSession,
  findCredentialByUsername,
  SESSION_TTL_SECONDS,
} from '@/shared/lib/auth-session';

import { fetchMockApi } from '@/shared/lib/mock-api';

import { resolveUserAccess } from '@/features/access-control/shared/services/permission-resolver.service';

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function invalidCredentials() {
  return NextResponse.json(
    {
      message: 'Invalid credentials',
    },
    {
      status: 401,
    },
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isObject(body)) {
      return invalidCredentials();
    }

    const username =
      typeof body.username === 'string'
        ? normalizeUsername(body.username)
        : '';

    const password =
      typeof body.password === 'string'
        ? body.password
        : '';

    if (
      !isValidUsername(username) ||
      password.length === 0 ||
      password.length > 128
    ) {
      return invalidCredentials();
    }

    const credential = await findCredentialByUsername(username);

    if (!credential) {
      return invalidCredentials();
    }

    const passwordIsValid = await verifyPassword(
      password,
      credential.salt,
      credential.passwordHash,
    );

    if (!passwordIsValid) {
      return invalidCredentials();
    }

    const userResponse = await fetchMockApi(
      `/users/${credential.userId}`,
    );

    if (userResponse.status === 404) {
      return invalidCredentials();
    }

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          message: 'Authentication service unavailable',
        },
        {
          status: 503,
        },
      );
    }

    const baseUser = (await userResponse.json()) as User;

    if (
      baseUser.status !== undefined &&
      baseUser.status !== 'active'
    ) {
      return NextResponse.json(
        {
          message: 'User account is inactive',
        },
        {
          status: 403,
        },
      );
    }

    const access = await resolveUserAccess(baseUser);

    const token = createSessionToken();

    await createAuthSession(baseUser.id, token);

    const response = NextResponse.json({
      success: true,
      user: {
        ...baseUser,
        ...access,
        name: `${baseUser.firstName} ${baseUser.lastName}`,
      },
      mustChangeCredentials:
        credential.mustChangeCredentials === true,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        message: 'Login service is unavailable',
      },
      {
        status: 503,
      },
    );
  }
}
