import type { Category } from "../../../types/adminDashboard.interfaces";
import { Label } from "../../common/Label";
import type { ProductFormData } from "./useProductForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../common/Select";
import { Input } from "../../common/Input";
import { Textarea } from "../../common/Textarea";

function ProductFormFields({
  categories,
  formData,
  setFormData,
  availableSubcategories,
}: {
  categories: Category[];
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  availableSubcategories: string[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 text-right">
        <Label htmlFor="name">اسم المنتج</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="أدخل اسم المنتج"
          className="text-right"
        />
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="category">الفئة</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              category: value,
              subcategory: "",
              unit: "",
            })
          }
        >
          <SelectTrigger>{formData.category || "اختر الفئة"}</SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="subcategory">الفئة الفرعية</Label>
        <Select
          value={formData.subcategory}
          onValueChange={(value) =>
            setFormData({ ...formData, subcategory: value })
          }
        >
          <SelectTrigger>
            <SelectValue>
              {formData.subcategory || "اختر الفئة الفرعية"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableSubcategories.map((subcategory) => (
              <SelectItem key={subcategory} value={subcategory}>
                {subcategory}
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
              unit: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue>{formData.unit || "اختر الوحدة"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="متر">متر</SelectItem>
            <SelectItem value="علبة">علبة</SelectItem>
            <SelectItem value="رول">رول</SelectItem>
            <SelectItem value="قطعة">قطعة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="price">السعر لكل وحدة</Label>
        <Input
          id="price"
          min={0}
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
          }
          className="text-right"
        />
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="stock">المخزون الحالي</Label>
        <Input
          id="stock"
          min="0"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
          }
          className="text-right"
        />
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="minStock">الحد الأدنى للمخزون</Label>
        <Input
          id="minStock"
          min="1"
          value={formData.minStock}
          onChange={(e) =>
            setFormData({
              ...formData,
              minStock: parseInt(e.target.value) || 1,
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
  );
}

export default ProductFormFields;
