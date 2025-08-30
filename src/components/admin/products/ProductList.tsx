import { Card, CardContent } from "../../../ui/Card";
import ProductDeleteDialog from "./ProductDeleteDialog";
import {
  unitOptions,
  type Product,
} from "../../../types/adminDashboard.interfaces";
import ProductAddDialog from "./ProductAddDialog";
import { Badge } from "../../common/Badge";

function ProductList({ products }: { products: Product[] }) {
  return products?.map((product) => (
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
                الفئة: <Badge variant="outline">{product.categoryName}</Badge>
              </span>
              <span>
                الفئة الفرعية:{" "}
                <Badge variant="outline">{product.subCategoryName}</Badge>
              </span>
              {/* <span>
                المخزون:{" "}
                <strong>
                  {product.stock} {product.unit}
                </strong>
              </span>
              <span>
                الحد الأدنى: <strong>{product.minStock}</strong>
              </span> */}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground text-sm">
                السعر لكل{" "}
                {
                  unitOptions.find(
                    (unit) => unit.value === product.unitForRetail,
                  )?.label
                }
              </p>
              <p className="text-primary text-lg font-bold">
                ${product.priceForRetail.toFixed(2)}
              </p>
            </div>

            <div className="flex space-x-2">
              <ProductAddDialog product={product} />
              <ProductDeleteDialog product={product} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ));
}

export default ProductList;
