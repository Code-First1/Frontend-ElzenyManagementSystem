import {
  CalendarIcon,
  DollarSign,
  Download,
  FileText,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Popover, PopoverContent, PopoverTrigger } from "../../common/Popover";
import { useState } from "react";
import Calendar from "../../common/Calender";
import type { Invoice } from "../../../types/invoice.interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../common/Select";
import type { User } from "../../../types/auth.interfaces";

type ReportsProps = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  invoices: Invoice[];
  users: User[];
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
  totalInvoices: number;
  totalRevenue: number;
};

function Reports({
  invoices,
  users,
  selectedDate,
  setSelectedDate,
  selectedUser,
  setSelectedUser,
  totalInvoices,
  totalRevenue,
}: ReportsProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const handlePrint = () => {
    const printContent = document.getElementById("daily-report-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>تقرير مبيعات يوم ${formatDate(selectedDate)}</title>
              <style>
                body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #8b4513; padding-bottom: 10px; }
                .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
                .stat-card { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
                .transactions { margin-top: 20px; }
                .transaction { border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; border-radius: 5px; }
                .transaction-header { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 5px; }
                .sale-item { margin: 5px 0; padding: 5px; background-color: #f9f9f9; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div>
      {/* Date Selection */}
      <Card className="border-primary/20 my-5">
        <CardHeader>
          <CardTitle className="text-secondary-foreground flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="ml-2 h-5 w-5" />
              اختيار التاريخ
            </div>
            <button
              onClick={handlePrint}
              className="border-primary/30 text-secondary-foreground flex items-center rounded-md border px-4 py-2 hover:bg-[#f5f5dc]"
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
                <button className="border-primary/30 flex w-80 items-center justify-start rounded-md border px-4 py-2 text-right">
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

            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className={`border-primary/30 text-secondary-foreground rounded-md border px-4 py-2 ${
                    selectedDate.toDateString() === new Date().toDateString()
                      ? "bg-primary text-white"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  اليوم
                </button>
                <button
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setSelectedDate(yesterday);
                  }}
                  className={`border-primary/30 text-secondary-foreground rounded-md border px-4 py-2 ${
                    selectedDate.toDateString() ===
                    (() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      return yesterday.toDateString();
                    })()
                      ? "bg-primary text-white"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  أمس
                </button>
              </div>
              <div className="relative w-full sm:w-auto sm:min-w-[250px]">
                <Select
                  value={selectedUser}
                  onValueChange={(value) => setSelectedUser(value)}
                >
                  <SelectTrigger>
                    {users?.find((u) => u.userName === selectedUser)
                      ?.displayName || "جميع المستخدمين"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستخدمين</SelectItem>
                    {users?.map((user) => (
                      <SelectItem key={user.userName} value={user.userName}>
                        {user.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Total Operations Card */}
          <Card className="border-[#8b4513]/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="rounded-full bg-[#8b4513]/10 p-3">
                  <ShoppingBag className="h-8 w-8 text-[#8b4513]" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#5d4037]">
                    {totalInvoices}
                  </div>
                  <p className="mt-1 text-sm text-[#6d4c41]">إجمالي العمليات</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue Card */}
          <Card className="border-[#8b4513]/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="rounded-full bg-green-100 p-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-700">
                    {totalRevenue}
                  </div>
                  <p className="mt-1 text-sm text-[#6d4c41]">
                    إجمالي الإيرادات
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Transactions */}
        <Card className="transactions border-primary/20 mt-5">
          <CardHeader>
            <CardTitle className="text-secondary-foreground flex items-center">
              <FileText className="ml-2 h-5 w-5" />
              تفاصيل العمليات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBag className="text-primary/50 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                  لا توجد مبيعات
                </h3>
                <p className="text-muted-foreground">
                  لم يتم تسجيل أي مبيعات في هذا التاريخ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => {
                  return (
                    <div
                      key={invoice.id}
                      className="transaction border-primary/10 rounded-lg border p-4"
                    >
                      {/* Transaction Header */}
                      <div className="transaction-header border-primary/10 mb-3 flex items-center justify-between border-b pb-2">
                        <div className="text-right">
                          <div className="text-secondary-foreground font-semibold">
                            عملية رقم {invoice.number}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            البائع: {invoice.userName}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-primary font-bold">
                            ${invoice.total}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {invoice.dateTime.split("T")[0]}
                          </div>
                        </div>
                      </div>

                      {/* Transaction Items */}
                      <div className="space-y-2">
                        {invoice.invoiceProduct.map((product, i) => (
                          <div
                            key={i}
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
                                <div className="text-secondary-foreground font-semibold">
                                  {product?.productName}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {product.quantity} وحدة × $
                                  {product.pricePerUnit?.toFixed(2) || "0.00"}
                                </div>
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="text-primary font-bold">
                                $
                                {product.quantity * product.pricePerUnit ||
                                  "0.00"}
                              </div>
                            </div>
                          </div>
                        ))}
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
