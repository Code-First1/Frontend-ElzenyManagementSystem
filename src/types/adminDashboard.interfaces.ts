import { createCrudApi } from "../services/apiCrud";

/////////////////////////////////// Products //////////////////////////////
export interface Product {
  id: number;
  name: string;
  description: string;
  unit: string;
  pricePerUnit: number;
  pictureUrl: ""; // not added yet, need to handle
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
