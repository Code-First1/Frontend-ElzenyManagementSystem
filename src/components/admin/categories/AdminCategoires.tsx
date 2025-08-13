import { useState } from "react";
import CategoryAddDialog from "./CategoryAddDialog";
import type { Category } from "../../../types/adminDashboard.interfaces";
import useCategoryForm from "./useCategoryForm";
import { DEFAULT_CATEGORIES } from "../../../constants";
import { Package, Search } from "lucide-react";
import { Input } from "../../common/Input";
import { Card, CardContent } from "../../../ui/Card";
import CategoryList from "./CategoryList";
import { usePagination } from "../../../hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../ui/Pagination";

function AdminCategoires() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: (categories.length + 1).toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category);
    categoryForm.handleEdit(category);
    setIsFormOpen(true);
  };

  const categoryForm = useCategoryForm(addCategory, updateCategory);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.subcategories.some((sub) =>
        sub.toLowerCase().includes(categorySearchTerm.toLowerCase()),
      ),
  );

  // Pagination state
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedCategoires,
  } = usePagination(filteredCategories, 3);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-secondary-foreground text-xl font-semibold">
            إدارة الفئات
          </h2>
        </div>

        {/* Category Add Dialog */}
        <CategoryAddDialog
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          categoryForm={categoryForm}
        />
      </div>

      {/* Category Search Bar */}
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
          <Search className="h-6 w-6 text-[#6d4c41]" />
        </div>
        <Input
          type="text"
          placeholder="البحث في الفئات..."
          value={categorySearchTerm}
          onChange={(e) => setCategorySearchTerm(e.target.value)}
          className="h-16 border-[#8b4513]/30 py-4 pr-14 text-right text-lg focus:border-[#8b4513] focus:ring-[#8b4513]"
          dir="rtl"
        />
      </div>

      {/* Category List */}
      <div className="grid gap-4">
        {filteredCategories.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <Package className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                {categorySearchTerm
                  ? "لا توجد منتجات مطابقة للبحث"
                  : "لا توجد منتجات"}
              </h3>
              <p className="text-muted-foreground">
                {categorySearchTerm
                  ? `لم يتم العثور على منتجات تحتوي على "${categorySearchTerm}"`
                  : "قم بإضافة أول منتج للمتجر"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <CategoryList
            categories={paginatedCategoires}
            handleOpenEditDialog={handleOpenEditDialog}
          />
        )}

        {/* Category Pagination */}
        {filteredCategories.length > itemsPerPage && (
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

export default AdminCategoires;
