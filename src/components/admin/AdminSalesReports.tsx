import { Loader } from "lucide-react";
import {
  InvoiceApi,
  type GetAllInvoicesResponse,
} from "../../types/invoice.interfaces";
import { useQuery } from "@tanstack/react-query";
import Reports from "../../pages/Reports";
import { useState } from "react";

function AdminSalesReports() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", { CreateAt: selectedDate.toISOString() }],
    queryFn: () => {
      return InvoiceApi.getAll<GetAllInvoicesResponse>({
        CreateAt: selectedDate.toISOString(),
      });
    },
  });
  const inovices = data?.data;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-secondary-foreground text-xl font-semibold">
          تقارير المبيعات
        </h2>
      </div>
      {isLoading ? (
        <div className="flex h-30 w-full items-center justify-center">
          <Loader color="text-primary" />
        </div>
      ) : (
        <Reports
          invoices={inovices ?? []}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </div>
  );
}

export default AdminSalesReports;
