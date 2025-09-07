import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "../../ui/Dialog";
import { Package } from "lucide-react";
import { Label } from "../common/Label";
import { Input } from "../common/Input";
import {
  InventoryProductApi,
  type InventoryProduct,
  type UpdateInventoryProduct,
} from "../../types/inventoryProduct.interfaces";
import { unitOptions } from "../../types/adminDashboard.interfaces";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type StockDialogProps = {
  mode: "add" | "edit";
  showModal: string | null;
  setShowModal: React.Dispatch<React.SetStateAction<string | null>>;
  stockQuantity: string;
  setStockQuantity: React.Dispatch<React.SetStateAction<string>>;
  products: InventoryProduct[];
};

function StockDialog({
  mode,
  showModal,
  setShowModal,
  stockQuantity,
  setStockQuantity,
  products,
}: StockDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: updateQuantity } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryProduct }) =>
      InventoryProductApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventoryProducts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventoryCounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventoryEmptyProducts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventoryGoodProducts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventoryCriticalProducts"],
      });
      toast.success(
        mode === "add" ? "تم إضافة الكمية بنجاح" : "تم تعديل الكمية بنجاح",
      );
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث المنتج");
    },
  });

  const handleSubmit = () => {
    if (!showModal) return;

    const quantity = parseInt(stockQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("يرجى إدخال كمية صحيحة");
      return;
    }

    const product = products.find((p) => p.id.toString() === showModal);
    if (!product) return;

    const newStock = mode === "add" ? product.quantity + quantity : quantity;

    updateQuantity({
      id: showModal,
      data: { quantity: newStock, minimumQuantity: product.minimumQuantity },
    });

    toast.success(
      mode === "add"
        ? `تم إضافة ${quantity} ${
            unitOptions.find(
              (unit) => unit.value === product.product.unitForWholeSale,
            )?.label
          } إلى مخزون ${product.product.name}`
        : `تم تعديل مخزون ${product.product.name} إلى ${quantity} ${
            unitOptions.find(
              (unit) => unit.value === product.product.unitForWholeSale,
            )?.label
          }`,
    );

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
          <DialogTitle className="text-secondary-foreground flex items-center space-x-2">
            {mode === "add" ? (
              <>
                <Plus className="h-5 w-5" />
                <span>إضافة مخزون</span>
              </>
            ) : (
              <>
                <Pencil className="h-5 w-5" />
                <span>تعديل المخزون</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-right">
            {mode === "add"
              ? "أدخل الكمية التي تريد إضافتها إلى المخزون الحالي"
              : "أدخل الكمية الجديدة للمخزون"}
          </DialogDescription>
        </DialogHeader>

        {showModal &&
          (() => {
            const product = products.find((p) => p.id.toString() === showModal);
            return product ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rounded-lg border bg-[#f5f5dc]/50 p-3">
                  <div className="flex-shrink-0">
                    <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                      <Package />
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="text-secondary-foreground font-semibold">
                      {product.product.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      المخزون الحالي: {product.quantity}{" "}
                      {
                        unitOptions.find(
                          (unit) =>
                            unit.value === product.product.unitForWholeSale,
                        )?.label
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="quantity"
                    className="text-secondary-foreground"
                  >
                    {mode === "add"
                      ? "الكمية المراد إضافتها"
                      : "الكمية الجديدة"}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder={`${
                      mode === "add"
                        ? "أدخل الكمية للإضافة"
                        : "أدخل الكمية الجديدة"
                    } (${
                      unitOptions.find(
                        (unit) =>
                          unit.value === product.product.unitForWholeSale,
                      )?.label
                    })`}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="border-primary/30 text-right"
                    min="1"
                  />
                </div>

                {stockQuantity &&
                  !isNaN(parseInt(stockQuantity)) &&
                  parseInt(stockQuantity) > 0 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-right text-sm text-blue-700">
                      {mode === "add" ? (
                        <>
                          المخزون الجديد سيكون:{" "}
                          <strong>
                            {product.quantity + parseInt(stockQuantity)}{" "}
                            {
                              unitOptions.find(
                                (unit) =>
                                  unit.value ===
                                  product.product.unitForWholeSale,
                              )?.label
                            }
                          </strong>
                        </>
                      ) : (
                        <>
                          سيتم تحديث المخزون إلى:{" "}
                          <strong>
                            {parseInt(stockQuantity)}{" "}
                            {
                              unitOptions.find(
                                (unit) =>
                                  unit.value ===
                                  product.product.unitForWholeSale,
                              )?.label
                            }
                          </strong>
                        </>
                      )}
                    </div>
                  )}
              </div>
            ) : null;
          })()}

        <DialogFooter className="flex space-x-2">
          <button
            onClick={closeModal}
            className="border-primary/30 text-secondary-foreground rounded-md border px-4 py-2 hover:bg-[#f5f5dc]"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !stockQuantity ||
              isNaN(parseInt(stockQuantity)) ||
              parseInt(stockQuantity) <= 0
            }
            className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
          >
            {mode === "add" ? (
              <>
                <Plus className="mt-1 h-4 w-4" />
                <span>إضافة المخزون</span>
              </>
            ) : (
              <>
                <Pencil className="mt-1 h-4 w-4" />
                <span>تعديل المخزون</span>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StockDialog;
