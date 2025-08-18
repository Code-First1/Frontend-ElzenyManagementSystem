import { Edit, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "../../../ui/Dialog";
import CategoryFormFields from "./CategoryFormFields";
import { useCategoryForm } from "./useCategoryForm";
import type { Category } from "../../../types/adminDashboard.interfaces";

function CategoryFormialog({ category }: { category?: Category }) {
  const { isFormOpen, setIsFormOpen, resetForm, setEditingCategory } =
    useCategoryForm();
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogOverlay open={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <DialogTrigger>
        {!category ? (
          <button
            onClick={() => {
              setIsFormOpen(true);
              resetForm();
            }}
            className="flex items-center gap-1 rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037]"
          >
            <FolderPlus className="mt-[0.2rem] h-5 w-5" />
            <span>إضافة فئة</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setEditingCategory(category);
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
          {category ? "تعديل الفئة" : "إضافة فئة جديدة"}
        </DialogHeader>
        <CategoryFormFields editingCategory={category} />
        <div className="flex justify-end gap-5 pt-4">
          <button
            className="hover:bg-secondary rounded-md px-4 py-2 shadow-sm"
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

export default CategoryFormialog;
