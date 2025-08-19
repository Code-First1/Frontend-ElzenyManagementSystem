// src/components/AdminCategories.tsx
import { useEffect, useState } from "react";
import {
  categoryApi,
  type GetCategoryResponse,
} from "../../../types/adminDashboard.interfaces";
import { Package, Search } from "lucide-react";
import { Input } from "../../common/Input";
import { Card, CardContent } from "../../../ui/Card";
import CategoryList from "./CategoryList";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import CategoryFormDialog from "./CategorFormDialog";

function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", { page, search: searchTerm }],
    queryFn: () =>
      categoryApi.getAll<GetCategoryResponse>({
        pageIndex: page,
        pageSize: 4,
        search: searchTerm || undefined,
      }),
  });
  const categories = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));

  useEffect(() => {
    if (page > 1 && categories.length === 0 && data && data.totalCount > 0) {
      setPage(page - 1);
    }
  }, [categories, page, data]);

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
        <h2 className="text-secondary-foreground text-xl font-semibold">
          إدارة الفئات
        </h2>

        {/* Category Add Dialog */}
        <CategoryFormDialog />
      </div>

      {/* Category Search Bar */}
      <div className="relative mt-4 w-full max-w-3xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
          <Search className="h-6 w-6 text-[#6d4c41]" />
        </div>
        <Input
          type="text"
          placeholder="البحث في الفئات..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="h-16 border-[#8b4513]/30 py-4 pr-14 text-right text-lg focus:border-[#8b4513] focus:ring-[#8b4513]"
        />
      </div>

      {/* Category List */}
      <div className="mt-4 grid gap-4">
        {isLoading && !categories.length ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-20 p-4" />
              </Card>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                {searchTerm ? "لا توجد فئات مطابقة للبحث" : "لا توجد فئات"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `لم يتم العثور على فئات تحتوي على "${searchTerm}"`
                  : "قم بإضافة أول فئة للمتجر"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <CategoryList categories={categories} />

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

export default AdminCategories;
