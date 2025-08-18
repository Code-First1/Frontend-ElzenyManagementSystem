import type { Category } from "../../../types/adminDashboard.interfaces";
import { Card, CardContent } from "../../../ui/Card";
import { Layers } from "lucide-react";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import { Badge } from "../../common/Badge";
import CategoryFormialog from "./CategorFormDialog";

function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <>
      {categories.map((category) => {
        return (
          <Card key={category.id} className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-4">
                  <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                    <Layers />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-secondary-foreground mb-1 font-semibold">
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {category.subCategories.map((subcategory) => (
                        <Badge
                          key={
                            typeof subcategory === "string"
                              ? subcategory
                              : subcategory.id
                          }
                          variant="outline"
                          className="text-xs"
                        >
                          {typeof subcategory === "string"
                            ? subcategory
                            : subcategory.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <CategoryFormialog category={category} />
                  {/* <button
                    onClick={() => {
                      setIsFormOpen(true);
                      setEditingCategory(category);
                    }}
                    className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
                  >
                    <Edit className="h-5 w-5" />
                  </button> */}
                  <CategoryDeleteDialog category={category} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

export default CategoryList;
