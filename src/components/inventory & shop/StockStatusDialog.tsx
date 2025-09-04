import { Package, type LucideProps } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../ui/Dialog";
import { Badge } from "../common/Badge";
import { type Category } from "../../types/adminDashboard.interfaces";
import type { InventoryProduct } from "../../types/inventoryProduct.interfaces";
import { getUnitLabel } from "../../utils/helper";

type StockStatusDialogProps = {
  showStockModal: string | null;
  setShowStockModal: React.Dispatch<React.SetStateAction<string | null>>;
  getStockStatus: (product: InventoryProduct) =>
    | {
        status: string;
        color: string;
        icon: React.ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >;
        variant: "destructive";
      }
    | {
        status: string;
        color: string;
        icon: React.ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >;
        variant: "secondary";
      }
    | {
        status: string;
        color: string;
        icon: React.ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >;
        variant: "default";
      };
  getModalTitle: (status: string) => string;
  modalProducts: InventoryProduct[];
  categories: Category[];
};

function StockStatusDialog({
  showStockModal,
  setShowStockModal,
  getStockStatus,
  getModalTitle,
  modalProducts,
  categories,
}: StockStatusDialogProps) {
  return (
    <Dialog
      open={!!showStockModal}
      onOpenChange={() => setShowStockModal(null)}
    >
      <DialogOverlay open={!!showStockModal} />
      <DialogContent
        open={!!showStockModal}
        className="max-h-[80vh] max-w-2xl overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-[#8b4513]" />
            <span>{getModalTitle(showStockModal || "")}</span>
          </DialogTitle>
          <DialogDescription className="mt-1 text-right text-sm text-[#6d4c41]">
            عرض جميع المنتجات في هذه الفئة من حالة المخزون
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {modalProducts.length === 0 ? (
            <p className="py-4 text-center text-[#6d4c41]">
              لا توجد منتجات في هذه الفئة
            </p>
          ) : (
            modalProducts.map((inventoryProduct) => {
              const category = categories?.find(
                (c) => c.name === inventoryProduct.product.categoryName,
              );
              const stockInfo = getStockStatus(inventoryProduct);

              return (
                <div
                  key={inventoryProduct.id}
                  className="flex items-center space-x-3 rounded-lg bg-[#faf8f5] p-3"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: category
                        ? `${category.color}20`
                        : "#8b451320",
                    }}
                  >
                    <Package />
                  </div>

                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-[#5d4037]">
                      {inventoryProduct.product.name}
                    </h4>
                    <p className="text-sm text-[#6d4c41]">
                      {inventoryProduct.quantity}{" "}
                      {getUnitLabel(inventoryProduct.product.unitForWholeSale)}{" "}
                      - {inventoryProduct.product.categoryName}
                    </p>
                  </div>

                  <Badge
                    variant={stockInfo.variant}
                    className={stockInfo.color}
                  >
                    {stockInfo.status}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StockStatusDialog;
