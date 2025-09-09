import {
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  Edit,
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
  const [showEditStockModal, setShowEditStockModal] = useState<string | null>(
    null,
  );
  const [addStockQuantity, setAddStockQuantity] = useState<string>("");
  const [editStockQuantity, setEditStockQuantity] = useState<string>("");
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
    queryFn: () => InventoryDashboardCountsApi.getAll<GetInventoryCounts>(),
  });
  const goodCount = countsData?.goodProductsCount;
  const criticalCount = countsData?.criticalProductsCount;
  const emptyCount = countsData?.emptyProductsCount;
  const allItemsCount = countsData?.totalProductsCount;

  const { data: goodProducts } = useQuery({
    queryKey: ["inventoryGoodProducts"],
    queryFn: () => InventoryDashboardGoodProductsApi.getAll(),
  });
  const { data: criticalProducts } = useQuery({
    queryKey: ["inventoryCriticalProducts"],
    queryFn: () => InventoryDashboardCriticalProductsApi.getAll(),
  });
  const { data: emptyProducts } = useQuery({
    queryKey: ["inventoryEmptyProducts"],
    queryFn: () => InventoryDashboardEmptyProductsApi.getAll(),
  });

  return (
    <HomeLayout>
      <div className="text-right">
        <h1 className="text-secondary-foreground text-3xl font-bold">
          إدارة المخزون
        </h1>
        <p className="text-muted-foreground mt-1">
          مراقبة وإدارة مستويات المخزون
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <Package className="text-primary mx-auto mb-2 h-8 w-8" />
            <div className="text-secondary-foreground text-2xl font-bold">
              {allItemsCount}
            </div>
            <p className="text-muted-foreground text-sm">إجمالي المنتجات</p>
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

      <Filters
        forSection="inventory"
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        availableSubcategories={availableSubcategories}
      />

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          عرض {inventoryProducts.length} من أصل {data?.totalCount || 0} منتج
        </p>
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedSubcategory !== "all") && (
          <Badge
            variant="secondary"
            className="text-secondary-foreground bg-secondary"
          >
            تصفية نشطة
          </Badge>
        )}
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-secondary-foreground">
            تفاصيل المخزون
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-30 w-full items-center justify-center">
              <Loader size="lg" color="text-primary" />
            </div>
          ) : inventoryProducts.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                لا توجد منتجات
              </h3>
              <p className="text-muted-foreground">
                لم يتم العثور على منتجات تطابق معايير البحث
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inventoryProducts.map((inventoryProduct) => {
                const stockInfo = getStockStatus(inventoryProduct);
                const StockIcon = stockInfo.icon;
                return (
                  <Card key={inventoryProduct.id} className="border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="bg-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                            <Package />
                          </div>
                          <div className="space-y-1 text-right">
                            <h3 className="text-secondary-foreground font-bold">
                              {inventoryProduct.product.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">
                                {inventoryProduct.product.categoryName}
                              </Badge>
                              {inventoryProduct.product.subCategoryName && (
                                <Badge variant="outline">
                                  {inventoryProduct.product.subCategoryName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid flex-shrink-0 grid-cols-2 items-center gap-x-6 gap-y-4 text-center sm:grid-cols-4 lg:gap-x-8">
                          <div>
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
                              <span className="text-secondary-foreground font-semibold">
                                {inventoryProduct.quantity}{" "}
                                {getUnitLabel(
                                  inventoryProduct.product.unitForWholeSale,
                                )}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              الحد الأدنى: {inventoryProduct.minimumQuantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-primary font-bold">
                              $
                              {inventoryProduct.product.priceForRetail.toFixed(
                                2,
                              )}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              لكل{" "}
                              {getUnitLabel(
                                inventoryProduct.product.unitForRetail,
                              )}{" "}
                              (تجزئة)
                            </p>
                          </div>
                          <div>
                            <p className="text-primary font-bold">
                              $
                              {(
                                inventoryProduct.product.prieceForWholeSale *
                                inventoryProduct.product.quantityForOrigin
                              ).toFixed(2)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              لكل{" "}
                              {getUnitLabel(
                                inventoryProduct.product.unitForWholeSale,
                              )}{" "}
                              (جملة)
                            </p>
                          </div>
                          <div className="flex justify-center">
                            <Badge
                              variant={stockInfo.variant}
                              className={stockInfo.color}
                            >
                              {stockInfo.status}
                            </Badge>
                          </div>
                        </div>

                        {userRole === "admin" && (
                          <div className="flex shrink-0 items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowAddStockModal(
                                  inventoryProduct.id.toString(),
                                );
                                setAddStockQuantity("");
                              }}
                              className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-white"
                            >
                              <Plus className="h-4 w-4" />
                              <span>إضافة</span>
                            </button>
                            <button
                              onClick={() =>
                                openTransferModal(inventoryProduct.id)
                              }
                              className="border-primary/30 text-secondary-foreground hover:bg-secondary flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm"
                              disabled={inventoryProduct.quantity === 0}
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                              <span>نقل</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowEditStockModal(
                                  inventoryProduct.id.toString(),
                                );
                                setEditStockQuantity("");
                              }}
                              className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
                            >
                              <Edit className="h-5 w-5" />
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

      <AddStockDialog
        mode="add"
        showModal={showAddStockModal}
        setShowModal={setShowAddStockModal}
        stockQuantity={addStockQuantity}
        setStockQuantity={setAddStockQuantity}
        products={inventoryProducts}
      />
      <AddStockDialog
        mode="edit"
        showModal={showEditStockModal}
        setShowModal={setShowEditStockModal}
        stockQuantity={editStockQuantity}
        setStockQuantity={setEditStockQuantity}
        products={inventoryProducts}
      />

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
