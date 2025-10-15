import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "../../ui/Dialog";
import { Label } from "../common/Label";
import { Input } from "../common/Input";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shopProductApi } from "../../types/shopProduct.interfaces";
import type {
  ShopProduct,
  UpdateShopProduct,
} from "../../types/shopProduct.interfaces";
import { getUnitLabel } from "../../utils/helper";

type EditShopProductDialogProps = {
  showModal: string | null;
  setShowModal: React.Dispatch<React.SetStateAction<string | null>>;
  products: ShopProduct[];
  stockQuantity: string;
  setStockQuantity: React.Dispatch<React.SetStateAction<string>>;
};

function EditShopProductDialog({
  showModal,
  setShowModal,
  products,
  stockQuantity,
  setStockQuantity,
}: EditShopProductDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: updateShopProduct } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShopProduct }) =>
      shopProductApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
      toast.success(
        `تم تعديل كمية المنتج إلى ${variables.data.quantity} بنجاح`,
      );
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تعديل كمية المنتج");
    },
  });

  const handleSubmit = () => {
    if (!showModal) return;

    const product = products.find((p) => p.id.toString() === showModal);
    if (!product) return;

    const newQuantity = parseInt(stockQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error("يرجى إدخال كمية صحيحة");
      return;
    }

    updateShopProduct({
      id: showModal,
      data: {
        quantity: newQuantity,
        smallBoxesPerBigBox: product.smallBoxesPerBigBox,
        fullBigBoxesCount: product.fullBigBoxesCount,
        openedBigBoxRemaining: product.openedBigBoxRemaining,
        openedRollRemaining: product.openedRollRemaining,
      },
    });

    closeModal();
  };

  const closeModal = () => {
    setShowModal(null);
    setStockQuantity("");
  };

  return (
    <Dialog open={!!showModal} onOpenChange={(open) => !open && closeModal()}>
      <DialogOverlay open={!!showModal} />
      <DialogContent open={!!showModal} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-secondary-foreground flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            تعديل كمية المنتج
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-right">
            قم بإدخال الكمية الجديدة للمنتج
          </DialogDescription>
        </DialogHeader>

        {showModal &&
          (() => {
            const product = products.find((p) => p.id.toString() === showModal);
            return product ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-[#f5f5dc]/50 p-3 text-right">
                  <h4 className="text-secondary-foreground font-semibold">
                    {product.product.name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    الكمية الحالية في المحل: {product.quantity}{" "}
                    {getUnitLabel(product.product.unitForRetail)}
                  </p>
                </div>
                <div>
                  <Label className="mb-1" htmlFor="quantity">
                    الكمية الجديدة
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder={`${"أدخل الكمية الجديدة"} (${getUnitLabel(product.product.unitForRetail)})`}
                  />
                </div>

                {stockQuantity &&
                  !isNaN(parseInt(stockQuantity)) &&
                  parseInt(stockQuantity) > 0 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-right text-sm text-blue-700">
                      <>
                        سيتم تحديث مخزون المحل إلى:{" "}
                        <strong>
                          {parseInt(stockQuantity)}{" "}
                          {getUnitLabel(product.product.unitForRetail)}
                        </strong>
                      </>
                    </div>
                  )}
              </div>
            ) : null;
          })()}

        <DialogFooter>
          <button
            onClick={closeModal}
            className="rounded-md border px-4 py-2 hover:bg-gray-100"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!stockQuantity}
            className="bg-primary hover:bg-primary/80 rounded-md px-4 py-2 text-white"
          >
            حفظ التعديل
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditShopProductDialog;
