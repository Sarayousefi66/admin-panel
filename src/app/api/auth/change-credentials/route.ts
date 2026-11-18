import { NextRequest, NextResponse } from 'next/server';

import {
    hashPassword,
    isValidPassword,
    isValidUsername,
    normalizeUsername,
    verifyPassword,
} from '@/shared/lib/auth-crypto';

import { findCredentialByUsername } from '@/shared/lib/auth-session';
import { fetchMockApi } from '@/shared/lib/mock-api';
import { resolveAuthenticatedSession } from '@/shared/lib/server-auth';

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const authentication = await resolveAuthenticatedSession(request);

  if (!authentication.authenticated) {
    return errorResponse(
      authentication.message,
      authentication.status,
    );
  }

  const { user, credential, mustChangeCredentials } =
    authentication.data;

  if (!mustChangeCredentials) {
    return errorResponse(
      'Credential change is not required',
      409,
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request body', 400);
  }

  if (!isObject(body)) {
    return errorResponse('Invalid request body', 400);
  }

  const username =
    typeof body.username === 'string'
      ? normalizeUsername(body.username)
      : '';

  const password =
    typeof body.password === 'string' ? body.password : '';

  if (!isValidUsername(username)) {
    return errorResponse('Invalid username', 400);
  }

  if (!isValidPassword(password)) {
    return errorResponse('Invalid password', 400);
  }

  if (username === credential.username) {
    return errorResponse(
      'New username must be different from the initial username',
      400,
    );
  }

  const isSamePassword = await verifyPassword(
    password,
    credential.salt,
    credential.passwordHash,
  );

  if (isSamePassword) {
    return errorResponse(
      'New password must be different from the initial password',
      400,
    );
  }

  try {
    const existingCredential =
      await findCredentialByUsername(username);

    if (existingCredential) {
      return errorResponse('Username already exists', 409);
    }

    if (credential.id === undefined || credential.id === null) {
      return errorResponse(
        'User credential record is invalid',
        503,
      );
    }

    const passwordCredentials = await hashPassword(password);

    const updateResponse = await fetchMockApi(
      `/credentials/${encodeURIComponent(String(credential.id))}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          username,
          salt: passwordCredentials.salt,
          passwordHash: passwordCredentials.passwordHash,
          mustChangeCredentials: false,
          updatedAt: new Date().toISOString(),
        }),
      },
    );

    if (!updateResponse.ok) {
      return errorResponse(
        'Failed to update login credentials',
        503,
      );
    }

    return NextResponse.json(
      {
        success: true,
        mustChangeCredentials: false,
        userId: user.id,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch {
    return errorResponse(
      'Credential update service is unavailable',
      503,
    );
  }
}