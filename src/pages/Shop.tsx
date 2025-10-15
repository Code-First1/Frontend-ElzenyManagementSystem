import { Edit, Package, Store } from "lucide-react";
import HomeLayout from "../layouts/HomeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Filters from "../components/common/Filters";
import { useMemo, useState } from "react";
import { useProductForm } from "../components/admin/products/useProductForm";
import { Badge } from "../components/common/Badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  shopProductApi,
  type GetAllShopProductsResponse,
  type ShopProduct,
  type UpdateShopProduct,
} from "../types/shopProduct.interfaces";
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
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { getUnitLabel } from "../utils/helper";
import DeleteDialog from "../components/admin/DeleteDialog";
import EditShopProductDialog from "../components/inventory & shop/EditShopProductDialog";

function Shop() {
  const [showEditStockModal, setShowEditStockModal] = useState<string | null>(
    null,
  );
  const [editStockQuantity, setEditStockQuantity] = useState<string>("");
  const { userRole } = useAppContext();
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

  const queryClient = useQueryClient();
  const { mutate: deleteShopProduct } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShopProduct }) =>
      shopProductApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
      toast.success("تم حذف المنتج بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف المنتج");
    },
  });

  return (
    <HomeLayout>
      <div className="text-right">
        <h1 className="text-2xl font-bold text-[#5d4037] md:text-3xl">المحل</h1>
        <p className="mt-1 text-[#6d4c41]">عرض شامل لمنتجات وإحصائيات المحل</p>
      </div>

      {/* Shop Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="border-[#8b4513]/20">
          <CardContent className="p-4 text-center">
            <Package className="mx-auto mb-2 h-6 w-6 text-[#8b4513] md:h-8 md:w-8" />
            <div className="text-xl font-bold text-[#5d4037] md:text-2xl">
              {data?.totalCount}
            </div>
            <p className="text-xs text-[#6d4c41] md:text-sm">إجمالي المنتجات</p>
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
      <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#6d4c41] md:text-base">
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
      <Card className="mt-4 border-[#8b4513]/20">
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
            <div className="space-y-3">
              {shopProducts.map((shopProduct) => {
                return (
                  <Card key={shopProduct.id} className="border-[#8b4513]/10">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center gap-4 sm:flex-row sm:space-x-4">
                        {/* Product Icon */}
                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                          <Package />
                        </div>

                        {/* Product Details */}
                        <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-6">
                          <div className="space-y-2 text-right md:col-span-2">
                            <h3 className="font-bold text-[#5d4037]">
                              {shopProduct.product.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
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
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="font-semibold text-[#6d4c41]">
                              الكمية: {shopProduct.quantity}{" "}
                              {getUnitLabel(shopProduct.product.unitForRetail)}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="font-bold text-[#8b4513]">
                              ${shopProduct.product.priceForRetail.toFixed(2)}
                            </p>
                            <p className="text-xs text-[#6d4c41] md:text-sm">
                              لكل{" "}
                              {getUnitLabel(shopProduct.product.unitForRetail)}
                              {"   "}
                              بالتجزئة
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="font-bold text-[#8b4513]">
                              $
                              {(
                                shopProduct.product.prieceForWholeSale *
                                shopProduct.product.quantityForOrigin
                              ).toFixed(2)}
                            </p>
                            <p className="text-xs text-[#6d4c41] md:text-sm">
                              لكل{" "}
                              {getUnitLabel(
                                shopProduct.product.unitForWholeSale,
                              )}
                              {"   "}
                              بالجملة
                            </p>
                          </div>
                        </div>

                        {userRole === "admin" && (
                          <div className="flex justify-end gap-2 sm:justify-center">
                            <button
                              onClick={() => {
                                setShowEditStockModal(
                                  shopProduct.id.toString(),
                                );
                                setEditStockQuantity("");
                              }}
                              className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <DeleteDialog
                              entityName="منتج"
                              itemName={shopProduct.product.name}
                              onClick={() =>
                                deleteShopProduct({
                                  id: shopProduct.id.toString(),
                                  data: {
                                    quantity: 0,
                                    smallBoxesPerBigBox: 0,
                                    fullBigBoxesCount: 0,
                                    openedBigBoxRemaining: 0,
                                    openedRollRemaining: 0,
                                  },
                                })
                              }
                            />
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

      {/* Product Details Modal */}
      <ProductDetailsDialog
        showProductModal={showProductModal}
        setShowProductModal={setShowProductModal}
      />

      {/* Edit Shop Product Stock Modal */}
      <EditShopProductDialog
        showModal={showEditStockModal}
        setShowModal={setShowEditStockModal}
        products={shopProducts}
        stockQuantity={editStockQuantity}
        setStockQuantity={setEditStockQuantity}
      />
    </HomeLayout>
  );
}

export default Shop;
