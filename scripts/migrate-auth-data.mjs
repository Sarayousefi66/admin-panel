
import {
    randomBytes,
    scrypt,
} from 'node:crypto';

import {
    copyFile,
    mkdir,
    readFile,
    writeFile,
} from 'node:fs/promises';

import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const DB_PATH = resolve(process.cwd(), 'mock-api/db.json');

const ADMIN_ID = 1;
const ADMIN_USERNAME = 'admin';

const PASSWORD_KEY_LENGTH = 64;

const SCRYPT_OPTIONS = {
  N: 2 ** 14,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

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

function normalizeUsername(username) {
  return String(username ?? '').trim().toLowerCase();
}

function isObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function createBackup() {
  const backupDirectory = join(
    tmpdir(),
    'dashboard-ui-db-backups',
  );

  await mkdir(backupDirectory, {
    recursive: true,
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

  const backupPath = join(
    backupDirectory,
    `db-${timestamp}.json`,
  );

  await copyFile(DB_PATH, backupPath);

  return backupPath;
}

async function main() {
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (
    typeof initialPassword !== 'string' ||
    initialPassword.length === 0
  ) {
    throw new Error(
      'INITIAL_ADMIN_PASSWORD environment variable is required.',
    );
  }

  const rawDatabase = await readFile(DB_PATH, 'utf8');

  const database = JSON.parse(rawDatabase);

  if (!isObject(database)) {
    throw new Error('Invalid database structure.');
  }

  if (!Array.isArray(database.users)) {
    throw new Error('The users collection is missing or invalid.');
  }

  const adminUser = database.users.find(
    (user) => Number(user.id) === ADMIN_ID,
  );

  if (!adminUser) {
    throw new Error(
      `Admin user with ID ${ADMIN_ID} was not found.`,
    );
  }

  if (
    !Array.isArray(database.credentials) &&
    database.credentials !== undefined
  ) {
    throw new Error('The credentials collection is invalid.');
  }

  if (
    !Array.isArray(database.sessions) &&
    database.sessions !== undefined
  ) {
    throw new Error('The sessions collection is invalid.');
  }

  const credentials = database.credentials ?? [];
  const sessions = database.sessions ?? [];

  const existingAdminCredential = credentials.find(
    (credential) =>
      Number(credential.userId) === ADMIN_ID,
  );

  const conflictingUsername = credentials.find(
    (credential) =>
      normalizeUsername(credential.username) ===
        ADMIN_USERNAME &&
      Number(credential.userId) !== ADMIN_ID,
  );

  if (conflictingUsername) {
    throw new Error(
      'Username "admin" is already assigned to another user. No changes were made.',
    );
  }

  let credentialAdded = false;

  if (!existingAdminCredential) {
    const salt = randomBytes(16).toString('hex');

    const passwordHash = await derivePasswordKey(
      initialPassword,
      salt,
    );

    credentials.push({
      id: ADMIN_ID,
      userId: ADMIN_ID,
      username: ADMIN_USERNAME,
      salt,
      passwordHash: passwordHash.toString('hex'),
      mustChangeCredentials: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    credentialAdded = true;
  }

  const collectionsAdded = [];

  if (database.credentials === undefined) {
    database.credentials = credentials;
    collectionsAdded.push('credentials');
  }

  if (database.sessions === undefined) {
    database.sessions = sessions;
    collectionsAdded.push('sessions');
  }

  if (!credentialAdded && collectionsAdded.length === 0) {
    console.log('Authentication collections already exist.');
    console.log('Existing admin credential was preserved.');
    return;
  }

  const backupPath = await createBackup();

  await writeFile(
    DB_PATH,
    `${JSON.stringify(database, null, 2)}\n`,
    'utf8',
  );

  console.log('Authentication database migration completed.');
  console.log(`Admin credential added: ${credentialAdded}`);
  console.log(
    `New collections: ${
      collectionsAdded.join(', ') || 'none'
    }`,
  );
  console.log(`Database backup: ${backupPath}`);
}

main().catch((error) => {
  console.error('Authentication migration failed.');
  console.error(error.message);
  process.exitCode = 1;
});
