import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "../../../ui/AlertDialog";
import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

function ProductDeleteDialog({
  productName,
  onClick,
}: {
  productName: string;
  onClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <button className="rounded-md border border-red-300 bg-white px-3 py-2 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-5 w-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogOverlay open={isOpen} onClose={() => setIsOpen(false)} />
      <AlertDialogContent open={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>حذف المنتج</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من حذف "{productName}"؟ لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-5">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => {
              onClick();
              setIsOpen(false);
            }}
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProductDeleteDialog;
