
"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  variant?: "thumbnail" | "detail";
}

export function ProductImage({
  src,
  alt,
  variant = "thumbnail",
}: ProductImageProps) {
  return (
    <ProductImageContent
      key={src || "no-image"}
      src={src}
      alt={alt}
      variant={variant}
    />
  );
}

function ProductImageContent({
  src,
  alt,
  variant,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const isThumbnail = variant === "thumbnail";

  return (
    <div
      className={
        isThumbnail
          ? "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40"
          : "relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted/30"
      }
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            isThumbnail
              ? "48px"
              : "(max-width: 768px) 100vw, 500px"
          }
          unoptimized
          onError={() => setHasError(true)}
          className="object-contain p-1"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageIcon
            className={
              isThumbnail ? "size-5" : "size-12"
            }
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  );
}
