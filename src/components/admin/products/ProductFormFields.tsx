import {
  unitOptions,
  type Product,
} from "../../../types/adminDashboard.interfaces";
import { Label } from "../../common/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../common/Select";
import { Input } from "../../common/Input";
import { Textarea } from "../../common/Textarea";
import { useProductForm } from "./useProductForm";
import { useEffect } from "react";

function ProductFormFields({ editingProduct }: { editingProduct?: Product }) {
  const {
    handleUpdateProduct,
    formData,
    setFormData,
    availableSubcategories,
    handleAddProduct,
    categories,
  } = useProductForm();

  useEffect(() => {
    if (editingProduct !== null) {
      const category = categories?.find(
        (c) => c.name === editingProduct?.categoryName,
      );

      const subCategory = category?.subCategories?.find(
        (s) => s.name === editingProduct?.subCategoryName,
      );

      setFormData({
        name: editingProduct?.name || "",
        unit: editingProduct?.unit || "",
        description: editingProduct?.description || "",
        pricePerUnit: editingProduct?.pricePerUnit || 0,
        pictureUrl: editingProduct?.pictureUrl || "",
        categoryId: category?.id || 0,
        subCategoryId: subCategory?.id || 0,
      });
    }
  }, [editingProduct, categories, setFormData]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 text-right">
          <Label htmlFor="name">اسم المنتج</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم المنتج"
            className="text-right"
          />
        </div>

        <div className="space-y-2 text-right">
          <Label htmlFor="category">الفئة</Label>
          <Select
            value={formData.categoryId.toString()}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                categoryId: Number(value),
              })
            }
          >
            <SelectTrigger>
              {categories?.find(
                (category) => category.id === formData.categoryId,
              )?.name || "اختر الفئة"}
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 text-right">
          <Label htmlFor="subcategory">الفئة الفرعية</Label>
          <Select
            value={formData.subCategoryId.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, subCategoryId: Number(value) })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {availableSubcategories?.find(
                  (category) => category.id === formData.subCategoryId,
                )?.name || "اختر الفئة الفرعية"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((subcategory) => (
                <SelectItem
                  key={subcategory.id}
                  value={subcategory.id.toString()}
                >
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 text-right">
          <Label htmlFor="unit">الوحدة</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                unit: value as typeof formData.unit,
              })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {unitOptions.find((unit) => unit.value === formData.unit)
                  ?.label || "اختر الوحدة"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 text-right">
          <Label htmlFor="price">السعر لكل وحدة</Label>
          <Input
            id="price"
            min={0}
            value={formData.pricePerUnit}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricePerUnit: parseFloat(e.target.value) || 0,
              })
            }
            className="text-right"
          />
        </div>

        <div className="col-span-2 space-y-2 text-right">
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="أدخل وصف المنتج"
            className="text-right"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-5 pt-4">
        {!editingProduct ? (
          <button
            type="button"
            onClick={handleAddProduct}
            className="disabled:bg-accent bg-primary hover:bg-secondary-foreground rounded-md px-4 py-2 text-white"
          >
            إضافة
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              handleUpdateProduct(editingProduct.id.toString(), formData)
            }
            className="disabled:bg-accent bg-primary hover:bg-secondary-foreground rounded-md px-4 py-2 text-white"
          >
            تعديل
          </button>
        )}
      </div>
    </>
  );
}

export default ProductFormFields;
