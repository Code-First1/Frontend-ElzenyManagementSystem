import { useState } from "react";
import type {
  Category,
  Product,
} from "../../../types/adminDashboard.interfaces";
import toast from "react-hot-toast";

export interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  price: number;
  stock: number;
  type: "leather" | "box" | "accessory" | "glue" | "";
  minStock: number;
  description: string;
}

export function useProductForm(
  categories: Category[],
  onAddProduct: (product: Omit<Product, "id">) => void,
  onUpdateProduct: (id: string, updates: Partial<Product>) => void,
) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: categories[0]?.name || "",
    subcategory: "",
    unit: "",
    price: 0,
    stock: 0,
    type: "",
    minStock: 1,
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: categories[0]?.name || "",
      subcategory: "",
      unit: "",
      price: 0,
      stock: 0,
      minStock: 1,
      type: "",
      description: "",
    });
  };

  const handleAdd = () => {
    if (!formData.name || formData.price <= 0 || formData.stock < 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة بقيم صحيحة");
      return;
    }

    onAddProduct(formData);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("تم إضافة المنتج بنجاح");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      unit: product.unit,
      type: product.type,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      description: product.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (
      !editingProduct ||
      !formData.name ||
      formData.price <= 0 ||
      formData.stock < 0
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة بقيم صحيحة");
      return;
    }

    onUpdateProduct(editingProduct.id, formData);
    setEditingProduct(null);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("تم تحديث المنتج بنجاح");
  };

  const selectedCategory = categories.find((c) => c.name === formData.category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  return {
    editingProduct,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    availableSubcategories,
  };
}
