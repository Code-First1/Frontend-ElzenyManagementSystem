import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { createCrudApi } from "../../services/apiCrud";
import { useQuery } from "@tanstack/react-query";

function QuickStats({
  revenueToday,
  lowStockProducts,
}: {
  revenueToday: number;
  lowStockProducts: number;
}) {
  const { data: totalProductsDashboard } = useQuery({
    queryKey: ["totalProductsDashboard"],
    queryFn: () => createCrudApi("Dashboard/total-products").getAll(),
    select: (data) => Number(data) || 0,
  });

  const { data: revenueWeek } = useQuery({
    queryKey: ["revenueWeek"],
    queryFn: () => createCrudApi("Dashboard/revenue").getAll({ days: 7 }),
    select: (data) => Number(data) || 0,
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground font-medium">
            إيرادات اليوم
          </CardTitle>
          <DollarSign className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-secondary-foreground text-2xl font-bold">
            ${revenueToday}
          </div>
          <p className="text-muted-foreground text-sm"> مبيعة</p>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground font-medium">
            إيرادات الأسبوع
          </CardTitle>
          <TrendingUp className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-secondary-foreground text-2xl font-bold">
            ${revenueWeek}
          </div>
          <p className="text-muted-foreground text-sm">مبيعة</p>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground font-medium">
            إجمالي المنتجات
          </CardTitle>
          <Package className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-secondary-foreground text-2xl font-bold">
            {totalProductsDashboard}
          </div>
          <p className="text-muted-foreground text-sm">منتجات نشطة</p>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground font-medium">
            منتجات منخفضة المخزون
          </CardTitle>
          <AlertTriangle className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-secondary-foreground text-2xl font-bold">
            {lowStockProducts}
          </div>
          <p className="text-muted-foreground text-sm">تحتاج إلى انتباه</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuickStats;
