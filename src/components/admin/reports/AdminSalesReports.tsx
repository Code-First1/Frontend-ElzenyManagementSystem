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
import { useGetAllUsersQuery } from "../../auth/useAuth";
import Loader from "../../common/Loader";

function AdminSalesReports() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { data: users } = useGetAllUsersQuery();
  const { data, isLoading } = useQuery({
    queryKey: [
      "invoices",
      {
        page,
        CreateAt: selectedDate.toLocaleDateString("en-CA"),
        DisplayName: selectedUser,
      },
    ],
    queryFn: () => {
      return InvoiceApi.getAll<GetAllInvoicesResponse>({
        CreateAt: selectedDate.toLocaleDateString("en-CA"),
        pageIndex: page,
        pageSize: DASHBOARD_INVOICES_PAGE_SIZE,
        DisplayName: selectedUser === "all" ? undefined : selectedUser,
      });
    },
  });

  const inovices = data?.data;
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));
  const totalInvoices = data?.totalCount;
  const totalRevenue = data?.grandTotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-secondary-foreground text-xl font-semibold">
          تقارير المبيعات
        </h2>
      </div>
      {isLoading ? (
        <div className="flex h-30 w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Reports
            invoices={inovices ?? []}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            users={users ?? []}
            totalInvoices={Number(totalInvoices)}
            totalRevenue={totalRevenue ?? 0}
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
