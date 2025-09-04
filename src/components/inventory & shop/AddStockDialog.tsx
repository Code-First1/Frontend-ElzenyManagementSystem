import { Plus } from "lucide-react";
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

type AddStockDialog = {
  showAddStockModal: string | null;
  setShowAddStockModal: React.Dispatch<React.SetStateAction<string | null>>;
  addStockQuantity: string;
  setAddStockQuantity: React.Dispatch<React.SetStateAction<string>>;
  products: InventoryProduct[];
};

function AddStockDialog({
  showAddStockModal,
  setShowAddStockModal,
  addStockQuantity,
  setAddStockQuantity,
  products,
}: AddStockDialog) {
  const queryClient = useQueryClient();
  const { mutate: updateQuantity } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryProduct }) =>
      InventoryProductApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryProducts"] });
      toast.success("تم تحديث المنتج بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث المنتج");
    },
  });

  const handleAddStock = () => {
    if (!showAddStockModal) return;

    const quantity = parseInt(addStockQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("يرجى إدخال كمية صحيحة");
      return;
    }

    const product = products.find((p) => p.id.toString() === showAddStockModal);
    if (!product) return;

    const newStock = product.quantity + quantity;

    updateQuantity({
      id: showAddStockModal,
      data: { quantity: newStock, minimumQuantity: product.minimumQuantity },
    });

    toast.success(
      `تم إضافة ${quantity} ${
        unitOptions.find(
          (unit) => unit.value === product.product.unitForWholeSale,
        )?.label
      } إلى مخزون ${product.product.name}`,
    );
    setShowAddStockModal(null);
    setAddStockQuantity("");
  };

  const closeAddStockModal = () => {
    setShowAddStockModal(null);
    setAddStockQuantity("");
  };

  return (
    <Dialog
      open={!!showAddStockModal}
      onOpenChange={(open) => !open && closeAddStockModal()}
    >
      <DialogOverlay open={!!showAddStockModal} />
      <DialogContent open={!!showAddStockModal} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-secondary-foreground flex items-center space-x-2">
            <span>إضافة مخزون</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-right">
            أدخل الكمية التي تريد إضافتها إلى المخزون الحالي
          </DialogDescription>
        </DialogHeader>

        {showAddStockModal &&
          (() => {
            const invenotryProducts = products.find(
              (p) => p.id.toString() === showAddStockModal,
            );
            return invenotryProducts ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rounded-lg border bg-[#f5f5dc]/50 p-3">
                  <div className="flex-shrink-0">
                    <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                      <Package />
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="text-secondary-foreground font-semibold">
                      {invenotryProducts.product.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      المخزون الحالي: {invenotryProducts.quantity}{" "}
                      {
                        unitOptions.find(
                          (unit) =>
                            unit.value ===
                            invenotryProducts.product.unitForWholeSale,
                        )?.label
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="add-quantity"
                    className="text-secondary-foreground"
                  >
                    الكمية المراد إضافتها
                  </Label>
                  <Input
                    id="add-quantity"
                    type="number"
                    placeholder={`أدخل الكمية (${
                      unitOptions.find(
                        (unit) =>
                          unit.value ===
                          invenotryProducts.product.unitForWholeSale,
                      )?.label
                    })`}
                    value={addStockQuantity}
                    onChange={(e) => setAddStockQuantity(e.target.value)}
                    className="border-primary/30 text-right"
                    min="1"
                  />
                </div>

                {addStockQuantity &&
                  !isNaN(parseInt(addStockQuantity)) &&
                  parseInt(addStockQuantity) > 0 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-right text-sm text-blue-700">
                        المخزون الجديد سيكون:{" "}
                        <strong>
                          {invenotryProducts.quantity +
                            parseInt(addStockQuantity)}{" "}
                          {
                            unitOptions.find(
                              (unit) =>
                                unit.value ===
                                invenotryProducts.product.unitForWholeSale,
                            )?.label
                          }
                        </strong>
                      </p>
                    </div>
                  )}
              </div>
            ) : null;
          })()}

        <DialogFooter className="flex space-x-2">
          <button
            onClick={closeAddStockModal}
            className="border-primary/30 text-secondary-foreground rounded-md border px-4 py-2 hover:bg-[#f5f5dc]"
          >
            إلغاء
          </button>
          <button
            onClick={handleAddStock}
            className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
            disabled={
              !addStockQuantity ||
              isNaN(parseInt(addStockQuantity)) ||
              parseInt(addStockQuantity) <= 0
            }
          >
            <Plus className="mt-1 h-4 w-4" />
            <span>إضافة المخزون</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddStockDialog;
