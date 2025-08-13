export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  category: string;
  subcategory: string;
  type: "leather" | "box" | "accessory" | "glue" | "";
  lastUpdated?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  subcategories: string[];
}
