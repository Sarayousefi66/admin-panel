import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const IMAGE_DIRECTORY = path.join(
  process.cwd(),
  "public",
  "uploads",
  "products",
);

const IMAGE_URL_PREFIX = "/uploads/products/";
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export class ProductImageStorageError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ProductImageStorageError";
  }
}

export async function saveProductImage(
  file: File,
): Promise<string> {
  const extension = IMAGE_EXTENSIONS[file.type];

  if (!extension) {
    throw new ProductImageStorageError(
      "Unsupported image type",
      415,
    );
  }

  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    throw new ProductImageStorageError(
      "Image size must be between 1 byte and 4 MB",
      413,
    );
  }

  await mkdir(IMAGE_DIRECTORY, { recursive: true });

  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(IMAGE_DIRECTORY, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer, { flag: "wx" });

  return `${IMAGE_URL_PREFIX}${fileName}`;
}

export async function removeProductImage(
  imageUrl: string,
): Promise<void> {
  if (!imageUrl.startsWith(IMAGE_URL_PREFIX)) {
    throw new ProductImageStorageError(
      "Invalid product image path",
      400,
    );
  }

  const fileName = imageUrl.slice(IMAGE_URL_PREFIX.length);

  if (!fileName || path.basename(fileName) !== fileName) {
    throw new ProductImageStorageError(
      "Invalid product image path",
      400,
    );
  }

  const filePath = path.join(IMAGE_DIRECTORY, fileName);

  try {
    await unlink(filePath);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return;
    }

    throw error;
  }
}