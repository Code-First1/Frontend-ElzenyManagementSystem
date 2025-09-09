import { useMemo, useState } from "react";
import { useProductForm } from "../components/admin/products/useProductForm";
import Filters from "../components/common/Filters";
import HomeLayout from "../layouts/HomeLayout";
import { Card, CardContent } from "../ui/Card";
import { Package, Plus } from "lucide-react";
import { Badge } from "../components/common/Badge";
import {
  shopProductApi,
  type GetAllShopProductsResponse,
  type ShopProduct,
} from "../types/shopProduct.interfaces";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/Pagination";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/common/Loader";
import { unitOptions } from "../types/adminDashboard.interfaces";
import { Input } from "../components/common/Input";
import toast from "react-hot-toast";
import Cart from "../components/selling/Cart";
import { SELLING_PAGE_SIZE } from "../constants";
import { Label } from "../components/common/Label";
import { Switch } from "../ui/Switch";

export interface CartItem {
  shopProduct: ShopProduct;
  quantity: number;
  isWholesale: boolean;
}

function Selling() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const { categories } = useProductForm();
  const [page, setPage] = useState(1);
  const [customQuantity, setCustomQuantity] = useState<{
    [key: string]: number;
  }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wholesaleMode, setWholesaleMode] = useState<{
    [key: string]: boolean;
  }>({});
  const filters = {
    searchTerm,
    selectedCategory,
    selectedSubcategory,
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

  const { data, isLoading } = useQuery({
    queryKey: [
      "shopProducts",
      {
        pageIndex: page,
        pageSize: SELLING_PAGE_SIZE,
        search: searchTerm,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
      },
    ],
    queryFn: () => {
      // Create sort parameter in the format: namedesc, nameasc, pricedesc, priceasc
      return shopProductApi.getAll<GetAllShopProductsResponse>({
        pageIndex: page,
        pageSize: SELLING_PAGE_SIZE,
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
  const shopProducts = useMemo(() => data?.data, [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 10));

  const handleCustomQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setCustomQuantity({ ...customQuantity, [productId]: numValue });
  };

  const addCustomQuantityToCart = (product: ShopProduct) => {
    const quantity = customQuantity[product.id] || 1;
    addToCart(product, quantity);
    setCustomQuantity({ ...customQuantity, [product.id]: 1 });
  };

  const addToCart = (product: ShopProduct, quantity: number = 1) => {
    const isWholesale = wholesaleMode[product.id] || false;
    const existingItem = cart.find(
      (item) =>
        item.shopProduct.id === product.id && item.isWholesale === isWholesale,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      // if (newQuantity > product.quantity) {
      //   toast.error(
      //     `الكمية المطلوبة تتجاوز المخزون المتاح (${product.quantity} ${
      //       unitOptions.find(
      //         (unit) =>
      //           unit.value ===
      //           (isWholesale
      //             ? product.product.unitForWholeSale
      //             : product.product.unitForRetail),
      //       )?.label
      //     })`,
      //   );
      //   return;
      // }
      setCart(
        cart.map((item) =>
          item.shopProduct.id === product.id && item.isWholesale === isWholesale
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    } else {
      // if (quantity > product.quantity) {
      //   toast.error(
      //     `الكمية المطلوبة تتجاوز المخزون المتاح (${product.quantity} ${
      //       unitOptions.find(
      //         (unit) =>
      //           unit.value ===
      //           (isWholesale
      //             ? product.product.unitForWholeSale
      //             : product.product.unitForRetail),
      //       )?.label
      //     })`,
      //   );
      //   return;
      // }
      setCart([...cart, { shopProduct: product, quantity, isWholesale }]);
    }
    toast.success(
      `تم إضافة ${product.product.name} إلى السلة ${isWholesale ? "(جملة)" : "(تجزئة)"}`,
    );
  };

  const handleWholesaleModeChange = (productId: number, checked: boolean) => {
    setWholesaleMode({ ...wholesaleMode, [productId]: checked });
  };

  return (
    <HomeLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header */}
          <div className="text-right">
            <h1 className="text-secondary-foreground text-3xl font-bold">
              نقطة البيع
            </h1>
            <p className="text-muted-foreground mt-1">
              اختر المنتجات لإضافتها إلى السلة
            </p>
          </div>

          {/* Filters */}
          <Filters
            forSection="selling"
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            categories={categories}
            availableSubcategories={availableSubcategories}
          />
          {/* Products Grid */}
          {isLoading ? (
            <div className="flex h-30 w-full items-center justify-center">
              <Loader size="lg" color="text-primary" />
            </div>
          ) : shopProducts?.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="p-8 text-center">
                <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                  لا توجد منتجات متاحة
                </h3>
                <p className="text-muted-foreground">
                  لم يتم العثور على منتجات أو جميع المنتجات نفد مخزونها
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {shopProducts?.map((shopProduct) => {
                return (
                  <Card
                    key={shopProduct.id}
                    className="border-primary/20 transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                          <Package />
                        </div>

                        <div className="flex-1 text-right">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-secondary-foreground font-semibold">
                                {shopProduct.product.name}
                              </h3>
                              <p className="text-muted-foreground mb-1 text-sm">
                                {shopProduct.product.description}
                              </p>

                              {/* Show category and subcategory */}
                              <div className="mb-2 flex flex-wrap gap-1">
                                <Badge
                                  variant="outline"
                                  className="border-primary/30 text-muted-foreground text-xs"
                                >
                                  {shopProduct.product.categoryName}
                                </Badge>
                                {shopProduct.product.subCategoryName && (
                                  <Badge
                                    variant="outline"
                                    className="border-blue-300 text-xs text-blue-600"
                                  >
                                    {shopProduct.product.subCategoryName}
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-muted-foreground text-sm">
                                    السعر:
                                  </span>
                                  <span className="text-primary font-bold">
                                    $
                                    {wholesaleMode[shopProduct.id]
                                      ? (
                                          shopProduct.product
                                            .quantityForOrigin *
                                          shopProduct.product.prieceForWholeSale
                                        ).toFixed(2)
                                      : shopProduct.product.priceForRetail.toFixed(
                                          2,
                                        )}
                                  </span>
                                  لكل
                                  <span>
                                    {
                                      unitOptions.find(
                                        (unit) =>
                                          unit.value ===
                                          (wholesaleMode[shopProduct.id]
                                            ? shopProduct.product
                                                .unitForWholeSale
                                            : shopProduct.product
                                                .unitForRetail),
                                      )?.label
                                    }
                                  </span>
                                </div>

                                {/* <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    المتاح:
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <span className={`text-sm font-medium`}>
                                      {shopProduct.quantity}{" "}
                                      {
                                        unitOptions.find(
                                          (unit) =>
                                            unit.value ===
                                            (wholesaleMode[shopProduct.id]
                                              ? shopProduct.product
                                                  .unitForWholeSale
                                              : shopProduct.product
                                                  .unitForRetail),
                                        )?.label
                                      }
                                    </span>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="border-primary/20 mt-4 rounded-lg border bg-[#f5f5dc]/50 p-3">
                              <div className="flex items-center justify-between">
                                <Label
                                  htmlFor={`wholesale-switch-${shopProduct.id}`}
                                  className="text-secondary-foreground cursor-pointer text-base font-semibold"
                                >
                                  بيع بالجملة
                                </Label>
                                <Switch
                                  id={`wholesale-switch-${shopProduct.id}`}
                                  checked={
                                    wholesaleMode[shopProduct.id] || false
                                  }
                                  onCheckedChange={(checked) =>
                                    handleWholesaleModeChange(
                                      shopProduct.id,
                                      checked,
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => addToCart(shopProduct, 1)}
                                className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                              >
                                <Plus className="ml-1 h-4 w-4" />
                                <span>إضافة</span>
                              </button>
                            </div>

                            <div className="flex items-center space-x-5">
                              <Input
                                value={customQuantity[shopProduct.id] || 0}
                                onChange={(e) =>
                                  handleCustomQuantityChange(
                                    shopProduct.id.toString(),
                                    e.target.value,
                                  )
                                }
                                className="border-primary/30 text-center"
                              />
                              <button
                                onClick={() =>
                                  addCustomQuantityToCart(shopProduct)
                                }
                                className="border-primary/30 text-secondary-foreground w-30 rounded-md border hover:bg-[#f5f5dc]"
                              >
                                إضافة بالكمية
                              </button>
                            </div>
                          </div>
                        </div>
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
        </div>
        {/* Cart Section */}
        <Cart
          shopProducts={shopProducts ?? []}
          cart={cart}
          setCart={setCart}
          setCustomQuantity={setCustomQuantity}
        />
      </div>
    </HomeLayout>
  );
}

export default Selling;
