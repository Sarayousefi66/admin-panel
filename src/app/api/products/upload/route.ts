import { NextResponse } from "next/server";

import {
    ProductImageStorageError,
    removeProductImage,
    saveProductImage,
} from "@/features/products/shared/server/product-image-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "An image file is required" },
        { status: 400 },
      );
    }

    const url = await saveProductImage(file);

    return NextResponse.json({
      data: { url },
    });
  } catch (error) {
    if (error instanceof ProductImageStorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Failed to upload product image" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as {
      url?: unknown;
    };

    if (typeof body.url !== "string") {
      return NextResponse.json(
        { error: "A valid image URL is required" },
        { status: 400 },
      );
    }

    await removeProductImage(body.url);

    return NextResponse.json({
      data: { success: true },
    });
  } catch (error) {
    if (error instanceof ProductImageStorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete product image" },
      { status: 500 },
    );
  }
}