import { X } from "lucide-react";
import { Badge } from "../../common/Badge";
import { Input } from "../../common/Input";
import { Label } from "../../common/Label";
import { useCategoryForm } from "./useCategoryForm";
import type { Category } from "../../../types/adminDashboard.interfaces";
import { useEffect } from "react";

function CategoryFormFields({
  editingCategory,
}: {
  editingCategory?: Category;
}) {
  const {
    handleAddSubcategory,
    deleteSubCategory,
    handleAddCategory,
    handleUpdateCategory,
    subcategories,
    formData,
    setFormData,
    categoryNameAdded,
  } = useCategoryForm();

  useEffect(() => {
    if (editingCategory) {
      setFormData((prev) => {
        return {
          ...prev,
          categoryName: editingCategory.name,
        };
      });
    }
  }, [editingCategory, setFormData]);

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-right">
        <Label htmlFor="categoryName">اسم الفئة</Label>
        <div className="flex space-x-2">
          <Input
            id="categoryName"
            value={formData.categoryName}
            onChange={(e) =>
              setFormData({ ...formData, categoryName: e.target.value })
            }
            placeholder="أدخل اسم الفئة"
            className="text-right"
          />
          <button
            type="button"
            onClick={
              editingCategory
                ? () =>
                    handleUpdateCategory(editingCategory.id.toString(), {
                      name: formData.categoryName,
                    })
                : handleAddCategory
            }
            className="disabled:bg-accent rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037] disabled:cursor-not-allowed"
            disabled={
              categoryNameAdded ||
              (editingCategory
                ? formData.categoryName === editingCategory.name
                : !formData.categoryName)
            }
          >
            {editingCategory ? "تعديل" : "إضافة"}
          </button>
        </div>
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="subcategories" className="flex flex-col items-start">
          الفئات الفرعية
          {!categoryNameAdded && !editingCategory && (
            <span className="text-destructive">يرجي اضافة فئة *</span>
          )}{" "}
        </Label>
        <div className="flex space-x-2">
          <Input
            value={formData.subCategoryName}
            onChange={(e) =>
              setFormData({ ...formData, subCategoryName: e.target.value })
            }
            placeholder="أدخل اسم الفئة الفرعية"
            onKeyPress={(e) => e.key === "Enter" && handleAddSubcategory()}
            className="text-right"
          />
          <button
            type="button"
            onClick={() =>
              handleAddSubcategory(editingCategory && editingCategory.id)
            }
            className="disabled:bg-accent rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037] disabled:cursor-not-allowed"
            disabled={!categoryNameAdded && !editingCategory}
          >
            إضافة
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {editingCategory
            ? editingCategory.subCategories.map((subcategory) => (
                <Badge
                  key={subcategory.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-lg font-normal">
                    {subcategory.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteSubCategory({ id: subcategory.id })}
                    className="mr-1 text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Badge>
              ))
            : subcategories?.map((subcategory) => (
                <Badge
                  key={subcategory.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-lg font-normal">
                    {subcategory.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteSubCategory({ id: subcategory.id })}
                    className="mr-1 text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Badge>
              ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryFormFields;
