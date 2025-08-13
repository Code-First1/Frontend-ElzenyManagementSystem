import { DollarSign } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";

function AdminSalesReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-secondary-foreground text-xl font-semibold">
          تقارير المبيعات
        </h2>
      </div>

      <div className="space-y-4">
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <DollarSign className="text-primary/50 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
              لا توجد مبيعات
            </h3>
            <p className="text-muted-foreground">
              ستظهر معاملات المبيعات هنا بمجرد البدء في بيع المنتجات.
            </p>
          </CardContent>
        </Card>
        {/* {products.length === 0 ? (
        ) : (
          groupedSales.map((receipt) => (
            <Card key={receipt.key} className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <CardTitle className="flex items-center space-x-2 space-x-reverse text-secondary-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>فاتورة #{receipt.key.split("_")[0].slice(-6)}</span>
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      بيع بواسطة {receipt.sellerName} في{" "}
                      {new Date(receipt.timestamp).toLocaleDateString("ar-EG")}{" "}
                      في{" "}
                      {new Date(receipt.timestamp).toLocaleTimeString("ar-EG")}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">
                      ${receipt.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {receipt.items.length} منتج
                      {receipt.items.length !== 1 ? "ات" : ""}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {receipt.items.map((sale, index) => (
                  <div
                    key={`${receipt.key}-item-${index}`}
                    className="flex items-center justify-between border-b border-primary/10 py-2 last:border-b-0"
                  >
                    <div className="flex-1 text-right">
                      <p className="font-medium text-secondary-foreground">
                        {sale.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity} {sale.unit}
                        {sale.quantity !== 1 ? "s" : ""} @ $
                        {sale.unitPrice.toFixed(2)}/{sale.unit}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-primary">
                        ${sale.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )} */}
      </div>
    </div>
  );
}

export default AdminSalesReports;
