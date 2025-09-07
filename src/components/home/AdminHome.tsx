import {
  AlertTriangle,
  Archive,
  Package,
  Plus,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import QuickStats from "../admin/QuickStats";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { InventoryDashboardEmptyProductsApi } from "../../types/inventoryProduct.interfaces";
import { Badge } from "../common/Badge";
import { useQuery } from "@tanstack/react-query";
import { getUnitLabel } from "../../utils/helper";

function AdminHome({
  revenueToday,
  lowStockProducts,
}: {
  revenueToday: number;
  lowStockProducts: number;
}) {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const { data: emptyProducts } = useQuery({
    queryKey: ["inventoryEmptyProducts"],
    queryFn: () => InventoryDashboardEmptyProductsApi.getAll(),
  });
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
            <Settings className="hidden h-4 w-4 lg:block" />
            <p className="pb-1">إدارة النظام</p>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats
        revenueToday={revenueToday}
        lowStockProducts={lowStockProducts}
      />

      {/* Quick Actions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <button
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              onClick={() => navigate("/selling")}
            >
              <ShoppingCart className="h-6 w-6" />
              <span>بيع منتج</span>
            </button>

            <button
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/products")}
            >
              <Package className="h-6 w-6" />
              <span>عرض المنتجات</span>
            </button>

            <button
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
              onClick={() => navigate("/inventory")}
            >
              <Archive className="h-6 w-6" />
              <span>إدارة المخزون</span>
            </button>
            <button
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => navigate("/adminDashboard")}
            >
              <Plus className="h-6 w-6" />
              <span>إضافة منتج</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock Alerts */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-secondary-foreground flex items-center">
              <AlertTriangle className="ml-2 h-5 w-5" />
              تنبيهات المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!emptyProducts?.length ? (
              <div className="py-4 text-center">
                <p className="font-medium text-green-600">
                  جميع المنتجات في مستوى مخزون جيد
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {emptyProducts?.slice(0, 5).map((emptyProduct) => (
                  <div
                    key={emptyProduct.id}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-red-700">
                        {emptyProduct.product.name}
                      </p>
                      <p className="text-sm text-red-600">
                        متبقي: {emptyProduct.quantity}{" "}
                        {getUnitLabel(emptyProduct.product.unitForRetail)}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {emptyProduct.quantity === 0 ? "نفد المخزون" : "منخفض"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AdminHome;
