import {
  AlertTriangle,
  Archive,
  Calendar,
  CheckCircle,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";

function SellerHome() {
  const products = [""];
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-secondary-foreground text-3xl font-bold">
            لوحة تحكم المتجر
          </h1>
          <p className="text-muted-foreground mt-1">
            مرحباً بك، currentUser - إدارة المبيعات والمخزون
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground font-medium">
              مبيعاتي اليوم
            </CardTitle>
            <DollarSign className="text-primary h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-secondary-foreground text-2xl font-bold">
              $0.00
            </div>
            <p className="text-muted-foreground text-sm">5 مبيعة</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground font-medium">
              المنتجات المتاحة
            </CardTitle>
            <Package className="text-primary h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-secondary-foreground text-2xl font-bold">
              10
            </div>
            <p className="text-muted-foreground text-sm">من أصل 20</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground font-medium">
              تنبيهات المخزون
            </CardTitle>
            <AlertTriangle className="text-primary h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-secondary-foreground text-2xl font-bold">
              1
            </div>
            <p className="text-muted-foreground text-sm">منتجات تحتاج انتباه</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <button
              onClick={() => {}}
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              <ShoppingCart className="h-6 w-6" />
              <span>بيع منتج</span>
            </button>

            <button
              onClick={() => {}}
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <Package className="h-6 w-6" />
              <span>عرض المنتجات</span>
            </button>

            <button
              onClick={() => {}}
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
            >
              <Archive className="h-6 w-6" />
              <span>فحص المخزون</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-secondary-foreground flex items-center">
              <Calendar className="ml-2 h-5 w-5" />
              مبيعاتي الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <div className="py-8 text-center">
                <ShoppingCart className="text-primary/50 mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">لم تقم بأي مبيعات بعد</p>
                <button
                  onClick={() => {}}
                  className="bg-primary hover:bg-secondary-foreground mt-3 rounded-md px-4 py-2 text-white"
                >
                  ابدأ البيع الآن
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* {recentUserSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-lg bg-[#faf8f5] p-3"
                  >
                    <div className="text-right">
                      <p className="font-medium text-secondary-foreground">
                        {sale.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity} × ${sale.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.timestamp).toLocaleString("ar-EG")}
                      </p>
                    </div>
                    <span className="font-semibold text-primary">
                      ${sale.total.toFixed(2)}
                    </span>
                  </div>
                ))} */}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-secondary-foreground flex items-center">
              <TrendingUp className="ml-2 h-5 w-5" />
              أكثر منتجاتي مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <div className="py-8 text-center">
                <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">لا توجد بيانات مبيعات</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* {userTopProductsList.map(([productName, quantity], index) => (
                  <div
                    key={`user-top-product-${index}-${productName}`}
                    className="flex items-center justify-between rounded-lg bg-[#faf8f5] p-3"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Badge
                        variant="secondary"
                        className="flex h-6 w-6 items-center justify-center rounded-full p-0"
                      >
                        {index + 1}
                      </Badge>
                      <span className="font-medium text-secondary-foreground">
                        {productName}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {quantity} مباع
                    </span>
                  </div>
                ))} */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock Status */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-secondary-foreground flex items-center">
            <Archive className="ml-2 h-5 w-5" />
            حالة المخزون
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length ? (
            <div className="py-6 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
              <p className="font-medium text-green-600">
                جميع المنتجات في مستوى مخزون جيد
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground mb-4">
                المنتجات التي تحتاج انتباه:
              </p>
              {/* {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                >
                  <div className="text-right">
                    <p className="font-medium text-red-700">{product.name}</p>
                    <p className="text-sm text-red-600">
                      متبقي: {product.stock} {product.unit}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {product.stock === 0 ? "نفد المخزون" : "منخفض"}
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <Button
                  variant="outline"
                  onClick={() => onNavigate("inventory")}
                  className="mt-2 w-full border-primary/30 text-secondary-foreground"
                >
                  عرض جميع التنبيهات ({lowStockProducts.length})
                </Button>
              )} */}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default SellerHome;
