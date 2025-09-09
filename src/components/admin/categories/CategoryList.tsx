import type { Category } from "../../../types/adminDashboard.interfaces";
import { Card, CardContent } from "../../../ui/Card";
import { Layers } from "lucide-react";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import { Badge } from "../../common/Badge";
import CategoryFormDialog from "./CategorFormDialog";

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
                    {category.subCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        الفئات الفرعية:
                        {category?.subCategories?.map((subcategory) => (
                          <Badge
                            key={
                              typeof subcategory === "string"
                                ? subcategory
                                : subcategory.id
                            }
                            variant="outline"
                            className="text-sm"
                          >
                            {typeof subcategory === "string"
                              ? subcategory
                              : subcategory.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <CategoryFormDialog category={category} />
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
