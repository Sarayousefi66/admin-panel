
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImagePlus,
  PackagePlus,
  PencilLine,
  Trash2,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  type ChangeEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { appToast } from "@/shared/lib/toast";

import {
  deleteProductImage,
  uploadProductImage,
} from "../api/product-images.api";

import {
  createProductSchema,
  type ProductFormValues,
} from "../schemas/product-form.schema";

interface ProductFormInitialData {
  id?: number;
  title: string;
  description?: string;
  price: number;
  image?: string | null;
}

interface Props {
  mode: "create" | "edit";
  initialData?: ProductFormInitialData;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  isPending?: boolean;
  variant?: "card" | "dialog";
}

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export function ProductForm(props: Props) {
  const initialDataKey = JSON.stringify([
    props.mode,
    props.initialData?.id ?? null,
    props.initialData?.title ?? "",
    props.initialData?.description ?? "",
    props.initialData?.price ?? 0,
    props.initialData?.image ?? null,
  ]);

  return (
    <ProductFormContent
      key={initialDataKey}
      {...props}
    />
  );
}

function ProductFormContent({
  mode,
  initialData,
  onSubmit,
  isPending = false,
  variant = "card",
}: Props) {
  const t = useTranslations("products.form");
  const validationT = useTranslations("products.validation");

  const formId = useId();
  const isDialog = variant === "dialog";
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] =
    useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const imagePreview = selectedImagePreview ??
    (removeCurrentImage ? null : initialData?.image ?? null);

  const schema = useMemo(
    () =>
      createProductSchema({
        titleMin: validationT("titleMin"),
        descriptionMin: validationT("descriptionMin"),
        priceMin: validationT("priceMin"),
      }),
    [validationT],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
    },
  });

  // Release temporary image preview URLs.
  useEffect(() => {
    if (!selectedImagePreview) {
      return;
    }

    return () => {
      URL.revokeObjectURL(selectedImagePreview);
    };
  }, [selectedImagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      appToast.error(validationT("imageType"));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      appToast.error(validationT("imageSize"));
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setSelectedImagePreview(previewUrl);
    setRemoveCurrentImage(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setRemoveCurrentImage(true);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    let uploadedImageUrl: string | undefined;
    let mutationStarted = false;

    const previousImage = initialData?.image ?? null;
    const imageWasChanged =
      selectedImage !== null || removeCurrentImage;

    let nextImage: string | null = previousImage;

    try {
      if (selectedImage) {
        setIsUploadingImage(true);

        uploadedImageUrl = await uploadProductImage(selectedImage);
        nextImage = uploadedImageUrl;
      } else if (removeCurrentImage) {
        nextImage = null;
      }

      const payload: ProductFormValues = {
        ...values,
        ...(imageWasChanged ? { image: nextImage } : {}),
      };

      mutationStarted = true;

      await onSubmit(payload);

      if (
        imageWasChanged &&
        previousImage &&
        previousImage !== nextImage
      ) {
        await deleteProductImage(previousImage).catch(
          () => undefined,
        );
      }
    } catch {
      if (uploadedImageUrl) {
        await deleteProductImage(uploadedImageUrl).catch(
          () => undefined,
        );
      }

      if (!mutationStarted) {
        appToast.error(t("imageUploadFailed"));
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const titleId = `${formId}-title`;
  const priceId = `${formId}-price`;
  const descriptionId = `${formId}-description`;
  const imageId = `${formId}-image`;

  const fieldClassName =
    "h-11 w-full rounded-xl border-border bg-background shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15";

  const labelClassName =
    "text-sm font-medium text-foreground";

  const fieldWrapperClassName =
    "flex min-w-0 flex-col gap-2.5";

  const formContent = (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      aria-busy={isPending || isUploadingImage}
      className={
        isDialog
          ? "grid w-full min-w-0 grid-cols-1 gap-x-5 gap-y-6 px-6 pb-6 sm:grid-cols-2 sm:px-7"
          : "grid w-full min-w-0 grid-cols-1 gap-x-6 gap-y-6 p-5 sm:grid-cols-2 sm:p-7"
      }
    >
      {/* Product title */}
      <div className={`${fieldWrapperClassName} sm:col-span-2`}>
        <label htmlFor={titleId} className={labelClassName}>
          {t("title")}
        </label>

        <Input
          id={titleId}
          placeholder={t("title")}
          className={fieldClassName}
          aria-invalid={!!errors.title}
          {...register("title")}
        />

        {errors.title && (
          <p className="text-xs leading-5 text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Product description */}
      <div className={`${fieldWrapperClassName} sm:col-span-2`}>
        <label htmlFor={descriptionId} className={labelClassName}>
          {t("description")}
        </label>

        <Textarea
          id={descriptionId}
          placeholder={t("description")}
          className="min-h-32 w-full resize-y rounded-xl border-border bg-background shadow-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
          aria-invalid={!!errors.description}
          {...register("description")}
        />

        {errors.description && (
          <p className="text-xs leading-5 text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Product price */}
      <div className={fieldWrapperClassName}>
        <label htmlFor={priceId} className={labelClassName}>
          {t("price")}
        </label>

        <Input
          id={priceId}
          type="number"
          min="1"
          placeholder={t("price")}
          className={fieldClassName}
          aria-invalid={!!errors.price}
          {...register("price", {
            valueAsNumber: true,
          })}
        />

        {errors.price && (
          <p className="text-xs leading-5 text-destructive">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Product image */}
      <div className={`${fieldWrapperClassName} sm:col-span-2`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={imageId} className={labelClassName}>
            {t("image")}
          </label>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:p-5">
          {/* Image preview */}
          <div className="relative mx-auto flex aspect-square w-full max-w-40 items-center justify-center overflow-hidden rounded-xl border border-border bg-background sm:mx-0">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={t("imagePreviewAlt")}
                fill
                sizes="160px"
                unoptimized
                className="object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <ImagePlus className="size-7" strokeWidth={1.5} />
                </div>

                <span className="text-xs">{t("image")}</span>
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex min-w-0 flex-col items-start gap-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                {selectedImage?.name ?? t("image")}
              </p>

              <p className="text-xs leading-6 text-muted-foreground">
                {t("imageHint")}
              </p>
            </div>

            <input
              ref={imageInputRef}
              id={imageId}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="sr-only"
              onChange={handleImageChange}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-lg bg-background px-3"
                onClick={() => imageInputRef.current?.click()}
              >
                <Upload className="me-2 size-4" />
                {t("chooseImage")}
              </Button>

              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-lg px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="me-2 size-4" />
                  {t("removeImage")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div
        className={
          isDialog
            ? "flex justify-end border-t border-border pt-5 sm:col-span-2"
            : "flex justify-end border-t border-border pt-5 sm:col-span-2"
        }
      >
        <Button
          type="submit"
          disabled={isPending || isUploadingImage}
          className="h-10 w-full min-w-36 rounded-xl px-6 shadow-sm sm:w-auto"
        >
          {isPending || isUploadingImage
            ? t("saving")
            : mode === "create"
              ? t("create")
              : t("update")}
        </Button>
      </div>
    </form>
  );

  if (isDialog) {
    return <div className="w-full min-w-0">{formContent}</div>;
  }

  return (
    <Card className="w-full max-w-4xl overflow-hidden rounded-2xl border-border bg-card p-0 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-5 py-5 sm:px-7">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {mode === "create" ? (
            <PackagePlus className="size-5" />
          ) : (
            <PencilLine className="size-5" />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            {mode === "create" ? t("createTitle") : t("editTitle")}
          </h1>

          <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
            {t("manageDescription")}
          </p>
        </div>
      </div>

      {formContent}
    </Card>
  );
}
