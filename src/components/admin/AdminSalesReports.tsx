import { DollarSign, Loader } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import {
  InvoiceApi,
  type GetAllInvoicesResponse,
} from "../../types/invoice.interfaces";
import { useQuery } from "@tanstack/react-query";
import Reports from "../../pages/Reports";

function AdminSalesReports() {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => {
      return InvoiceApi.getAll<GetAllInvoicesResponse>();
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
          <Loader size="lg" color="text-primary" />
        </div>
      ) : inovices?.length === 0 ? (
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <DollarSign className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                لا توجد مبيعات
              </h3>
              <p className="text-muted-foreground">
                ستظهر معاملات المبيعات هنا بمجرد البدء في بيع المنتجات.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Reports invoices={inovices ?? []} />
      )}
    </div>
  );
}

export default AdminSalesReports;
