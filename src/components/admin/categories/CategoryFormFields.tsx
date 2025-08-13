import { X } from "lucide-react";
import { Badge } from "../../common/Badge";
import { Input } from "../../common/Input";
import { Label } from "../../common/Label";
import type { CategoryFormData } from "./useCategoryForm";

function CategoryFormFields({
  formData,
  setFormData,
  newSubcategory,
  setNewSubcategory,
  addSubcategory,
  removeSubcategory,
}: {
  formData: CategoryFormData;
  setFormData: (data: CategoryFormData) => void;
  newSubcategory: string;
  setNewSubcategory: (value: string) => void;
  addSubcategory: () => void;
  removeSubcategory: (subcategory: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-right">
        <Label htmlFor="categoryName">اسم الفئة</Label>
        <Input
          id="categoryName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="أدخل اسم الفئة"
          className="text-right"
        />
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="subcategories">الفئات الفرعية</Label>
        <div className="flex space-x-2">
          <Input
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            placeholder="أدخل اسم الفئة الفرعية"
            onKeyPress={(e) => e.key === "Enter" && addSubcategory()}
            className="text-right"
          />
          <button
            type="button"
            onClick={addSubcategory}
            className="rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037]"
          >
            إضافة
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.subcategories.map((subcategory, index) => (
            <Badge
              key={`${subcategory}-${index}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span className="text-lg font-normal">{subcategory}</span>
              <button
                type="button"
                onClick={() => removeSubcategory(subcategory)}
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
