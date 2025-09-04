import { Loader } from "lucide-react";
import {
  InvoiceApi,
  type GetAllInvoicesResponse,
} from "../../../types/invoice.interfaces";
import { useQuery } from "@tanstack/react-query";
import Reports from "./Reports";
import { useState } from "react";
import { DASHBOARD_INVOICES_PAGE_SIZE } from "../../../constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../ui/Pagination";

function AdminSalesReports() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", { page, CreateAt: selectedDate.toISOString() }],
    queryFn: () => {
      return InvoiceApi.getAll<GetAllInvoicesResponse>({
        CreateAt: selectedDate.toISOString(),
        pageIndex: page,
        pageSize: DASHBOARD_INVOICES_PAGE_SIZE,
      });
    },
  });
  const inovices = data?.data;
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));
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
        <>
          <Reports
            invoices={inovices ?? []}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {/* Server-side Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className={page === 1 ? "opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={
                        page === totalPages ? "opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminSalesReports;
