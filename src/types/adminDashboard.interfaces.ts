import { createCrudApi } from "../services/apiCrud";

export const Unit = {
  Meter: {
    value: "Meter",
    label: "متر",
  },
  Piece: {
    value: "Piece",
    label: "قطعة",
  },
  Roll: {
    value: "Roll",
    label: "رول",
  },
  Box: {
    value: "box",
    label: "كرتونة",
  },
  SpongeRoll: {
    value: "SpongeRoll",
    label: "فرخ",
  },
} as const;

export type UnitValue = keyof typeof Unit;
export type UnitLabel = (typeof Unit)[UnitValue]["label"];

export const unitOptions = Object.values(Unit).map((unit) => ({
  value: unit.value,
  label: unit.label,
}));
/////////////////////////////////// Products //////////////////////////////
export interface Product {
  id: number;
  name: string;
  description: string;
  unitForWholeSale: UnitValue | "";
  unitForRetail: UnitValue | "";
  prieceForWholeSale: number;
  priceForRetail: number;
  pictureUrl: ""; // not added yet, need to handle
  quantityForOrigin: number;
  categoryName: string;
  subCategoryName: string;
}
export type CreateProductDto = Omit<
  Product,
  "id" | "categoryName" | "subCategoryName"
> & {
  categoryId: number;
  subCategoryId: number;
};
export interface GetProductResponse {
  data: Product[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

/////////////////////////////////// Categories //////////////////////////////
export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
  color?: string; // not coming from backend
  icon?: string; // not coming from backend
}

export type CreateCategoryDto = Omit<
  Category,
  "id" | "subCategories" | "color" | "icon"
>;

export interface GetCategoryResponse {
  data: Category[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}
/////////////////////////////////// SubCategories //////////////////////////////
export interface SubCategory {
  id: number;
  name: string;
}
export type CreateSubCategoryDto = Omit<SubCategory, "id"> & {
  categoryId: number;
};

/////////////////////////////////// Create API instances //////////////////////////////
export const categoryApi = createCrudApi<Category, CreateCategoryDto>(
  "categories",
);
export const productApi = createCrudApi<Product, CreateProductDto>("products");
export const subcategoryApi = createCrudApi<SubCategory, CreateSubCategoryDto>(
  "subcategories",
);
