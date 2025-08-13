import { Search, Package } from "lucide-react";
import { useState } from "react";
import type {
  Category,
  Product,
} from "../../../types/adminDashboard.interfaces";
import { useProductForm } from "./useProductForm";
import { Input } from "../../common/Input";
import { DEFAULT_CATEGORIES, INITIAL_PRODUCTS } from "../../../constants";
import { Card, CardContent } from "../../../ui/Card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../ui/Pagination";
import ProductAddDialog from "./ProductAddDialog";
import { usePagination } from "../../../hooks/usePagination";
import ProductList from "./ProductList";

function AdminProducts() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: (products.length + 1).toString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    productForm.handleEdit(product);
    setIsFormOpen(true);
  };

  const productForm = useProductForm(categories, addProduct, updateProduct);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(productSearchTerm.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(productSearchTerm.toLowerCase()) ||
      product.subcategory
        .toLowerCase()
        .includes(productSearchTerm.toLowerCase()),
  );

  // Pagination state
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedProducts,
  } = usePagination(filteredProducts, 5);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-secondary-foreground text-xl font-semibold">
            إدارة المنتجات
          </h2>
        </div>

        {/* Product Add Dialog */}
        <ProductAddDialog
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          categories={categories}
          productForm={productForm}
        />
      </div>

      {/* Product Search Bar */}
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
          <Search className="text-muted-foreground h-6 w-6" />
        </div>
        <Input
          type="text"
          placeholder="البحث في المنتجات..."
          value={productSearchTerm}
          onChange={(e) => setProductSearchTerm(e.target.value)}
          className="border-primary/30 focus:border-primary focus:ring-primary h-16 py-4 pr-14 text-right text-lg"
        />
      </div>

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                {productSearchTerm
                  ? "لا توجد منتجات مطابقة للبحث"
                  : "لا توجد منتجات"}
              </h3>
              <p className="text-muted-foreground">
                {productSearchTerm
                  ? `لم يتم العثور على منتجات تحتوي على "${productSearchTerm}"`
                  : "قم بإضافة أول منتج للمتجر"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ProductList
            products={paginatedProducts}
            handleOpenEditDialog={handleOpenEditDialog}
          />
        )}

        {/* Product Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 10 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminProducts;
