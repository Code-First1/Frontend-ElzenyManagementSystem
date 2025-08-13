import { Edit, Plus, Search, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "../../../ui/Dialog";
import { useState } from "react";
import type {
  Category,
  Product,
} from "../../../types/adminDashboard.interfaces";
import { useProductForm } from "./useProductForm";
import { Input } from "../../common/Input";

import { DEFAULT_CATEGORIES, INITIAL_PRODUCTS } from "../../../constants";
import { Badge } from "../../common/Badge";
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
import ProductDeleteDialog from "./ProductDeleteDialog";
import ProductFormFields from "./ProductFormFields";

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
  const productForm = useProductForm(categories, addProduct, updateProduct);

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    productForm.resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);

    productForm.handleEdit(product);
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingProduct) {
      productForm.handleEdit(editingProduct);
    } else {
      productForm.handleAdd();
    }
  };

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
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic for products
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const productStartIndex = (productCurrentPage - 1) * itemsPerPage;
  const productEndIndex = productStartIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    productStartIndex,
    productEndIndex,
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-secondary-foreground text-xl font-semibold">
            إدارة المنتجات
          </h2>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogOverlay
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
          />
          <DialogTrigger>
            <button
              onClick={() => handleOpenAddDialog()}
              className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
            >
              <Plus className="h-5 w-5" />
              إضافة منتج
            </button>
          </DialogTrigger>
          <DialogContent
            open={isFormOpen}
            className="max-w-2xl"
            onClose={() => setIsFormOpen(false)}
          >
            <DialogHeader>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogHeader>
            <ProductFormFields
              categories={categories}
              formData={productForm.formData}
              setFormData={productForm.setFormData}
              availableSubcategories={categories.flatMap(
                (category) => category.subcategories,
              )}
            />
            <div className="flex justify-end gap-5 pt-4">
              <button
                className="hover:bg-secondary rounded-md px-4 py-2 shadow-sm"
                onClick={() => setIsFormOpen(false)}
              >
                إلغاء
              </button>
              <button
                onClick={() => handleSubmit()}
                className="bg-primary hover:bg-secondary-foreground rounded-md px-3 py-2 text-white"
              >
                {editingProduct ? "حفظ التعديلات" : "إضافة منتج"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
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
          paginatedProducts.map((product) => (
            <Card key={product.id} className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-right">
                    <h3 className="text-secondary-foreground mb-1 text-lg font-bold">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span>
                        الفئة:{" "}
                        <Badge variant="outline">{product.category}</Badge>
                      </span>
                      <span>
                        المخزون:{" "}
                        <strong>
                          {product.stock} {product.unit}
                        </strong>
                      </span>
                      <span>
                        الحد الأدنى: <strong>{product.minStock}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex flex-col items-center">
                      <p className="text-muted-foreground text-sm">
                        السعر لكل {product.unit}
                      </p>
                      <p className="text-primary text-lg font-bold">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditDialog(product)}
                        className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
                      >
                        <Edit className="h-5 w-5" />
                      </button>

                      <ProductDeleteDialog product={product} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Product Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setProductCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      productCurrentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(5, totalProductPages) },
                  (_, i) => {
                    let pageNum;
                    if (totalProductPages <= 5) {
                      pageNum = i + 1;
                    } else if (productCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (productCurrentPage >= totalProductPages - 2) {
                      pageNum = totalProductPages - 4 + i;
                    } else {
                      pageNum = productCurrentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setProductCurrentPage(pageNum)}
                          isActive={productCurrentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                {totalProductPages > 10 &&
                  productCurrentPage < totalProductPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setProductCurrentPage((prev) =>
                        Math.min(prev + 1, totalProductPages),
                      )
                    }
                    className={
                      productCurrentPage === totalProductPages
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
