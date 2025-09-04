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
import { getUnitLabel } from "../../utils/helper";

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
                <Store className="text-primary h-5 w-5" />
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
                  <label className="text-secondary-foreground text-sm font-semibold">
                    الوصف:{" "}
                  </label>
                  <span className="text-muted-foreground">
                    {showProductModal.product.description}
                  </span>
                </div>

                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    السعر بالتجزئة:{" "}
                  </label>
                  <span className="text-primary font-bold">
                    ${showProductModal.product.priceForRetail.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    الوحدة بالتجزئة:{" "}
                  </label>
                  <span className="text-muted-foreground">
                    {getUnitLabel(showProductModal.product.unitForRetail)}
                  </span>
                </div>

                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    السعر بالجملة:{" "}
                  </label>
                  <span className="text-primary font-bold">
                    ${showProductModal.product.prieceForWholeSale.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    الوحدة بالجملة:{" "}
                  </label>
                  <span className="text-muted-foreground">
                    {getUnitLabel(showProductModal.product.unitForWholeSale)}
                  </span>
                </div>

                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    المخزون:{" "}
                  </label>
                  <span className="text-muted-foreground">
                    {showProductModal.quantity}{" "}
                    {getUnitLabel(showProductModal.product.unitForRetail)}
                  </span>
                </div>

                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    الفئة:{" "}
                  </label>
                  <span className="text-muted-foreground">
                    {showProductModal.product.categoryName}
                  </span>
                </div>
                <div>
                  {showProductModal.product.subCategoryName && (
                    <p className="text-muted-foreground">
                      الفئة الفرعية: {showProductModal.product.subCategoryName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-secondary-foreground text-sm font-semibold">
                    قيمة المخزون:{" "}
                  </label>
                  <span className="text-primary font-bold">
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
