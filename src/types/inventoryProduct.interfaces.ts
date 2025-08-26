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
/////////////////////////////////// Create API instances //////////////////////////////
export const InventoryProductApi = createCrudApi<
  InventoryProduct,
  null,
  UpdateInventoryProduct
>("inventoryProducts");
