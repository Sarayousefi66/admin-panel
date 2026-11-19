import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { EditProductForm } from "@/features/products/update-product/components/edit-product-form";
import { getProductById } from "@/features/products/view-product/api/product-detail.api";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    notFound();
  }

  const requestHeaders = await headers();

  const cookieHeader = requestHeaders.get("cookie") ?? undefined;

  const forwardedHost = requestHeaders.get("x-forwarded-host");

  const host =
    forwardedHost?.split(",")[0]?.trim() ||
    requestHeaders.get("host") ||
    "localhost:3000";

  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");

  const protocolCandidate = forwardedProtocol
    ?.split(",")[0]
    ?.trim();

  const protocol =
    protocolCandidate === "http" || protocolCandidate === "https"
      ? protocolCandidate
      : process.env.NODE_ENV === "production"
        ? "https"
        : "http";

  const requestOrigin = `${protocol}://${host}`;

  const product = await getProductById(
    productId,
    cookieHeader,
    requestOrigin,
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl py-10">
      <EditProductForm product={product} />
    </div>
  );
}