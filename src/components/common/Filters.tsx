// src/components/filters/ProductFilters.tsx

import { Filter, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input } from "../common/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../common/Select";
import type {
  Category,
  SubCategory,
} from "../../types/adminDashboard.interfaces";

type FiltersProps = {
  filters: {
    searchTerm: string;
    selectedCategory: string;
    selectedSubcategory: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    stockFilter?: "all" | "good" | "critical" | "out-of-stock";
  };
  onFilterChange: (filterName: string, value: string) => void;
  onReset: () => void;
  categories: Category[] | undefined;
  availableSubcategories: SubCategory[];
  forSection: "products" | "inventory";
};

function Filters({
  filters,
  onFilterChange,
  onReset,
  categories,
  availableSubcategories,
  forSection,
}: FiltersProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-secondary-foreground flex items-center">
          <Filter className="ml-2 h-5 w-5" />
          تصفية المنتجات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-[#6d4c41]" />
            <Input
              placeholder="البحث في المنتجات..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              className="border-primary/30 pr-10 text-right"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filters.selectedCategory}
            onValueChange={(value) => onFilterChange("selectedCategory", value)}
          >
            <SelectTrigger>
              {categories?.find(
                (c) => c.id.toString() === filters.selectedCategory,
              )?.name || "جميع الفئات"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subcategory Filter */}
          <Select
            value={filters.selectedSubcategory}
            onValueChange={(value) =>
              onFilterChange("selectedSubcategory", value)
            }
          >
            <SelectTrigger
              className="border-primary/30"
              disabled={
                filters.selectedCategory === "all" ||
                availableSubcategories.length === 0
              }
            >
              {availableSubcategories?.find(
                (s) => s.id.toString() === filters.selectedSubcategory,
              )?.name || "جميع الفئات الفرعية"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات الفرعية</SelectItem>
              {availableSubcategories.map((subcategory) => (
                <SelectItem
                  key={subcategory.id}
                  value={subcategory.id.toString()}
                >
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select
            value={filters.stockFilter || "all"}
            onValueChange={(value) => onFilterChange("stockFilter", value)}
          >
            <SelectTrigger className="border-primary/30">
              <SelectValue>
                {filters.stockFilter === "good"
                  ? "متوفر"
                  : filters.stockFilter === "critical"
                    ? "منخفض المخزون"
                    : filters.stockFilter === "out-of-stock"
                      ? "نفد المخزون"
                      : "حالة المخزون"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المنتجات</SelectItem>
              <SelectItem value="good">متوفر</SelectItem>
              <SelectItem value="critical">منخفض المخزون</SelectItem>
              <SelectItem value="out-of-stock">نفد المخزون</SelectItem>
            </SelectContent>
          </Select>

          {forSection === "inventory" && (
            <>
              {/* Sort By */}
              <Select
                value={filters.sortBy}
                onValueChange={(value: string) =>
                  onFilterChange("sortBy", value)
                }
              >
                <SelectTrigger className="border-primary/30">
                  {filters.sortBy === "name" ? "الاسم" : "السعر"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="price">السعر</SelectItem>
                  {/* TODO: need to handle from backend */}
                  {/* <SelectItem value="stock">المخزون</SelectItem> */}
                  {/* <SelectItem value="category">الفئة</SelectItem> */}
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <div className="border-primary/30 flex rounded-md border p-1 shadow-sm">
                <button
                  onClick={() => onFilterChange("sortOrder", "asc")}
                  className={`flex flex-1 items-center justify-center rounded-sm px-2 py-1.5 text-sm transition-colors ${
                    filters.sortOrder === "asc"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-primary/5"
                  }`}
                >
                  <TrendingUp className="ml-1 h-4 w-4" />
                  تصاعدي
                </button>
                <button
                  onClick={() => onFilterChange("sortOrder", "desc")}
                  className={`flex flex-1 items-center justify-center rounded-sm px-2 py-1.5 text-sm transition-colors ${
                    filters.sortOrder === "desc"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-primary/5"
                  }`}
                >
                  <TrendingDown className="ml-1 h-4 w-4" />
                  تنازلي
                </button>
              </div>
            </>
          )}

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="bg-background border-primary/30 text-secondary-foreground rounded-md border py-1 shadow-sm hover:bg-[#f5f5dc]"
          >
            مسح التصفية
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Filters;
