import { Edit } from "lucide-react";
import { Card, CardContent } from "../../../ui/Card";
import { Badge } from "../../common/Badge";
import ProductDeleteDialog from "./ProductDeleteDialog";
import type { Product } from "../../../types/adminDashboard.interfaces";

function ProductList({
  products,
  handleOpenEditDialog,
}: {
  products: Product[];
  handleOpenEditDialog: (product: Product) => void;
}) {
  return products.map((product) => (
    <Card key={product.id} className="border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-right">
            <h3 className="text-secondary-foreground mb-1 text-lg font-bold">
              {product.name}
            </h3>
            <p className="text-muted-foreground mb-2">{product.description}</p>
            <div className="flex items-center space-x-4">
              <span>
                الفئة: <Badge variant="outline">{product.category}</Badge>
              </span>
              <span>
                المخزون:{" "}
                <strong>
                  {product.stock} {product.unit}
                </strong>
              </span>
              <span>
                الحد الأدنى: <strong>{product.minStock}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground text-sm">
                السعر لكل {product.unit}
              </p>
              <p className="text-primary text-lg font-bold">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenEditDialog(product)}
                className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
              >
                <Edit className="h-5 w-5" />
              </button>

              {/* Product Delete Dialog */}
              <ProductDeleteDialog product={product} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ));
}

export default ProductList;
