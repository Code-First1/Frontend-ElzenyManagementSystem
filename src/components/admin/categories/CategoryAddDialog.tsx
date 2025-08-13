import { FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "../../../ui/Dialog";
import CategoryFormFields from "./CategoryFormFields";
import type { Category } from "../../../types/adminDashboard.interfaces";
import type useCategoryForm from "./useCategoryForm";

type CategoryAddDialogProps = {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryForm: ReturnType<typeof useCategoryForm>;
  editingCategory: Category | null;
  setEditingCategory: React.Dispatch<React.SetStateAction<Category | null>>;
};

function CategoryAddDialog({
  isFormOpen,
  setIsFormOpen,
  categoryForm,
  editingCategory,
  setEditingCategory,
}: CategoryAddDialogProps) {
  const handleOpenAddDialog = () => {
    setEditingCategory(null);
    categoryForm.resetForm();
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingCategory) {
      categoryForm.handleEdit(editingCategory);
    } else {
      categoryForm.handleAdd();
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogOverlay open={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <DialogTrigger>
        <button
          onClick={handleOpenAddDialog}
          className="flex items-center gap-1 rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037]"
        >
          <FolderPlus className="mt-[0.2rem] h-5 w-5" />
          <span>إضافة فئة</span>
        </button>
      </DialogTrigger>
      <DialogContent
        open={isFormOpen}
        className="max-w-2xl"
        onClose={() => setIsFormOpen(false)}
      >
        <DialogHeader>
          {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
        </DialogHeader>
        <CategoryFormFields
          formData={categoryForm.formData}
          setFormData={categoryForm.setFormData}
          newSubcategory={categoryForm.newSubcategory}
          setNewSubcategory={categoryForm.setNewSubcategory}
          addSubcategory={categoryForm.addSubcategory}
          removeSubcategory={categoryForm.removeSubcategory}
        />
        <div className="flex justify-end gap-5 pt-4">
          <button
            className="hover:bg-secondary rounded-md px-4 py-2 shadow-sm"
            onClick={() => {
              categoryForm.resetForm();
              setIsFormOpen(false);
            }}
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-[#8b4513] px-3 py-2 text-white hover:bg-[#5d4037]"
          >
            {editingCategory ? "تحديث الفئة" : "إضافة فئة"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryAddDialog;
