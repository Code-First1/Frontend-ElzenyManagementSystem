import {
  AlertTriangle,
  Archive,
  BarChart3,
  Calendar,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import QuickStats from "../admin/QuickStats";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function AdminHome() {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const products = [""];
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-secondary-foreground text-3xl font-bold">
            لوحة تحكم المدير
          </h1>
          <p className="text-muted-foreground mt-1">
            مرحباً بك، {currentUser?.displayName} - نظرة عامة على المتجر
          </p>
        </div>
        <div className="flex">
          <button
            className="bg-primary hover:bg-secondary-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-white"
            onClick={() => navigate("/adminDashboard")}
          >
            <Settings className="h-4 w-4" />
            <p className="pb-1">إدارة النظام</p>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Quick Actions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <button className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-green-600 text-white hover:bg-green-700">
              <ShoppingCart className="h-6 w-6" />
              <span>بيع منتج</span>
            </button>

            <button className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              <Package className="h-6 w-6" />
              <span>عرض المنتجات</span>
            </button>

            <button className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-orange-600 text-white hover:bg-orange-700">
              <Archive className="h-6 w-6" />
              <span>إدارة المخزون</span>
            </button>
            <button className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">
              <Plus className="h-6 w-6" />
              <span>إضافة منتج</span>
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
              المبيعات الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <p className="text-muted-foreground py-4 text-center">
                لا توجد مبيعات حديثة
              </p>
            ) : (
              <div className="space-y-3">
                {/* {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-lg bg-[#faf8f5] p-3"
                  >
                    <div className="text-right">
                      <p className="font-medium text-secondary-foreground">
                        {sale.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity} × ${sale.unitPrice.toFixed(2)} | بواسطة:{" "}
                        {sale.sellerName}
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
              <BarChart3 className="ml-2 h-5 w-5" />
              أكثر المنتجات مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <p className="text-muted-foreground py-4 text-center">
                لا توجد بيانات مبيعات
              </p>
            ) : (
              <div className="space-y-3">
                {/* {topProductsList.map(([productName, quantity], index) => (
                  <div
                    key={`top-product-${index}-${productName}`}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Staff Performance */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-secondary-foreground flex items-center">
              <Users className="ml-2 h-5 w-5" />
              أداء الموظفين
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <p className="text-muted-foreground py-4 text-center">
                لا توجد بيانات مبيعات
              </p>
            ) : (
              <div className="space-y-3">
                {/* {staffList.map(([staff, total]) => (
                  <div
                    key={staff}
                    className="flex items-center justify-between rounded-lg bg-[#faf8f5] p-3"
                  >
                    <span className="font-medium text-secondary-foreground">{staff}</span>
                    <span className="font-semibold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                ))} */}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-secondary-foreground flex items-center">
              <AlertTriangle className="ml-2 h-5 w-5" />
              تنبيهات المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <div className="py-4 text-center">
                <p className="font-medium text-green-600">
                  جميع المنتجات في مستوى مخزون جيد
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <div>
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
      </div>
    </>
  );
}

export default AdminHome;
