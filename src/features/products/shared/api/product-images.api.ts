interface ProductImageUploadResponse {
  data?: {
    url?: string;
  };
  error?: string;
}

async function readImageResponse(
  response: Response,
): Promise<ProductImageUploadResponse> {
  const result =
    (await response.json()) as ProductImageUploadResponse;

  if (!response.ok) {
    throw new Error(result.error || "Image request failed");
  }

  return result;
}

export async function uploadProductImage(
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/products/upload", {
    method: "POST",
    body: formData,
  });

  const result = await readImageResponse(response);
  const url = result.data?.url;

  if (!url) {
    throw new Error("Image URL was not returned");
  }

  return url;
}

export async function deleteProductImage(
  url: string,
): Promise<void> {
  const response = await fetch("/api/products/upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  await readImageResponse(response);
}