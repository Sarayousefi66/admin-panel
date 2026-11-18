
import { fetchMockApi } from '@/shared/lib/mock-api';
import { hashSessionToken } from './auth-crypto';



export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface AuthCredential {
  id?: string | number;
  userId: number;
  username: string;
  salt: string;
  passwordHash: string;
  mustChangeCredentials: boolean;
}

export interface AuthSession {
  id: string | number;
  userId: number;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

async function getCollection<T>(path: string): Promise<T[]> {
  const response = await fetchMockApi(path);

  if (!response.ok) {
    throw new Error('Authentication data service unavailable');
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid authentication data');
  }

  return data as T[];
}

export async function findCredentialByUsername(
  username: string,
): Promise<AuthCredential | null> {
  const credentials = await getCollection<AuthCredential>(
    `/credentials?username=${encodeURIComponent(username)}`,
  );

  if (credentials.length > 1) {
    throw new Error('Duplicate username credentials');
  }

  return credentials[0] ?? null;
}

export async function findCredentialByUserId(
  userId: number,
): Promise<AuthCredential | null> {
  const credentials = await getCollection<AuthCredential>(
    '/credentials',
  );

  const matches = credentials.filter(
    (credential) => Number(credential.userId) === userId,
  );

  if (matches.length > 1) {
    throw new Error('Duplicate user credentials');
  }

  return matches[0] ?? null;
}

export async function findSessionsByToken(
  token: string,
): Promise<AuthSession[]> {
  const tokenHash = hashSessionToken(token);

  return getCollection<AuthSession>(
    `/sessions?tokenHash=${encodeURIComponent(tokenHash)}`,
  );
}

export async function createAuthSession(
  userId: number,
  token: string,
): Promise<void> {
  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + SESSION_TTL_SECONDS * 1000,
  );

  const session = {
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
  };

  const response = await fetchMockApi('/sessions', {
    method: 'POST',
    body: JSON.stringify(session),
  });

  if (!response.ok) {
    throw new Error('Failed to create authentication session');
  }
}

export async function deleteAuthSession(
  sessionId: string | number,
): Promise<void> {
  const response = await fetchMockApi(
    `/sessions/${encodeURIComponent(String(sessionId))}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to delete authentication session');
  }
}

export async function deleteAuthSessionsByToken(
  token: string,
): Promise<void> {
  const sessions = await findSessionsByToken(token);

  await Promise.all(
    sessions.map((session) => deleteAuthSession(session.id)),
  );
}
