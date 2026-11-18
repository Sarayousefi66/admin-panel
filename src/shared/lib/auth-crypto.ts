
import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto';

import { isPasswordPolicyValid } from './password-policy';

const SALT_BYTES = 16;
const SESSION_TOKEN_BYTES = 32;
const PASSWORD_KEY_LENGTH = 64;

const SCRYPT_OPTIONS = {
  N: 2 ** 14,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

function derivePasswordKey(
  password: string,
  salt: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      PASSWORD_KEY_LENGTH,
      SCRYPT_OPTIONS,
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

export interface PasswordHash {
  salt: string;
  passwordHash: string;
}

export async function hashPassword(
  password: string,
): Promise<PasswordHash> {
  const salt = randomBytes(SALT_BYTES).toString('hex');

  const derivedKey = await derivePasswordKey(password, salt);

  return {
    salt,
    passwordHash: derivedKey.toString('hex'),
  };
}

export async function verifyPassword(
  password: string,
  salt: string,
  passwordHash: string,
): Promise<boolean> {
  if (
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !/^[a-f0-9]{128}$/i.test(passwordHash)
  ) {
    return false;
  }

  const expectedHash = Buffer.from(passwordHash, 'hex');
  const actualHash = await derivePasswordKey(password, salt);

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}

export function createSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256')
    .update(token, 'utf8')
    .digest('hex');
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9._-]{3,32}$/.test(username);
}

export function isValidPassword(password: string): boolean {
  return isPasswordPolicyValid(password);
}
