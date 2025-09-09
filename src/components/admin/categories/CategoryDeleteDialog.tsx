import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/AlertDialog";
import { useState } from "react";
import type { Category } from "../../../types/adminDashboard.interfaces";
import { useCategoryForm } from "./useCategoryForm";

function CategoryDeleteDialog({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteCategory } = useCategoryForm();
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <button className="rounded-md border border-red-300 bg-white px-3 py-2 text-red-600 shadow-sm">
          <Trash2 className="h-5 w-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogOverlay open={isOpen} onClose={() => setIsOpen(false)} />
      <AlertDialogContent open={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>حذف الفئة</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من حذف "{category.name}"؟ لا يمكن التراجع عن هذا
            الإجراء وسيؤثر على جميع المنتجات في هذه الفئة.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteCategory({ id: category.id });
              setIsOpen(false);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CategoryDeleteDialog;
