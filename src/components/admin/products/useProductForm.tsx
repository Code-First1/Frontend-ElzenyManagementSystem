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
import {
  InventoryProductApi,
  type UpdateInventoryProduct,
} from "../../../types/inventoryProduct.interfaces";

export function useProductForm() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [inventoryProductId, setInventoryProductId] = useState(0);

  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    unitForRetail: "",
    unitForWholeSale: "",
    priceForRetail: 0,
    prieceForWholeSale: 0,
    pictureUrl: "",
    categoryId: 0,
    subCategoryId: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      unitForRetail: "",
      unitForWholeSale: "",
      priceForRetail: 0,
      prieceForWholeSale: 0,
      pictureUrl: "",
      categoryId: 0,
      subCategoryId: 0,
    });
  };

  // Create Product mutation
  const { mutate: createProduct } = useMutation<
    { productId: number; inventoryProductId: number },
    APIError,
    CreateProductDto
  >({
    mutationFn: productApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
      toast.success("تم إضافة المنتج بنجاح");
      setInventoryProductId(data.inventoryProductId);
    },
  });

  // Add product
  const handleAddProduct = () => {
    if (
      !formData.name ||
      formData.priceForRetail <= 0 ||
      formData.prieceForWholeSale <= 0
    ) {
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

  // Create minimum Quantity mutation
  const { mutate: updateInventoryProduct } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryProduct }) =>
      InventoryProductApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryProducts"] });
      setIsFormOpen(false);
      toast.success("تم اضافة الحد الادني بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث المنتج");
    },
  });

  // handle add minimum Quantity
  const handleUpdateInventoryProduct = (
    id: string,
    data: UpdateInventoryProduct,
  ) => {
    if (data.minimumQuantity <= 0) toast.error("يرجي اضافة قيمة صحيحة");
    else updateInventoryProduct({ id, data });
  };

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
    inventoryProductId,
    handleUpdateInventoryProduct,
  };
}
