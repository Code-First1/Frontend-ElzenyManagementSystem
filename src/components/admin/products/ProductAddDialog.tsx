import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "../../../ui/Dialog";
import ProductFormFields from "./ProductFormFields";
import type {
  Category,
  Product,
} from "../../../types/adminDashboard.interfaces";
import type { useProductForm } from "./useProductForm";

type ProductAddDialogProps = {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productForm: ReturnType<typeof useProductForm>;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  categories: Category[];
};

function ProductAddDialog({
  isFormOpen,
  setIsFormOpen,
  productForm,
  editingProduct,
  setEditingProduct,
  categories,
}: ProductAddDialogProps) {
  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    productForm.resetForm();
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingProduct) {
      productForm.handleEdit(editingProduct);
    } else {
      productForm.handleAdd();
    }
  };
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogOverlay open={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <DialogTrigger>
        <button
          onClick={() => handleOpenAddDialog()}
          className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
        >
          <Plus className="mt-[0.2rem] h-5 w-5" />
          إضافة منتج
        </button>
      </DialogTrigger>
      <DialogContent
        open={isFormOpen}
        className="max-w-2xl"
        onClose={() => setIsFormOpen(false)}
      >
        <DialogHeader>
          {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
        </DialogHeader>
        <ProductFormFields
          categories={categories}
          formData={productForm.formData}
          setFormData={productForm.setFormData}
          availableSubcategories={categories.flatMap(
            (category) => category.subcategories,
          )}
        />
        <div className="flex justify-end gap-5 pt-4">
          <button
            className="hover:bg-secondary rounded-md px-4 py-2 shadow-sm"
            onClick={() => setIsFormOpen(false)}
          >
            إلغاء
          </button>
          <button
            onClick={() => handleSubmit()}
            className="bg-primary hover:bg-secondary-foreground rounded-md px-3 py-2 text-white"
          >
            {editingProduct ? "حفظ التعديلات" : "إضافة منتج"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductAddDialog;
