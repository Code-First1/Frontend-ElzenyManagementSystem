import { Package, Users } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";

function AdminAnalysis() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="border-[#8b4513]/20">
        <CardContent className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-[#5d4037]">
            <Users className="ml-2 h-5 w-5" />
            مبيعات الموظفين
          </h3>
          <p className="py-4 text-center text-[#6d4c41]">
            لا توجد بيانات مبيعات
          </p>
          {/* {(() => {
                  const salesByStaff = sales.reduce(
                    (acc, sale) => {
                      acc[sale.sellerName] =
                        (acc[sale.sellerName] || 0) + sale.total;
                      return acc;
                    },
                    {} as Record<string, number>,
                  );

                  const staffList = Object.entries(salesByStaff).sort(
                    ([, a], [, b]) => b - a,
                  );

                  return staffList.length === 0 ? (
                    <p className="py-4 text-center text-[#6d4c41]">
                      لا توجد بيانات مبيعات
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {staffList.map(([staff, total]) => (
                        <div
                          key={staff}
                          className="flex items-center justify-between rounded-lg bg-[#faf8f5] p-3"
                        >
                          <span className="font-medium text-[#5d4037]">
                            {staff}
                          </span>
                          <span className="font-semibold text-[#8b4513]">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()} */}
        </CardContent>
      </Card>

      <Card className="border-[#8b4513]/20">
        <CardContent className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-[#5d4037]">
            <Package className="ml-2 h-5 w-5" />
            أداء المنتجات
          </h3>
          <p className="py-4 text-center text-[#6d4c41]">
            لا توجد بيانات مبيعات
          </p>
          {/* {(() => {
                  const productRevenue = sales.reduce(
                    (acc, sale) => {
                      acc[sale.productName] =
                        (acc[sale.productName] || 0) + sale.total;
                      return acc;
                    },
                    {} as Record<string, number>,
                  );

                  const productList = Object.entries(productRevenue)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);

                  return productList.length === 0 ? (
                    <p className="py-4 text-center text-[#6d4c41]">
                      لا توجد بيانات مبيعات
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {productList.map(([product, revenue]) => (
                        <div
                          key={product}
                          className="flex items-center justify-between rounded-lg bg-[#faf8f5] p-3"
                        >
                          <span className="line-clamp-1 font-medium text-[#5d4037]">
                            {product}
                          </span>
                          <span className="font-semibold text-[#8b4513]">
                            ${revenue.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()} */}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminAnalysis;
