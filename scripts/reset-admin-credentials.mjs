import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto';

import {
  copyFile,
  mkdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from 'node:fs/promises';

import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const DB_PATH = resolve(
  process.cwd(),
  process.env.DB_PATH || 'mock-api/db.json',
);

const ADMIN_ID = 1;
const PASSWORD_KEY_LENGTH = 64;

const SCRYPT_OPTIONS = {
  N: 2 ** 14,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\p{L}\p{N}\s])[\s\S]*$/u;

function derivePasswordKey(password, salt) {
  return new Promise((resolvePromise, reject) => {
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

        resolvePromise(derivedKey);
      },
    );
  });
}

function validatePassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    password.length <= 128 &&
    PASSWORD_PATTERN.test(password)
  );
}

function isObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function verifyCurrentPassword(password, salt, passwordHash) {
  if (
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !/^[a-f0-9]{128}$/i.test(passwordHash)
  ) {
    throw new Error('Existing credential data is invalid.');
  }

  const expectedHash = Buffer.from(passwordHash, 'hex');
  const actualHash = await derivePasswordKey(password, salt);

  return (
    actualHash.length === expectedHash.length &&
    timingSafeEqual(actualHash, expectedHash)
  );
}

async function createBackup() {
  const backupDirectory = join(
    tmpdir(),
    'dashboard-ui-db-backups',
  );

  await mkdir(backupDirectory, { recursive: true });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

  const backupPath = join(
    backupDirectory,
    `db-before-admin-reset-${timestamp}-${process.pid}.json`,
  );

  await copyFile(DB_PATH, backupPath);

  return backupPath;
}

async function main() {
  const newPassword = process.env.RESET_ADMIN_PASSWORD;

  if (!validatePassword(newPassword)) {
    throw new Error(
      'New password does not satisfy the password policy.',
    );
  }

  const rawDatabase = await readFile(DB_PATH, 'utf8');
  const database = JSON.parse(rawDatabase);

  if (
    !isObject(database) ||
    !Array.isArray(database.users) ||
    !Array.isArray(database.credentials) ||
    !Array.isArray(database.sessions)
  ) {
    throw new Error('Invalid database structure.');
  }

  const adminUser = database.users.find(
    (user) => Number(user.id) === ADMIN_ID,
  );

  if (!adminUser) {
    throw new Error('Admin user was not found.');
  }

  const adminCredentials = database.credentials.filter(
    (credential) => Number(credential.userId) === ADMIN_ID,
  );

  if (adminCredentials.length !== 1) {
    throw new Error(
      'Expected exactly one admin credential. No changes made.',
    );
  }

  const credential = adminCredentials[0];

  if (
    typeof credential.username !== 'string' ||
    !credential.username.trim()
  ) {
    throw new Error('Admin username is invalid.');
  }

  const normalizedUsername = credential.username.trim().toLowerCase();

  const duplicateUsername = database.credentials.some(
    (item) =>
      Number(item.userId) !== ADMIN_ID &&
      String(item.username ?? '').trim().toLowerCase() ===
        normalizedUsername,
  );

  if (duplicateUsername) {
    throw new Error(
      'Admin username conflicts with another account.',
    );
  }

  const isSamePassword = await verifyCurrentPassword(
    newPassword,
    credential.salt,
    credential.passwordHash,
  );

  if (isSamePassword) {
    throw new Error(
      'New password must be different from the exposed password.',
    );
  }

  const salt = randomBytes(16).toString('hex');

  const passwordHash = await derivePasswordKey(
    newPassword,
    salt,
  );

  const now = new Date().toISOString();

  const updatedCredentials = database.credentials.map((item) => {
    if (Number(item.userId) !== ADMIN_ID) {
      return item;
    }

    return {
      ...item,
      salt,
      passwordHash: passwordHash.toString('hex'),
      mustChangeCredentials: true,
      updatedAt: now,
    };
  });

  const remainingSessions = database.sessions.filter(
    (session) => Number(session.userId) !== ADMIN_ID,
  );

  const removedSessions =
    database.sessions.length - remainingSessions.length;

  const backupPath = await createBackup();

  const updatedDatabase = {
    ...database,
    credentials: updatedCredentials,
    sessions: remainingSessions,
  };

  const temporaryPath = join(
    dirname(DB_PATH),
    `.db-reset-${process.pid}-${randomBytes(6).toString('hex')}.tmp`,
  );

  try {
    await writeFile(
      temporaryPath,
      `${JSON.stringify(updatedDatabase, null, 2)}\n`,
      'utf8',
    );

    await rename(temporaryPath, DB_PATH);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }

  console.log('Admin credential reset completed.');
  console.log(`Admin username preserved: ${credential.username}`);
  console.log(`Admin sessions invalidated: ${removedSessions}`);
  console.log('Password change required at next login: true');
  console.log(`Local backup created: ${backupPath}`);
}

main().catch((error) => {
  console.error('Admin credential reset failed.');
  console.error(error.message);
  process.exitCode = 1;
});