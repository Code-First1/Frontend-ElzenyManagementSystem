import { useMemo, useState } from "react";
import {
  categoryApi,
  productApi,
  type CreateProductDto,
  type GetCategoryResponse,
  type Product,
} from "../../../types/adminDashboard.interfaces";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { APIError } from "../../../services/api";

export function useProductForm() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    unit: "",
    description: "",
    pricePerUnit: 0,
    pictureUrl: "",
    categoryId: 0,
    subCategoryId: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      unit: "",
      description: "",
      pricePerUnit: 0,
      pictureUrl: "",
      categoryId: 0,
      subCategoryId: 0,
    });
  };

  // Create Product mutation
  const { mutate: createProduct } = useMutation<
    { id: number },
    APIError,
    CreateProductDto
  >({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
      toast.success("تم إضافة المنتج بنجاح");
    },
  });

  // Add product
  const handleAddProduct = () => {
    if (!formData.name || formData.pricePerUnit <= 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة بقيم صحيحة");
      return;
    }
    createProduct(formData);
  };

  // Update product mutation
  const { mutate: updateProduct } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      resetForm();
      setIsFormOpen(false);
      toast.success("تم تحديث المنتج بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث المنتج");
    },
  });

  // Update product
  const handleUpdateProduct = (id: string, data: Partial<Product>) => {
    const originalProduct = editingProduct;
    if (originalProduct) {
      const isChanged = Object.entries(data).some(
        ([key, value]) =>
          (originalProduct as unknown as Record<string, unknown>)[key] !==
          value,
      );
      if (!isChanged) {
        toast.error("لم يتم تعديل أي بيانات");
        return;
      }
    }
    updateProduct({ id, data });
  };

  // Delete SubCategory Mutation
  const { mutate: deleteProduct } = useMutation<void, null, { id: number }>({
    mutationFn: (data) => productApi.delete(data.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم حذف المنتج بنجاح");
    },
  });

  // Fetch categories from backend
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll<GetCategoryResponse>(),
  });

  const categories = data?.data;

  // Find selected category based on categoryId
  const selectedCategory = categories?.find(
    (c) => c.id === formData.categoryId,
  );
  const availableSubcategories = useMemo(
    () => selectedCategory?.subCategories || [],
    [selectedCategory],
  );

  return {
    editingProduct,
    setEditingProduct,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    resetForm,
    setIsFormOpen,
    isFormOpen,
    handleAddProduct,
    handleUpdateProduct,
    deleteProduct,
    selectedCategory,
    availableSubcategories,
    categories,
  };
}
