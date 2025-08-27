import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import HomeLayout from "../layouts/HomeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Filters from "../components/common/Filters";
import { useMemo, useState } from "react";
import { useProductForm } from "../components/admin/products/useProductForm";
import { Badge } from "../components/common/Badge";
import { useQuery } from "@tanstack/react-query";
import {
  shopProductApi,
  type GetAllShopProductsResponse,
  type ShopProduct,
} from "../types/shopProduct.interfaces";
import { unitOptions } from "../types/adminDashboard.interfaces";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/Pagination";
import Loader from "../components/common/Loader";
import ProductDetailsDialog from "../components/inventory & shop/ProductDetailsDialog";
import { SHOP_PAGE_SIZE } from "../constants";

function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const { categories } = useProductForm();
  const filters = {
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    sortBy,
    sortOrder,
  };
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all" || !categories) {
      return [];
    }
    const category = categories.find(
      (c) => c.id.toString() === selectedCategory,
    );
    return category?.subCategories || [];
  }, [selectedCategory, categories]);
  const [showProductModal, setShowProductModal] = useState<ShopProduct | null>(
    null,
  );

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
      case "sortBy":
        setSortBy(value);
        break;
      case "sortOrder":
        setSortOrder(value as "asc" | "desc");
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      "shopProducts",
      {
        pageIndex: page,
        pageSize: SHOP_PAGE_SIZE,
        search: searchTerm,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
      },
    ],
    queryFn: () => {
      // Create sort parameter in the format: namedesc, nameasc, pricedesc, priceasc
      return shopProductApi.getAll<GetAllShopProductsResponse>({
        pageIndex: page,
        pageSize: SHOP_PAGE_SIZE,
        search: searchTerm || undefined,
        categoryId:
          selectedCategory === "all" ? undefined : Number(selectedCategory),
        subcategoryId:
          selectedSubcategory === "all"
            ? undefined
            : Number(selectedSubcategory),
      });
    },
  });
  const shopProducts = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));

  return (
    <HomeLayout>
      <div className="text-right">
        <h1 className="text-3xl font-bold text-[#5d4037]">المحل</h1>
        <p className="mt-1 text-[#6d4c41]">عرض شامل لمنتجات وإحصائيات المحل</p>
      </div>

      {/* Shop Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#8b4513]/20">
          <CardContent className="p-4 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 text-[#8b4513]" />
            <div className="text-2xl font-bold text-[#5d4037]">
              {data?.totalCount}
            </div>
            <p className="text-sm text-[#6d4c41]">إجمالي المنتجات</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <div className="text-2xl font-bold text-green-700">
              $
              {shopProducts
                .reduce(
                  (total, shopProduct) =>
                    total +
                    shopProduct.quantity * shopProduct.product.pricePerUnit,
                  0,
                )
                .toFixed(2)}
            </div>
            <p className="text-sm text-green-600">قيمة المخزون</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <div className="text-2xl font-bold text-blue-700">
              {/* {shopStats.totalSales} */}
            </div>
            <p className="text-sm text-blue-600">إجمالي المبيعات</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="mx-auto mb-2 h-8 w-8 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700">
              {/* ${shopStats.totalRevenue.toFixed(2)} */}
            </div>
            <p className="text-sm text-purple-600">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Filters
        forSection="shop"
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
            عرض {shopProducts.length} من أصل {data?.totalCount || 0} منتج
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

      {/* Products Display */}
      <Card className="border-[#8b4513]/20">
        <CardHeader>
          <CardTitle className="text-[#5d4037]">كتالوج المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-30 w-full items-center justify-center">
              <Loader size="lg" color="text-primary" />
            </div>
          ) : shopProducts.length === 0 ? (
            <div className="py-8 text-center">
              <Store className="mx-auto mb-4 h-12 w-12 text-[#8b4513]/50" />
              <h3 className="mb-2 text-lg font-semibold text-[#5d4037]">
                لا توجد منتجات
              </h3>
              <p className="text-[#6d4c41]">
                لم يتم العثور على منتجات تطابق معايير البحث
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shopProducts.map((shopProduct) => {
                return (
                  <Card
                    key={shopProduct.id}
                    className="cursor-pointer border-[#8b4513]/10 transition-shadow hover:shadow-md"
                    onClick={() => setShowProductModal(shopProduct)}
                  >
                    <CardContent className="space-y-3 p-5">
                      {/* Product Icon */}
                      <div className="flex justify-center">
                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                          <Package />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2 text-center">
                        <h3 className="line-clamp-2 font-semibold text-[#5d4037]">
                          {shopProduct.product.name}
                        </h3>
                        <p className="text-sm text-[#6d4c41]">
                          الفئة:{" "}
                          <Badge variant="outline">
                            {shopProduct.product.categoryName}
                          </Badge>
                        </p>
                        {shopProduct.product.subCategoryName && (
                          <p className="text-sm text-[#6d4c41]">
                            الفئة الفرعية:{" "}
                            <Badge variant="outline">
                              {shopProduct.product.subCategoryName}
                            </Badge>
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-col items-center gap-1">
                            <div className="font-bold text-[#8b4513]">
                              ${shopProduct.product.pricePerUnit.toFixed(2)}
                            </div>
                            <div className="text-sm text-[#6d4c41]">
                              لكل{" "}
                              {
                                unitOptions.find(
                                  (unit) =>
                                    unit.value === shopProduct.product.unit,
                                )?.label
                              }
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <div className="space-x-1 text-sm font-semibold text-[#5d4037]">
                              <span className="pt-1">
                                {shopProduct.quantity}
                              </span>
                              <span>
                                {
                                  unitOptions.find(
                                    (unit) =>
                                      unit.value === shopProduct.product.unit,
                                  )?.label
                                }
                              </span>
                            </div>
                            <div className="text-sm text-[#6d4c41]">متوفر</div>
                          </div>
                        </div>

                        {/* {popularity > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="ml-1 h-3 w-3" />
                            {popularity} مبيعة
                          </Badge>
                        )} */}
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
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      <ProductDetailsDialog
        showProductModal={showProductModal}
        setShowProductModal={setShowProductModal}
      />
    </HomeLayout>
  );
}

export default Shop;
