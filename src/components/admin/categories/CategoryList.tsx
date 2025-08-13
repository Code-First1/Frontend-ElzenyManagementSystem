import type { Category } from "../../../types/adminDashboard.interfaces";
import { Card, CardContent } from "../../../ui/Card";
import { Edit, Layers, Droplets, Package, Box } from "lucide-react";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import { Badge } from "../../common/Badge";

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Layers":
      return Layers;
    case "Droplets":
      return Droplets;
    case "Package":
      return Package;
    case "Box":
      return Box;
    default:
      return Package;
  }
};

function CategoryList({
  categories,
  handleOpenEditDialog,
}: {
  categories: Category[];
  handleOpenEditDialog: (category: Category) => void;
}) {
  return (
    <>
      {categories.map((category) => {
        const IconComponent = getCategoryIcon(category.icon);
        return (
          <Card key={category.id} className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent
                      className="h-6 w-6"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-secondary-foreground mb-1 font-semibold">
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.map((subcategory: string) => (
                        <Badge
                          key={subcategory}
                          variant="outline"
                          className="text-xs"
                        >
                          {subcategory}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEditDialog(category)}
                    className="bg-background border-primary/30 rounded-md border px-3 py-2 shadow-sm"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
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
