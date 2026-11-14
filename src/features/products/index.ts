export { getProducts } from "./view-products/api/products-list.api";
export { useProductsQuery } from "./view-products/hooks/use-products-query";

export { getProductById } from "./view-product/api/product-detail.api";

export type {
    GetProductsParams,
    Product,
    ProductListData
} from "./shared/types/product.types";
