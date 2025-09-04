import { Card, CardContent } from "../../../ui/Card";
import ProductDeleteDialog from "./ProductDeleteDialog";
import { type Product } from "../../../types/adminDashboard.interfaces";
import ProductAddDialog from "./ProductAddDialog";
import { Badge } from "../../common/Badge";
import { useProductForm } from "./useProductForm";
import { getUnitLabel } from "../../../utils/helper";

function ProductList({ products }: { products: Product[] }) {
  const { deleteProduct } = useProductForm();

  return (
    <div className="grid gap-4">
      {products?.map((product) => (
        <Card key={product.id} className="border-primary/20">
          <CardContent className="p-4 md:p-6">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-secondary-foreground text-lg font-bold">
                  {product.name}
                </h3>
                <div className="flex space-x-2">
                  <ProductAddDialog product={product} />
                  <ProductDeleteDialog
                    productName={product.name}
                    onClick={() => {
                      deleteProduct({ id: product.id });
                    }}
                  />
                </div>
              </div>

              <p className="text-muted-foreground mb-3">
                {product.description}
              </p>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-sm">الفئة</p>
                  <Badge variant="outline">{product.categoryName}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">الفئة الفرعية</p>
                  <Badge variant="outline">{product.subCategoryName}</Badge>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold">
                  <span>كل {getUnitLabel(product.unitForWholeSale)}</span>
                  <span>
                    {" "}
                    يحتوي علي {product.quantityForOrigin}{" "}
                    {getUnitLabel(product.unitForRetail)}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 flex flex-col items-center rounded-lg p-2">
                  <p className="text-muted-foreground mb-1 text-xs">
                    السعر لكل {getUnitLabel(product.unitForRetail)}
                  </p>
                  <p className="text-primary font-bold">
                    ${product.priceForRetail.toFixed(2)}
                  </p>
                </div>
                <div className="bg-muted/30 flex flex-col items-center rounded-lg p-2">
                  <p className="text-muted-foreground mb-1 text-xs">
                    السعر لكل {getUnitLabel(product.unitForWholeSale)}
                  </p>
                  <p className="text-primary font-bold">
                    ${product.prieceForWholeSale.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden items-center justify-between md:flex">
              <div className="flex-1">
                <h3 className="text-secondary-foreground mb-1 text-lg font-bold">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span>
                    الفئة:{" "}
                    <Badge variant="outline">{product.categoryName}</Badge>
                  </span>
                  <span>
                    الفئة الفرعية:{" "}
                    <Badge variant="outline">{product.subCategoryName}</Badge>
                  </span>
                  <p className="font-semibold">
                    <span>كل {getUnitLabel(product.unitForWholeSale)}</span>
                    <span>
                      {" "}
                      يحتوي علي {product.quantityForOrigin}{" "}
                      {getUnitLabel(product.unitForRetail)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">
                    السعر لكل {getUnitLabel(product.unitForRetail)}
                  </p>
                  <p className="text-primary text-lg font-bold">
                    ${product.priceForRetail.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">
                    السعر لكل {getUnitLabel(product.unitForWholeSale)}
                  </p>
                  <p className="text-primary text-lg font-bold">
                    ${product.prieceForWholeSale.toFixed(2)}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <ProductAddDialog product={product} />
                  <ProductDeleteDialog
                    productName={product.name}
                    onClick={() => {
                      deleteProduct({ id: product.id });
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ProductList;
