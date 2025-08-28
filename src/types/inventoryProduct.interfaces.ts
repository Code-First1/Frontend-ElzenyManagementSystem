import { createCrudApi } from "../services/apiCrud";
import type { Product } from "./adminDashboard.interfaces";

export interface InventoryProduct {
  id: number;
  quantity: number;
  minimumQuantity: number;
  product: Product;
}

export interface UpdateInventoryProduct {
  quantity: number;
  minimumQuantity: number;
}

export interface GetAllInventoryProductsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: InventoryProduct[];
}
export interface GetInventoryCounts {
  goodProductsCount: number;
  criticalProductsCount: number;
  emptyProductsCount: number;
  totalProductsCount: number;
}
/////////////////////////////////// Create API instances //////////////////////////////
export const InventoryProductApi = createCrudApi<
  InventoryProduct,
  null,
  UpdateInventoryProduct
>("inventoryProducts");
export const InventoryDashboardCountsApi = createCrudApi<GetInventoryCounts>(
  "InventoryDashboard/counts",
);
export const InventoryDashboardGoodProductsApi =
  createCrudApi<InventoryProduct>("InventoryDashboard/good");
export const InventoryDashboardCriticalProductsApi =
  createCrudApi<InventoryProduct>("InventoryDashboard/critical");
export const InventoryDashboardEmptyProductsApi =
  createCrudApi<InventoryProduct>("InventoryDashboard/empty");
