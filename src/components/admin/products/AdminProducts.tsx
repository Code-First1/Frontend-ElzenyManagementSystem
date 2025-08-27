import { Search, Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  productApi,
  type GetProductResponse,
} from "../../../types/adminDashboard.interfaces";
import { Input } from "../../common/Input";
import { Card, CardContent } from "../../../ui/Card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../ui/Pagination";
import ProductAddDialog from "./ProductAddDialog";
import ProductList from "./ProductList";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_PRODUCTS_PAGE_SIZE } from "../../../constants";

function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page, search: searchTerm }],
    queryFn: () =>
      productApi.getAll<GetProductResponse>({
        pageIndex: page,
        pageSize: DASHBOARD_PRODUCTS_PAGE_SIZE,
        search: searchTerm || undefined,
      }),
  });
  const products = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));

  useEffect(() => {
    if (page > 1 && products.length === 0 && data && data.totalCount > 0) {
      setPage(page - 1);
    }
  }, [products, page, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-700">
            حدث خطأ أثناء تحميل الفئات
          </h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-secondary-foreground text-xl font-semibold">
            إدارة المنتجات
          </h2>
        </div>

        {/* Product Add Dialog */}
        <ProductAddDialog />
      </div>

      {/* Product Search Bar */}
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
          <Search className="text-muted-foreground h-6 w-6" />
        </div>
        <Input
          type="text"
          placeholder="البحث في المنتجات..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-primary/30 focus:border-primary focus:ring-primary h-16 py-4 pr-14 text-right text-lg"
        />
      </div>

      {/* Product List */}
      <div className="mt-4 grid gap-4">
        {isLoading && !products.length ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-20 p-4" />
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                {searchTerm ? "لا توجد منتجات مطابقة للبحث" : "لا توجد منتجات"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `لم يتم العثور على منتجات تحتوي على "${searchTerm}"`
                  : "قم بإضافة أول منتج للمتجر"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <ProductList products={products} />

            {/* Server-side Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
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
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
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
    </>
  );
}

export default AdminProducts;
