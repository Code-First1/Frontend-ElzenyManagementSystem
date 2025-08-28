import { Package } from "lucide-react";
import HomeLayout from "../layouts/HomeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Loader from "../components/common/Loader";
import { useMemo, useState } from "react";
import { Badge } from "../components/common/Badge";
import { useProductForm } from "../components/admin/products/useProductForm";
import { useQuery } from "@tanstack/react-query";
import {
  productApi,
  unitOptions,
  type GetProductResponse,
} from "../types/adminDashboard.interfaces";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/Pagination";
import Filters from "../components/common/Filters";
import { useNavigate } from "react-router-dom";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { categories } = useProductForm();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: [
      "products",
      {
        pageIndex: page,
        pageSize: 3,
        search: searchTerm,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
      },
    ],
    queryFn: () =>
      productApi.getAll<GetProductResponse>({
        pageIndex: page,
        pageSize: 3,
        search: searchTerm || undefined,
        categoryId:
          selectedCategory === "all" ? undefined : Number(selectedCategory),
        subcategoryId:
          selectedSubcategory === "all"
            ? undefined
            : Number(selectedSubcategory),
      }),
  });
  const products = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all" || !categories) {
      return [];
    }
    const category = categories.find(
      (c) => c.id.toString() === selectedCategory,
    );
    return category?.subCategories || [];
  }, [selectedCategory, categories]);

  const handleFilterChange = (filterName: string, value: string) => {
    setPage(1);
    switch (filterName) {
      case "searchTerm":
        setSearchTerm(value);
        break;
      case "selectedCategory":
        setSelectedCategory(value);
        setSelectedSubcategory("all");
        break;
      case "selectedSubcategory":
        setSelectedSubcategory(value);
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setPage(1);
  };

  const filters = { searchTerm, selectedCategory, selectedSubcategory };

  return (
    <HomeLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-secondary-foreground text-3xl font-bold">
            قائمة المنتجات
          </h1>
          <p className="mt-1 text-[#6d4c41]">عرض وتصفح جميع المنتجات المتاحة</p>
        </div>
        <button
          onClick={() => navigate("/selling")}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          بيع منتج
        </button>
      </div>

      {/* Filters and Search */}
      <Filters
        forSection="products"
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        availableSubcategories={availableSubcategories}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[#6d4c41]">
            عرض {products.length} من أصل {data?.totalCount || 0} منتج
          </p>
        </div>
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedSubcategory !== "all") && (
          <Badge
            variant="secondary"
            className="text-secondary-foreground bg-[#f5e6d3]"
          >
            تصفية نشطة
          </Badge>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex h-30 w-full items-center justify-center">
          <Loader size="lg" color="text-primary" />
        </div>
      ) : products.length === 0 ? (
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
              لا توجد منتجات
            </h3>
            <p className="mb-4 text-[#6d4c41]">
              لم يتم العثور على منتجات تطابق معايير البحث
            </p>
            <button
              onClick={handleResetFilters}
              className="border-primary/30 text-secondary-foreground rounded-md border px-4 py-2 hover:bg-[#f5f5dc]"
            >
              مسح جميع المرشحات
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            return (
              <Card
                key={product.id}
                className="border-primary/20 transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                        <Package />
                      </div>
                      <div className="space-y-2 text-right">
                        <CardTitle className="text-secondary-foreground text-lg leading-tight font-semibold">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm">
                          الفئة:{" "}
                          <Badge variant="outline">
                            {product.categoryName}
                          </Badge>
                        </p>
                        <p className="text-sm">
                          الفئة الفرعية:{" "}
                          <Badge variant="outline">
                            {product.subCategoryName}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    {/* <div
                      className={`h-3 w-3 rounded-full ${stockInfo.color}`}
                    /> */}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-right text-[#6d4c41]">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6d4c41]">
                        السعر لكل{" "}
                        {
                          unitOptions.find(
                            (unit) => unit.value === product.unit,
                          )?.label
                        }
                      </span>
                      <span className="text-primary text-lg font-bold">
                        ${product.pricePerUnit.toFixed(2)}
                      </span>
                    </div>

                    {/* <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6d4c41]">
                        المخزون المتاح
                      </span>
                      <div className="flex items-center space-x-2 ">
                        <StockIcon
                          className="h-4 w-4"
                          style={{
                            color:
                              stockInfo.color
                                .replace("bg-", "")
                                .replace("-500", "") === "red"
                                ? "#ef4444"
                                : stockInfo.color
                                      .replace("bg-", "")
                                      .replace("-500", "") === "yellow"
                                  ? "#eab308"
                                  : "#22c55e",
                          }}
                        />
                        <span className="font-semibold text-secondary-foreground">
                          {product.stock} {product.unit}
                        </span>
                      </div>
                    </div> */}

                    {/* <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6d4c41]">
                        الحد الأدنى
                      </span>
                      <span className="text-sm text-[#6d4c41]">
                        {product.minStock} {product.unit}
                      </span>
                    </div> */}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* <Badge
                      variant={
                        product.stock === 0
                          ? "destructive"
                          : product.stock <= product.minStock
                            ? "secondary"
                            : "default"
                      }
                      className={`${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : product.stock <= product.minStock
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {stockInfo.status}
                    </Badge> */}

                    {/* {product.stock > 0 && ( */}
                    <button
                      onClick={() => navigate("/selling")}
                      className="bg-primary hover:bg-secondary-foreground rounded-md px-4 py-2 text-white"
                    >
                      بيع الآن
                    </button>
                    {/* )} */}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
    </HomeLayout>
  );
}

export default Products;
