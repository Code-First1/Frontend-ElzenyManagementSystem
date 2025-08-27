import { createCrudApi } from "../services/apiCrud";
import type { Product } from "./adminDashboard.interfaces";

export interface ShopProduct {
  id: number;
  quantity: number;
  smallBoxesPerBigBox: number;
  fullBigBoxesCount: number;
  openedBigBoxRemaining: number;
  openedRollRemaining: number;
  product: Product;
}

export interface UpdateShopProduct {
  quantity: number;
  smallBoxesPerBigBox: number;
  fullBigBoxesCount: number;
  openedBigBoxRemaining: number;
  openedRollRemaining: number;
}

export interface GetAllShopProductsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: ShopProduct[];
}
/////////////////////////////////// Create API instances //////////////////////////////
export const shopProductApi = createCrudApi<
  ShopProduct,
  null,
  UpdateShopProduct
>("shopProducts");
