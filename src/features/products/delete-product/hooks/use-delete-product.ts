import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/lib/api-error";
import { appToast } from "@/shared/lib/toast";
import type { ApiResponse } from "@/shared/types/api-response";

import { deleteProductImage } from "../../shared/api/product-images.api";
import { productsKeys } from "../../shared/api/products.query-keys";
import type {
  Product,
  ProductListData,
} from "../../shared/types/product.types";

import { deleteProduct } from "../api/delete-product.api";

interface DeleteProductContext {
  previousLists: Array<
    [
      readonly unknown[],
      ApiResponse<ProductListData> | undefined,
    ]
  >;
  imageUrl: string | null;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("products.notifications");
  const errorT = useTranslations("errors");

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (id: number): Promise<DeleteProductContext> => {
      await queryClient.cancelQueries({
        queryKey: productsKeys.lists(),
      });

      const previousLists =
        queryClient.getQueriesData<ApiResponse<ProductListData>>({
          queryKey: productsKeys.lists(),
        });

      const detailProduct =
        queryClient.getQueryData<ApiResponse<Product>>(
          productsKeys.detail(id),
        )?.data;

      const listProduct = previousLists
        .map(([, response]) =>
          response?.data?.products.find(
            (product) => product.id === id,
          ),
        )
        .find((product) => product?.image);

      const imageUrl =
        detailProduct?.image || listProduct?.image || null;

      queryClient.setQueriesData<ApiResponse<ProductListData>>(
        { queryKey: productsKeys.lists() },
        (previousResponse) => {
          if (!previousResponse?.data?.products) {
            return previousResponse;
          }

          const beforeCount =
            previousResponse.data.products.length;

          const products =
            previousResponse.data.products.filter(
              (product) => product.id !== id,
            );

          if (products.length === beforeCount) {
            return previousResponse;
          }

          return {
            ...previousResponse,
            data: {
              ...previousResponse.data,
              products,
              total: Math.max(
                0,
                previousResponse.data.total - 1,
              ),
            },
          };
        },
      );

      return { previousLists, imageUrl };
    },

    onSuccess: async (_data, _id, context) => {
      appToast.success(t("deleted"));

      if (context?.imageUrl) {
        await deleteProductImage(context.imageUrl).catch(
          () => undefined,
        );
      }
    },

    onError: (error, _id, context) => {
      for (const [queryKey, previousResponse] of
        context?.previousLists ?? []) {
        if (previousResponse) {
          queryClient.setQueryData<ApiResponse<ProductListData>>(
            queryKey,
            previousResponse,
          );
        }
      }

      appToast.error(
        getErrorMessage(error, errorT) || t("deleteFailed"),
      );
    },

    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(id),
      });
    },
  });
}