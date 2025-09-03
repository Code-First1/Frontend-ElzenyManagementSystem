import {
  CalendarIcon,
  DollarSign,
  Download,
  FileText,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/common/Popover";
import { useState } from "react";
import Calendar from "../components/common/Calender";
import type { Invoice } from "../types/invoice.interfaces";

function Reports({ invoices }: { invoices: Invoice[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="text-right">
        <h1 className="text-3xl font-bold text-[#5d4037]">
          تقرير المبيعات اليومي
        </h1>
        <p className="mt-1 text-[#6d4c41]">عرض مبيعات يوم محدد بالتفصيل</p>
      </div>

      {/* Date Selection */}
      <Card className="border-[#8b4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#5d4037]">
            <div className="flex items-center">
              <CalendarIcon className="ml-2 h-5 w-5" />
              اختيار التاريخ
            </div>
            <button
              //   onClick={handlePrint}
              className="flex items-center rounded-md border border-[#8b4513]/30 px-4 py-2 text-[#5d4037] hover:bg-[#f5f5dc]"
            >
              <Download className="ml-1 h-4 w-4" />
              <span>طباعة التقرير</span>
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Popover isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen}>
              <PopoverTrigger>
                <button className="flex w-80 items-center justify-start rounded-md border border-[#8b4513]/30 px-4 py-2 text-right">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formatDate(selectedDate)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(new Date())}
                className="rounded-md border border-[#8b4513]/30 px-4 py-2 text-[#5d4037] hover:bg-[#f5f5dc]"
              >
                اليوم
              </button>
              <button
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setSelectedDate(yesterday);
                }}
                className="rounded-md border border-[#8b4513]/30 px-4 py-2 text-[#5d4037] hover:bg-[#f5f5dc]"
              >
                أمس
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div id="daily-report-content">
        {/* Print Header */}
        <div className="header" style={{ display: "none" }}>
          <h1>محلات الزيني - تقرير مبيعات يوم {formatDate(selectedDate)}</h1>
        </div>

        {/* Daily Statistics */}
        <div className="stats grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card border-[#8b4513]/20">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-[#8b4513]" />
              <div className="text-2xl font-bold text-[#5d4037]">
                {/* {dailyStats.totalSales} */}
              </div>
              <p className="text-sm text-[#6d4c41]">إجمالي العمليات</p>
            </CardContent>
          </Card>

          <Card className="stat-card border-green-200">
            <CardContent className="p-4 text-center">
              <DollarSign className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold text-green-700">
                {/* ${dailyStats.totalRevenue.toFixed(2)} */}
              </div>
              <p className="text-sm text-green-600">إجمالي الإيرادات</p>
            </CardContent>
          </Card>

          <Card className="stat-card border-blue-200">
            <CardContent className="p-4 text-center">
              <Package className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">
                {/* {dailyStats.totalQuantity} */}
              </div>
              <p className="text-sm text-blue-600">إجمالي القطع المباعة</p>
            </CardContent>
          </Card>

          <Card className="stat-card border-purple-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <div className="text-2xl font-bold text-purple-700">
                {/* {dailyStats.uniqueProducts} */}
              </div>
              <p className="text-sm text-purple-600">منتجات مختلفة</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales by User */}
        {/* {Object.keys(dailyStats.salesByUser).length > 0 && (
          <Card className="border-[#8b4513]/20">
            <CardHeader>
              <CardTitle className="flex items-center text-[#5d4037]">
                <User className="ml-2 h-5 w-5" />
                المبيعات حسب البائع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(dailyStats.salesByUser).map(([user, count]) => (
                  <div
                    key={user}
                    className="rounded-lg border border-[#8b4513]/10 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#5d4037]">
                        {user}
                      </span>
                      <Badge variant="secondary">{count} عملية</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Detailed Transactions */}
        <Card className="transactions mt-5 border-[#8b4513]/20">
          <CardHeader>
            <CardTitle className="flex items-center text-[#5d4037]">
              <FileText className="ml-2 h-5 w-5" />
              تفاصيل العمليات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[#8b4513]/50" />
                <h3 className="mb-2 text-lg font-semibold text-[#5d4037]">
                  لا توجد مبيعات
                </h3>
                <p className="text-[#6d4c41]">
                  لم يتم تسجيل أي مبيعات في هذا التاريخ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {[].map((transactionSales, index) => {
                  //   const firstSale = transactionSales[0];
                  //   const transactionTotal = transactionSales.reduce(
                  //     (sum, sale) => sum + sale.total,
                  //     0,
                  //   );

                  return (
                    <div
                      key={index}
                      className="transaction rounded-lg border border-[#8b4513]/10 p-4"
                    >
                      {/* Transaction Header */}
                      <div className="transaction-header mb-3 flex items-center justify-between border-b border-[#8b4513]/10 pb-2">
                        <div className="text-right">
                          <div className="font-semibold text-[#5d4037]">
                            عملية رقم {index + 1}
                          </div>
                          <div className="text-sm text-[#6d4c41]">
                            {/* البائع: {firstSale.soldBy} */}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-[#8b4513]">
                            {/* ${transactionTotal.toFixed(2)} */}
                          </div>
                          <div className="text-sm text-[#6d4c41]">
                            {/* {formatTime(new Date(firstSale.timestamp))} */}
                          </div>
                        </div>
                      </div>

                      {/* Transaction Items */}
                      <div className="space-y-2">
                        {invoices.flatMap((invoice) =>
                          invoice.invoiceProduct.map((product) => {
                            return (
                              <div
                                key={invoice.id}
                                className="sale-item flex items-center justify-between rounded bg-[#f9f9f9] p-2"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className="flex h-8 w-8 items-center justify-center rounded"
                                    style={{
                                      backgroundColor: "#8b451320",
                                    }}
                                  >
                                    <Package
                                      className="h-4 w-4"
                                      style={{
                                        color: "#8b4513",
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#5d4037]">
                                      {product?.productName || "منتج محذوف"}
                                    </div>
                                    <div className="text-sm text-[#6d4c41]">
                                      {product.quantity} وحدة × $
                                      {product.pricePerUnit?.toFixed(2) ||
                                        "0.00"}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <div className="font-bold text-[#8b4513]">
                                    ${invoice.total?.toFixed(2) || "0.00"}
                                  </div>
                                </div>
                              </div>
                            );
                          }),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
