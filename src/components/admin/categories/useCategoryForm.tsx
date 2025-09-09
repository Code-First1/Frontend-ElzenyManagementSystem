// src/hooks/useCategoryForm.tsx
import { useState } from "react";
import toast from "react-hot-toast";
import {
  categoryApi,
  subcategoryApi,
  type Category,
  type CreateCategoryDto,
  type CreateSubCategoryDto,
  type SubCategory,
} from "../../../types/adminDashboard.interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { APIError } from "../../../services/api";

export function useCategoryForm() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [formData, setFormData] = useState({
    categoryName: "",
    subCategoryName: "",
  });
  const [categoryId, setCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categoryNameAdded, setCategoryNameAdded] = useState(false);

  // Create category mutation
  const { mutate: createCategory } = useMutation<
    { id: number },
    APIError,
    CreateCategoryDto
  >({
    mutationFn: categoryApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsFormOpen(false);
      toast.success("تم إضافة الفئة بنجاح");
      setCategoryId(data.id.toString());
      setCategoryNameAdded(true);
    },
  });

  // Add category
  const handleAddCategory = () => {
    if (!formData.categoryName.length) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }
    createCategory({ name: formData.categoryName });
  };

  // Update category mutation
  const { mutate: updateCategory } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      resetForm();
      setIsFormOpen(false);
      toast.success("تم تحديث الفئة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الفئة");
    },
  });

  // Update category
  const handleUpdateCategory = (id: string, data: Partial<Category>) => {
    updateCategory({ id, data });
  };

  // Delete SubCategory Mutation
  const { mutate: deleteCategory } = useMutation<void, null, { id: number }>({
    mutationFn: (data) => categoryApi.delete(data.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم حذف الفئة بنجاح");
    },
  });

  // Create SubCategory Mutation
  const { mutate: createSubCategory } = useMutation<
    { id: number },
    null,
    CreateSubCategoryDto
  >({
    mutationFn: (data) => subcategoryApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSubcategories([
        ...subcategories,
        { name: formData.subCategoryName, id: data.id },
      ]);
      toast.success("تم إضافة الفئة الفرعية بنجاح");
      setFormData({ ...formData, subCategoryName: "" });
    },
  });

  // Delete SubCategory Mutation
  const { mutate: deleteSubCategory } = useMutation<void, null, { id: number }>(
    {
      mutationFn: (data) => subcategoryApi.delete(data.id.toString()),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        setSubcategories((prevSubcategories) =>
          prevSubcategories.filter((sub) => sub.id !== variables.id),
        );
        toast.success("تم حذف الفئة الفرعية بنجاح");
      },
    },
  );

  // Add SubCategory
  function handleAddSubcategory(id?: number) {
    if (!formData.subCategoryName.length) {
      toast.error("يرجى إدخال اسم الفئة الفرعية");
      return;
    }
    createSubCategory({
      name: formData.subCategoryName,
      categoryId: id ? id : Number(categoryId),
    });
  }

  const resetForm = () => {
    setFormData({ categoryName: "", subCategoryName: "" });
    setNewSubcategory("");
  };

  return {
    editingCategory,
    isFormOpen,
    setIsFormOpen,
    formData,
    setFormData,
    newSubcategory,
    setNewSubcategory,
    resetForm,
    subcategories,
    categoryId,
    handleAddCategory,
    handleUpdateCategory,
    handleAddSubcategory,
    deleteSubCategory,
    categoryNameAdded,
    deleteCategory,
    setEditingCategory,
  };
}
