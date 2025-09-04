import { ArrowRightLeft, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../ui/Dialog";
import { Label } from "../common/Label";
import { Input } from "../common/Input";
import toast from "react-hot-toast";
import {
  InventoryToShopTransactionApi,
  type CreateInventoryToShopTransactions,
  type InventoryProduct,
} from "../../types/inventoryProduct.interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnitLabel } from "../../utils/helper";

type TransferStockDialogProps = {
  showTransferModal: string | null;
  setShowTransferModal: React.Dispatch<React.SetStateAction<string | null>>;
  setTransferQuantity: React.Dispatch<React.SetStateAction<string>>;
  products: InventoryProduct[];
  transferQuantity: string;
};

export default function TransferStockDialog({
  showTransferModal,
  setShowTransferModal,
  setTransferQuantity,
  products,
  transferQuantity,
}: TransferStockDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: transactProduct } = useMutation<
    unknown,
    unknown,
    CreateInventoryToShopTransactions
  >({
    mutationFn: (data) => InventoryToShopTransactionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryProducts"] });
      queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCounts"] });
      toast.success("تم نقل المنتج بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء نقل المنتج");
    },
  });

  const closeTransferModal = () => {
    setShowTransferModal(null);
    setTransferQuantity("");
  };

  const handleTransfer = () => {
    if (!showTransferModal) return;

    const quantity = parseInt(transferQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("يرجى إدخال كمية صحيحة");
      return;
    }

    const product = products.find((p) => p.id.toString() === showTransferModal);
    if (!product) return;

    if (quantity > product.quantity) {
      toast.error("الكمية المطلوبة أكبر من المخزون المتاح");
      return;
    }

    transactProduct({ productId: product.product.id, quantity });

    // toast.success(
    //   `تم نقل ${quantity} ${product.quantity} من مخزون ${product.product.name}`,
    // );
    setShowTransferModal(null);
    setTransferQuantity("");
  };
  return (
    <Dialog
      open={!!showTransferModal}
      onOpenChange={(open) => !open && closeTransferModal()}
    >
      <DialogOverlay open={!!showTransferModal} />
      <DialogContent open={!!showTransferModal} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[#5d4037]">
            <span>نقل مخزون</span>
          </DialogTitle>
          <DialogDescription className="text-right text-[#6d4c41]">
            أدخل الكمية التي تريد نقلها من المخزون الحالي
          </DialogDescription>
        </DialogHeader>

        {showTransferModal &&
          (() => {
            const inventoryProduct = products.find(
              (p) => p.id.toString() === showTransferModal,
            );
            return inventoryProduct ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rounded-lg border bg-[#f5f5dc]/50 p-3">
                  <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                    <Package />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-semibold text-[#5d4037]">
                      {inventoryProduct.product.name}
                    </h4>
                    <p className="text-sm text-[#6d4c41]">
                      المخزون المتاح: {inventoryProduct.quantity}{" "}
                      {getUnitLabel(inventoryProduct.product.unitForWholeSale)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transfer-quantity" className="text-[#5d4037]">
                    الكمية المراد نقلها
                  </Label>
                  <Input
                    id="transfer-quantity"
                    type="number"
                    placeholder={`أدخل الكمية (${getUnitLabel(
                      inventoryProduct.product.unitForWholeSale,
                    )})`}
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(e.target.value)}
                    className="border-[#8b4513]/30 text-right"
                    min="1"
                    max={inventoryProduct.quantity}
                  />
                  <p className="text-right text-sm text-[#6d4c41]">
                    الحد الأقصى: {inventoryProduct.quantity}{" "}
                    {getUnitLabel(inventoryProduct.product.unitForWholeSale)}
                  </p>
                </div>

                {transferQuantity &&
                  !isNaN(parseInt(transferQuantity)) &&
                  parseInt(transferQuantity) > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                      <p className="text-right text-sm text-orange-700">
                        المخزون المتبقي سيكون:{" "}
                        <strong>
                          {inventoryProduct.quantity -
                            parseInt(transferQuantity)}{" "}
                          {getUnitLabel(
                            inventoryProduct.product.unitForWholeSale,
                          )}
                        </strong>
                      </p>
                      {parseInt(transferQuantity) >
                        inventoryProduct.quantity && (
                        <p className="mt-1 text-right text-sm text-red-600">
                          ⚠️ الكمية أكبر من المخزون المتاح
                        </p>
                      )}
                    </div>
                  )}
              </div>
            ) : null;
          })()}

        <DialogFooter className="flex space-x-2">
          <button
            onClick={closeTransferModal}
            className="rounded-md border border-[#8b4513]/30 px-4 py-2 text-[#5d4037] hover:bg-[#f5f5dc]"
          >
            إلغاء
          </button>
          <button
            onClick={handleTransfer}
            className="flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            disabled={
              !transferQuantity ||
              isNaN(parseInt(transferQuantity)) ||
              parseInt(transferQuantity) <= 0 ||
              parseInt(transferQuantity) >
                (products.find((p) => p.id.toString() === showTransferModal)
                  ?.quantity || 0)
            }
          >
            <ArrowRightLeft className="ml-1 h-4 w-4" />
            <span>نقل المخزون</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
