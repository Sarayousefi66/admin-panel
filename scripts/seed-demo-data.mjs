
import {
    copyFile,
    mkdir,
    readFile,
    rename,
    rm,
    writeFile,
} from 'node:fs/promises';

import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const DB_PATH = resolve(process.cwd(), 'mock-api/db.json');

const ADMIN_ID = 1;

const APPLY_CHANGES = process.argv.includes('--apply');

const demoUsers = [
  {
    id: 2,
    firstName: 'Ava',
    lastName: 'Mitchell',
    email: 'ava.mitchell@example.com',
    age: 28,
    role: 'editor',
    status: 'active',
    roleSlug: 'editor',
  },
  {
    id: 3,
    firstName: 'Noah',
    lastName: 'Carter',
    email: 'noah.carter@example.com',
    age: 32,
    role: 'viewer',
    status: 'active',
    roleSlug: 'viewer',
  },
  {
    id: 4,
    firstName: 'Olivia',
    lastName: 'Bennett',
    email: 'olivia.bennett@example.com',
    age: 26,
    role: 'viewer',
    status: 'active',
    roleSlug: 'web-manager',
  },
  {
    id: 5,
    firstName: 'Ethan',
    lastName: 'Parker',
    email: 'ethan.parker@example.com',
    age: 35,
    role: 'viewer',
    status: 'active',
    roleSlug: 'viewer',
  },
  {
    id: 6,
    firstName: 'Sophia',
    lastName: 'Turner',
    email: 'sophia.turner@example.com',
    age: 30,
    role: 'editor',
    status: 'active',
    roleSlug: 'editor',
  },
  {
    id: 7,
    firstName: 'Liam',
    lastName: 'Brooks',
    email: 'liam.brooks@example.com',
    age: 24,
    role: 'viewer',
    status: 'active',
    roleSlug: 'viewer',
  },
  {
    id: 8,
    firstName: 'Mia',
    lastName: 'Cooper',
    email: 'mia.cooper@example.com',
    age: 29,
    role: 'viewer',
    status: 'pending',
    roleSlug: 'viewer',
  },
  {
    id: 9,
    firstName: 'Lucas',
    lastName: 'Reed',
    email: 'lucas.reed@example.com',
    age: 37,
    role: 'editor',
    status: 'pending',
    roleSlug: 'editor',
  },
  {
    id: 10,
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@example.com',
    age: 27,
    role: 'viewer',
    status: 'pending',
    roleSlug: 'viewer',
  },
  {
    id: 11,
    firstName: 'James',
    lastName: 'Foster',
    email: 'james.foster@example.com',
    age: 41,
    role: 'viewer',
    status: 'inactive',
    roleSlug: 'viewer',
  },
  {
    id: 12,
    firstName: 'Isabella',
    lastName: 'Hayes',
    email: 'isabella.hayes@example.com',
    age: 33,
    role: 'editor',
    status: 'inactive',
    roleSlug: 'editor',
  },
  {
    id: 13,
    firstName: 'Mason',
    lastName: 'Bell',
    email: 'mason.bell@example.com',
    age: 25,
    role: 'viewer',
    status: 'inactive',
    roleSlug: 'viewer',
  },
];

const demoProducts = [
  {
    id: 1,
    title: 'Wireless Mechanical Keyboard',
    description:
      'Compact mechanical keyboard with wireless connectivity and comfortable typing experience.',
    price: 89.99,
    image: null,
  },
  {
    id: 2,
    title: 'Ergonomic Wireless Mouse',
    description:
      'Ergonomic wireless mouse designed for precise control and comfortable everyday use.',
    price: 49.5,
    image: null,
  },
  {
    id: 3,
    title: 'USB-C Docking Station',
    description:
      'Multi-port USB-C docking station for connecting displays and other essential devices.',
    price: 129,
    image: null,
  },
  {
    id: 4,
    title: 'Ultra HD Monitor',
    description:
      'High-resolution monitor suitable for productivity, creative work and everyday computing.',
    price: 349.99,
    image: null,
  },
  {
    id: 5,
    title: 'Noise Cancelling Headphones',
    description:
      'Wireless headphones with noise cancellation and comfortable over-ear cushions.',
    price: 179.9,
    image: null,
  },
  {
    id: 6,
    title: 'Portable SSD 1TB',
    description:
      'Compact high-capacity external SSD for backing up and transferring important files.',
    price: 109.99,
    image: null,
  },
  {
    id: 7,
    title: 'Full HD Webcam',
    description:
      'Full HD webcam for video meetings, remote collaboration and online communication.',
    price: 69.95,
    image: null,
  },
  {
    id: 8,
    title: 'Aluminum Laptop Stand',
    description:
      'Adjustable aluminum laptop stand designed to improve desk ergonomics and airflow.',
    price: 39.99,
    image: null,
  },
];

function validateDatabase(database) {
  const requiredCollections = [
    'users',
    'products',
    'roles',
    'rolePermissions',
    'userRoles',
    'credentials',
    'sessions',
  ];

  for (const collection of requiredCollections) {
    if (!Array.isArray(database[collection])) {
      throw new Error(
        `Missing or invalid database collection: ${collection}`,
      );
    }
  }

  const adminUser = database.users.find(
    (user) => Number(user.id) === ADMIN_ID,
  );

  if (!adminUser) {
    throw new Error('Existing admin user was not found.');
  }

  const adminCredentials = database.credentials.filter(
    (credential) => Number(credential.userId) === ADMIN_ID,
  );

  if (adminCredentials.length === 0) {
    throw new Error(
      'Admin credentials were not found. No changes were made.',
    );
  }

  const roleBySlug = new Map(
    database.roles.map((role) => [role.slug, role]),
  );

  for (const slug of ['admin', 'editor', 'viewer', 'web-manager']) {
    if (!roleBySlug.has(slug)) {
      throw new Error(`Required role was not found: ${slug}`);
    }
  }

  const adminRole = roleBySlug.get('admin');

  const hasAdminAssignment = database.userRoles.some(
    (assignment) =>
      Number(assignment.userId) === ADMIN_ID &&
      String(assignment.roleId) === String(adminRole.id),
  );

  if (!hasAdminAssignment) {
    throw new Error(
      'Admin role assignment is missing. No changes were made.',
    );
  }

  const emails = demoUsers.map((user) => user.email);

  if (new Set(emails).size !== emails.length) {
    throw new Error('Duplicate demo user emails detected.');
  }

  for (const product of demoProducts) {
    if (
      !Number.isFinite(product.price) ||
      product.price <= 0
    ) {
      throw new Error(
        `Invalid product price: ${product.title}`,
      );
    }
  }

  return {
    adminUser,
    adminCredentials,
    roleBySlug,
  };
}

function buildSeededDatabase(database, validated) {
  const { adminUser, roleBySlug } = validated;

  const users = [
    adminUser,
    ...demoUsers.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        role: user.role,
        status: user.status,
        avatarUrl: null,
    })),
    ];

  // Keep only the existing admin role assignments.
  const adminRoleAssignments = database.userRoles.filter(
    (assignment) =>
      Number(assignment.userId) === ADMIN_ID,
  );

  // Create deterministic role assignments for demo users.
  const demoRoleAssignments = demoUsers.map((user) => {
    const role = roleBySlug.get(user.roleSlug);

    return {
      id: `${user.id}::${role.id}`,
      userId: user.id,
      roleId: role.id,
    };
  });

  // Preserve credentials belonging to the existing admin.
  const credentials = database.credentials.filter(
    (credential) =>
      Number(credential.userId) === ADMIN_ID,
  );

  // Preserve only sessions belonging to the existing admin.
  const sessions = database.sessions.filter(
    (session) =>
      Number(session.userId) === ADMIN_ID,
  );

  return {
    ...database,
    users,
    products: demoProducts,
    userRoles: [
      ...adminRoleAssignments,
      ...demoRoleAssignments,
    ],
    credentials,
    sessions,
  };
}

function printSummary(database) {
  const statusCounts = {};

  for (const user of database.users) {
    statusCounts[user.status] =
      (statusCounts[user.status] ?? 0) + 1;
  }

  console.log('\n========== SEED SUMMARY ==========');

  console.log('Total users:', database.users.length);
  console.log('User statuses:', statusCounts);

  console.log('Total products:', database.products.length);

  console.log(
    'Admin credentials preserved:',
    database.credentials.length,
  );

  console.log(
    'Admin sessions preserved:',
    database.sessions.length,
  );

  console.log(
    'Role assignments:',
    database.userRoles.length,
  );

  console.log(
    'Roles and permissions:',
    'Preserved without changes',
  );
}

async function createBackup() {
  const backupDirectory = join(
    tmpdir(),
    'dashboard-ui-seed-backups',
  );

  await mkdir(backupDirectory, {
    recursive: true,
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

  const backupPath = join(
    backupDirectory,
    `db-before-demo-seed-${timestamp}.json`,
  );

  await copyFile(DB_PATH, backupPath);

  return backupPath;
}

async function main() {
  const rawDatabase = await readFile(DB_PATH, 'utf8');
  const database = JSON.parse(rawDatabase);

  const validated = validateDatabase(database);

  const seededDatabase = buildSeededDatabase(
    database,
    validated,
  );

  printSummary(seededDatabase);

  if (!APPLY_CHANGES) {
    console.log('\nDRY RUN: No files were modified.');
    console.log(
      'Run with --apply to create the backup and update the database.',
    );
    return;
  }

  const backupPath = await createBackup();

  const temporaryPath = `${DB_PATH}.${process.pid}.tmp`;

  try {
    await writeFile(
      temporaryPath,
      `${JSON.stringify(seededDatabase, null, 2)}\n`,
      'utf8',
    );

    await rename(temporaryPath, DB_PATH);
  } catch (error) {
    await rm(temporaryPath, { force: true }).catch(
      () => undefined,
    );

    throw error;
  }

  console.log('\nDemo database seed completed.');
  console.log(`Backup created at: ${backupPath}`);
}

main().catch((error) => {
  console.error('\nDemo data seed failed.');
  console.error(error.message);
  process.exitCode = 1;
});
