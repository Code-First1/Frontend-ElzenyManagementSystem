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
import { useEffect, useState } from "react";

function ProductFormFields({ editingProduct }: { editingProduct?: Product }) {
  const [minimumQuantity, setMinimumQuantity] = useState(0);
  const {
    handleUpdateProduct,
    formData,
    setFormData,
    availableSubcategories,
    handleAddProduct,
    categories,
    inventoryProductId,
    handleUpdateInventoryProduct,
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
        description: editingProduct?.description || "",
        unitForRetail: editingProduct?.unitForRetail || "",
        unitForWholeSale: editingProduct?.unitForWholeSale || "",
        priceForRetail: editingProduct?.priceForRetail || 0,
        prieceForWholeSale: editingProduct?.prieceForWholeSale || 0,
        pictureUrl: editingProduct?.pictureUrl || "",
        categoryId: category?.id || 0,
        subCategoryId: subCategory?.id || 0,
      });
    }
  }, [editingProduct, categories, setFormData]);

  return (
    <>
      {/* First row - Product name spanning full width */}
      <div className="mb-4 w-[14rem] space-y-2 text-right">
        <Label htmlFor="name">اسم المنتج</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="أدخل اسم المنتج"
          className="text-right"
        />
      </div>

      {/* Rest of the fields in 2-column grid */}
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="unitForRetail">الوحدة للتجزئة</Label>
          <Select
            value={formData.unitForRetail}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                unitForRetail: value as typeof formData.unitForRetail,
              })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {unitOptions.find(
                  (unit) => unit.value === formData.unitForRetail,
                )?.label || "اختر الوحدة"}
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
          <Label htmlFor="priceForRetail">السعر للتجزئة</Label>
          <Input
            id="priceForRetail"
            min={0}
            value={formData.priceForRetail}
            onChange={(e) =>
              setFormData({
                ...formData,
                priceForRetail: parseFloat(e.target.value) || 0,
              })
            }
            className="text-right"
          />
        </div>

        <div className="space-y-2 text-right">
          <Label htmlFor="unitForWholeSale">الوحدة للجملة</Label>
          <Select
            value={formData.unitForWholeSale}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                unitForWholeSale: value as typeof formData.unitForWholeSale,
              })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {unitOptions.find(
                  (unit) => unit.value === formData.unitForWholeSale,
                )?.label || "اختر الوحدة"}
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
          <Label htmlFor="prieceForWholeSale">السعر للجملة</Label>
          <Input
            id="prieceForWholeSale"
            min={0}
            value={formData.prieceForWholeSale}
            onChange={(e) =>
              setFormData({
                ...formData,
                prieceForWholeSale: parseFloat(e.target.value) || 0,
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

      {!editingProduct && (
        <div className="mt-5 flex items-end gap-5 space-y-2 text-right">
          <div className="m-0 space-y-1">
            <Label htmlFor="minimumQuantity">
              الحد الادني للمخزون
              {inventoryProductId === 0 && (
                <span className="text-sm text-red-500">
                  * (يرجي اضافة المنتج اولا)
                </span>
              )}
            </Label>
            <Input
              disabled={inventoryProductId === 0}
              id="minimumQuantity"
              placeholder="سيتم تعيينه تلقائياً عند إضافة المنتج"
              value={minimumQuantity}
              onChange={(e) => setMinimumQuantity(Number(e.target.value))}
              className="text-right disabled:opacity-50"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              handleUpdateInventoryProduct(inventoryProductId.toString(), {
                quantity: 0,
                minimumQuantity,
              })
            }
            disabled={inventoryProductId === 0}
            className="disabled:bg-accent bg-primary hover:bg-secondary-foreground rounded-md px-4 py-2 text-white"
          >
            إضافة
          </button>
        </div>
      )}
    </>
  );
}

export default ProductFormFields;
