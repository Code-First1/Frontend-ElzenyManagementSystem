import {
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  Package,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import HomeLayout from "../layouts/HomeLayout";
import Filters from "../components/common/Filters";
import { useMemo, useState } from "react";
import { useProductForm } from "../components/admin/products/useProductForm";
import { Badge } from "../components/common/Badge";
import StockStatusDialog from "../components/inventory & shop/StockStatusDialog";
import { useQuery } from "@tanstack/react-query";
import {
  InventoryDashboardCountsApi,
  InventoryDashboardCriticalProductsApi,
  InventoryDashboardEmptyProductsApi,
  InventoryDashboardGoodProductsApi,
  InventoryProductApi,
  type GetAllInventoryProductsResponse,
  type GetInventoryCounts,
  type InventoryProduct,
} from "../types/inventoryProduct.interfaces";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/Pagination";
import Loader from "../components/common/Loader";
import { INVENTORY_PAGE_SIZE } from "../constants";
import { useAppContext } from "../context/AppContext";
import AddStockDialog from "../components/inventory & shop/AddStockDialog";
import TransferStockDialog from "../components/inventory & shop/TransferStockDialog";
import { getUnitLabel } from "../utils/helper";

function Inventory() {
  const { userRole } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [stockFilter, setStockFilter] = useState<
    "all" | "good" | "critical" | "out-of-stock"
  >("all");
  const [page, setPage] = useState(1);
  const [showStockModal, setShowStockModal] = useState<string | null>(null);
  const [showAddStockModal, setShowAddStockModal] = useState<string | null>(
    null,
  );
  const [addStockQuantity, setAddStockQuantity] = useState<string>("");
  const [showTransferModal, setShowTransferModal] = useState<string | null>(
    null,
  );
  const [transferQuantity, setTransferQuantity] = useState<string>("");

  const openTransferModal = (productId: number) => {
    setShowTransferModal(productId.toString());
    setTransferQuantity("");
  };

  const sortParam = `${sortBy}${sortOrder}`;
  const { categories } = useProductForm();
  const filters = {
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    sortBy,
    sortOrder,
    stockFilter,
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

  // Convert stockFilter to backend number format
  const getStockFilterValue = (
    filter: typeof stockFilter,
  ): number | undefined => {
    switch (filter) {
      case "good":
        return 1;
      case "critical":
        return 2;
      case "out-of-stock":
        return 3;
      default:
        return undefined;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      "inventoryProducts",
      {
        pageIndex: page,
        pageSize: INVENTORY_PAGE_SIZE,
        search: searchTerm,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        state: getStockFilterValue(stockFilter),
        sort: sortParam,
      },
    ],
    queryFn: () => {
      return InventoryProductApi.getAll<GetAllInventoryProductsResponse>({
        pageIndex: page,
        pageSize: INVENTORY_PAGE_SIZE,
        search: searchTerm || undefined,
        categoryId:
          selectedCategory === "all" ? undefined : Number(selectedCategory),
        subcategoryId:
          selectedSubcategory === "all"
            ? undefined
            : Number(selectedSubcategory),
        state: getStockFilterValue(stockFilter),
        sort: sortParam,
      });
    },
  });
  const inventoryProducts = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));

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
      case "stockFilter":
        setStockFilter(value as typeof stockFilter);
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
    setStockFilter("all");
    setPage(1);
  };

  const getStockStatus = (product: InventoryProduct) => {
    if (product.quantity === 0) {
      return {
        status: "نفد المخزون",
        color: "bg-red-500 text-white",
        icon: AlertTriangle,
        variant: "destructive" as const,
      };
    } else if (product.quantity <= product.minimumQuantity) {
      return {
        status: "منخفض",
        color: "bg-yellow-500 text-white",
        icon: AlertCircle,
        variant: "secondary" as const,
      };
    } else {
      return {
        status: "جيد",
        color: "bg-stock-good text-white",
        icon: CheckCircle,
        variant: "default" as const,
      };
    }
  };

  const getModalTitle = (status: string) => {
    switch (status) {
      case "good":
        return "المنتجات ذات المخزون الجيد";
      case "critical":
        return "المنتجات منخفضة المخزون";
      case "empty":
        return "المنتجات نافدة المخزون";
      default:
        return "المنتجات";
    }
  };

  const { data: countsData } = useQuery({
    queryKey: ["inventoryCounts"],
    queryFn: () => {
      return InventoryDashboardCountsApi.getAll<GetInventoryCounts>();
    },
  });
  const goodCount = countsData?.goodProductsCount;
  const criticalCount = countsData?.criticalProductsCount;
  const emptyCount = countsData?.emptyProductsCount;
  const allItemsCount = countsData?.totalProductsCount;

  const { data: goodProducts } = useQuery({
    queryKey: ["inventoryGoodProducts"],
    queryFn: () => {
      return InventoryDashboardGoodProductsApi.getAll();
    },
  });
  const { data: criticalProducts } = useQuery({
    queryKey: ["inventoryCriticalProducts"],
    queryFn: () => {
      return InventoryDashboardCriticalProductsApi.getAll();
    },
  });
  const { data: emptyProducts } = useQuery({
    queryKey: ["inventoryEmptyProducts"],
    queryFn: () => {
      return InventoryDashboardEmptyProductsApi.getAll();
    },
  });

  return (
    <HomeLayout>
      {/* Header */}
      <div className="text-right">
        <h1 className="text-3xl font-bold text-[#5d4037]">إدارة المخزون</h1>
        <p className="mt-1 text-[#6d4c41]">مراقبة وإدارة مستويات المخزون</p>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#8b4513]/20">
          <CardContent className="p-4 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 text-[#8b4513]" />
            <div className="text-2xl font-bold text-[#5d4037]">
              {allItemsCount}
            </div>
            <p className="text-sm text-[#6d4c41]">إجمالي المنتجات</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer border-green-200 transition-shadow hover:shadow-md"
          onClick={() => setShowStockModal("good")}
        >
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <div className="text-2xl font-bold text-green-700">{goodCount}</div>
            <p className="text-sm text-green-600">مخزون جيد</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer border-yellow-200 transition-shadow hover:shadow-md"
          onClick={() => setShowStockModal("critical")}
        >
          <CardContent className="p-4 text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-700">
              {criticalCount}
            </div>
            <p className="text-sm text-yellow-600">مخزون منخفض</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer border-red-200 transition-shadow hover:shadow-md"
          onClick={() => setShowStockModal("empty")}
        >
          <CardContent className="p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-600" />
            <div className="text-2xl font-bold text-red-700">{emptyCount}</div>
            <p className="text-sm text-red-600">نفد المخزون</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Filters
        forSection="inventory"
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
            عرض {inventoryProducts.length} من أصل {data?.totalCount || 0} منتج
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

      {/* Products Table */}
      <Card className="border-[#8b4513]/20">
        <CardHeader>
          <CardTitle className="text-[#5d4037]">تفاصيل المخزون</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-30 w-full items-center justify-center">
              <Loader size="lg" color="text-primary" />
            </div>
          ) : inventoryProducts.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-[#8b4513]/50" />
              <h3 className="mb-2 text-lg font-semibold text-[#5d4037]">
                لا توجد منتجات
              </h3>
              <p className="text-[#6d4c41]">
                لم يتم العثور على منتجات تطابق معايير البحث
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inventoryProducts.map((inventoryProduct) => {
                const stockInfo = getStockStatus(inventoryProduct);
                const StockIcon = stockInfo.icon;
                return (
                  <Card
                    key={inventoryProduct.id}
                    className="border-[#8b4513]/10"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Product Icon */}
                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                          <Package />
                        </div>

                        {/* Product Details */}
                        <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-6">
                          <div className="space-y-2 text-right md:col-span-2">
                            <h3 className="font-bold text-[#5d4037]">
                              {inventoryProduct.product.name}
                            </h3>
                            <p className="text-sm text-[#6d4c41]">
                              الفئة:{" "}
                              <Badge variant="outline">
                                {inventoryProduct.product.categoryName}
                              </Badge>
                            </p>
                            {inventoryProduct.product.subCategoryName && (
                              <p className="text-sm text-[#6d4c41]">
                                الفئة الفرعية:{" "}
                                <Badge variant="outline">
                                  {inventoryProduct.product.subCategoryName}
                                </Badge>
                              </p>
                            )}
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <StockIcon
                                className="h-5 w-5"
                                style={{
                                  color:
                                    inventoryProduct.quantity === 0
                                      ? "#ef4444"
                                      : inventoryProduct.quantity <=
                                          inventoryProduct.minimumQuantity
                                        ? "#eab308"
                                        : "#22c55e",
                                }}
                              />
                              <span className="font-semibold text-[#5d4037]">
                                {inventoryProduct.quantity}{" "}
                                {getUnitLabel(
                                  inventoryProduct.product.unitForWholeSale,
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-[#6d4c41]">
                              الحد الأدنى: {inventoryProduct.minimumQuantity}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="font-bold text-[#8b4513]">
                              $
                              {inventoryProduct.product.priceForRetail.toFixed(
                                2,
                              )}
                            </p>
                            <p className="text-sm text-[#6d4c41]">
                              لكل{" "}
                              {getUnitLabel(
                                inventoryProduct.product.unitForRetail,
                              )}{" "}
                              بالتجزئة
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="font-bold text-[#8b4513]">
                              $
                              {inventoryProduct.product.prieceForWholeSale.toFixed(
                                2,
                              )}
                            </p>
                            <p className="text-sm text-[#6d4c41]">
                              لكل{" "}
                              {getUnitLabel(
                                inventoryProduct.product.unitForWholeSale,
                              )}{" "}
                              بالجملة
                            </p>
                          </div>

                          <div className="text-center">
                            <Badge
                              variant={stockInfo.variant}
                              className={stockInfo.color}
                            >
                              {stockInfo.status}
                            </Badge>
                          </div>
                        </div>

                        {userRole === "admin" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowAddStockModal(
                                  inventoryProduct.id.toString(),
                                );
                                setAddStockQuantity("");
                              }}
                              className="bg-primary hover:bg-secondary-foreground flex items-center justify-center rounded-md border border-[#8b4513]/30 px-4 py-2 text-white"
                            >
                              <Plus className="mt-1 h-4 w-4" />
                              إضافة
                            </button>
                            <button
                              onClick={() =>
                                openTransferModal(inventoryProduct.id)
                              }
                              className="flex items-center justify-center rounded-md border border-[#8b4513]/30 px-3 py-2 text-[#5d4037] hover:bg-[#f5f5dc]"
                              disabled={inventoryProduct.quantity === 0}
                            >
                              <ArrowRightLeft className="mt-1 h-4 w-4" />
                              نقل
                            </button>
                          </div>
                        )}
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
        </CardContent>
      </Card>

      {/* Stock Status Modal */}
      <StockStatusDialog
        showStockModal={showStockModal}
        setShowStockModal={setShowStockModal}
        getStockStatus={getStockStatus}
        getModalTitle={getModalTitle}
        modalProducts={
          (showStockModal === "good"
            ? goodProducts
            : showStockModal === "critical"
              ? criticalProducts
              : emptyProducts) ?? []
        }
        categories={categories ?? []}
      />

      {/* Add Stock Modal */}
      <AddStockDialog
        showAddStockModal={showAddStockModal}
        setShowAddStockModal={setShowAddStockModal}
        addStockQuantity={addStockQuantity}
        setAddStockQuantity={setAddStockQuantity}
        products={inventoryProducts}
      />

      {/* Transfer Stock Modal */}
      <TransferStockDialog
        showTransferModal={showTransferModal}
        transferQuantity={transferQuantity}
        setShowTransferModal={setShowTransferModal}
        setTransferQuantity={setTransferQuantity}
        products={inventoryProducts}
      />
    </HomeLayout>
  );
}

export default Inventory;
