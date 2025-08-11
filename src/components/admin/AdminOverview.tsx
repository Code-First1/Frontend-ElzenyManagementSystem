import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import QuickStats from "./QuickStats";

function AdminOverview() {
  const products = [];
  return (
    <div>
      {/* Quick Stats */}
      <QuickStats />

      {/* Tob Products */}
      <Card className="mt-10 border-[#8b4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center text-[#5d4037]">
            <BarChart3 className="ml-2 h-5 w-5" />
            أكثر المنتجات مبيعاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="py-4 text-center text-[#6d4c41]">
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
                    <span className="font-medium text-[#5d4037]">
                      {productName}
                    </span>
                  </div>
                  <span className="text-sm text-[#6d4c41]">
                    {quantity} مباع
                  </span>
                </div>
              ))} */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOverview;
