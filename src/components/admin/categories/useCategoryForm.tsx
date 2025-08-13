import { useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "../../../types/adminDashboard.interfaces";

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
}

function useCategoryForm(
  onAddCategory: (category: Omit<Category, "id">) => void,
  onUpdateCategory: (id: string, updates: Partial<Category>) => void,
) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState("");

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    icon: "Package",
    color: "#8b4513",
    subcategories: [],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "Package",
      color: "#8b4513",
      subcategories: [],
    });
    setNewSubcategory("");
  };

  const addSubcategory = () => {
    if (newSubcategory && !formData.subcategories.includes(newSubcategory)) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, newSubcategory],
      });
      setNewSubcategory("");
    }
  };

  const removeSubcategory = (subcategory: string) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((s) => s !== subcategory),
    });
  };

  const handleAdd = () => {
    if (!formData.name) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }

    onAddCategory(formData);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("تم إضافة الفئة بنجاح");
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      subcategories: [...category.subcategories],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCategory || !formData.name) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }

    onUpdateCategory(editingCategory.id, formData);
    setEditingCategory(null);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("تم تحديث الفئة بنجاح");
  };

  return {
    editingCategory,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    newSubcategory,
    setNewSubcategory,
    resetForm,
    addSubcategory,
    removeSubcategory,
    handleAdd,
    handleEdit,
    handleUpdate,
  };
}

export default useCategoryForm;
