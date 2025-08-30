import { Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../ui/Dialog";
import type { ShopProduct } from "../../types/shopProduct.interfaces";
import { unitOptions } from "../../types/adminDashboard.interfaces";

function ProductDetailsDialog({
  showProductModal,
  setShowProductModal,
}: {
  showProductModal: ShopProduct | null;
  setShowProductModal: React.Dispatch<React.SetStateAction<ShopProduct | null>>;
}) {
  return (
    <Dialog
      open={!!showProductModal}
      onOpenChange={() => setShowProductModal(null)}
    >
      <DialogOverlay open={!!showProductModal} />
      <DialogContent className="max-w-md" open={!!showProductModal}>
        {showProductModal && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-[#8b4513]" />
                <span>{showProductModal.product.name}</span>
              </DialogTitle>
              <DialogDescription className="text-right">
                تفاصيل المنتج الكاملة
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Product Info */}
              <div className="space-y-3 text-right">
                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    الوصف:{" "}
                  </label>
                  <span className="text-[#6d4c41]">
                    {showProductModal.product.description}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    السعر بالتجزئة:{" "}
                  </label>
                  <span className="font-bold text-[#8b4513]">
                    ${showProductModal.product.priceForRetail.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    الوحدة بالتجزئة:{" "}
                  </label>
                  <span className="text-[#6d4c41]">
                    {
                      unitOptions.find(
                        (unit) =>
                          unit.value === showProductModal.product.unitForRetail,
                      )?.label
                    }
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    السعر بالجملة:{" "}
                  </label>
                  <span className="font-bold text-[#8b4513]">
                    ${showProductModal.product.prieceForWholeSale.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    الوحدة بالجملة:{" "}
                  </label>
                  <span className="text-[#6d4c41]">
                    {
                      unitOptions.find(
                        (unit) =>
                          unit.value ===
                          showProductModal.product.unitForWholeSale,
                      )?.label
                    }
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    المخزون:{" "}
                  </label>
                  <span className="text-[#6d4c41]">
                    {showProductModal.quantity}{" "}
                    {
                      unitOptions.find(
                        (unit) =>
                          unit.value === showProductModal.product.unitForRetail,
                      )?.label
                    }
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    الفئة:{" "}
                  </label>
                  <span className="text-[#6d4c41]">
                    {showProductModal.product.categoryName}
                  </span>
                </div>
                <div>
                  {showProductModal.product.subCategoryName && (
                    <p className="text-[#6d4c41]">
                      الفئة الفرعية: {showProductModal.product.subCategoryName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5d4037]">
                    قيمة المخزون:{" "}
                  </label>
                  <span className="font-bold text-[#8b4513]">
                    $
                    {(
                      showProductModal.quantity *
                      showProductModal.product.priceForRetail
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
