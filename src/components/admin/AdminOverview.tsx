import QuickStats from "./QuickStats";
import { useQuery } from "@tanstack/react-query";
import { createCrudApi } from "../../services/apiCrud";

function AdminOverview() {
  const { data: revenueToday } = useQuery({
    queryKey: ["revenueToday"],
    queryFn: () => createCrudApi("Dashboard/revenue").getAll({ days: 1 }),
    select: (data) => Number(data) || 0,
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["lowStockProducts"],
    queryFn: () => createCrudApi("Dashboard/low-stock-products").getAll(),
    select: (data) => Number(data) || 0,
  });
  return (
    <div>
      {/* Quick Stats */}
      <QuickStats
        revenueToday={revenueToday ?? 0}
        lowStockProducts={lowStockProducts ?? 0}
      />

      {/* Tob Products */}
      {/* <Card className="border-primary/20 mt-10">
        <CardHeader>
          <CardTitle className="text-secondary-foreground flex items-center">
            <BarChart3 className="ml-2 h-5 w-5" />
            أكثر المنتجات مبيعاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              لا توجد بيانات مبيعات
            </p>
          ) : (
            <div className="space-y-3">
              {topProductsList.map(([productName, quantity], index) => (
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
              ))}
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}

export default AdminOverview;
