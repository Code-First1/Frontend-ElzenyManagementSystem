import { Edit, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "../../../ui/Dialog";
import ProductFormFields from "./ProductFormFields";
import type { Product } from "../../../types/adminDashboard.interfaces";
import { useProductForm } from "./useProductForm";

function ProductAddDialog({ product }: { product?: Product }) {
  const { isFormOpen, setIsFormOpen, resetForm, setEditingProduct } =
    useProductForm();
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogOverlay open={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <DialogTrigger>
        {!product ? (
          <button
            onClick={() => {
              setIsFormOpen(true);
              resetForm();
            }}
            className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
          >
            <FolderPlus className="mt-[0.2rem] h-5 w-5" />
            <span> إضافة منتج</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setEditingProduct(product);
              setIsFormOpen(true);
            }}
            className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
          >
            <Edit className="h-5 w-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        open={isFormOpen}
        className="max-w-2xl"
        onClose={() => setIsFormOpen(false)}
      >
        <DialogHeader className="items-start">
          {product ? "تعديل المنتج" : "إضافة منتج جديد"}
        </DialogHeader>
        <div className="relative">
          <ProductFormFields editingProduct={product} />
          <button
            className="hover:bg-secondary absolute bottom-[0.07rem] left-[6rem] rounded-md px-4 py-2 shadow-sm"
            onClick={() => {
              resetForm();
              setIsFormOpen(false);
            }}
          >
            إلغاء
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductAddDialog;
