function AdminCategoires() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-secondary-foreground text-xl font-semibold">
          إدارة الفئات
        </h2>
        {/* <CategoryDialogs
              isAddDialogOpen={categoryForm.isAddDialogOpen}
              setIsAddDialogOpen={categoryForm.setIsAddDialogOpen}
              isEditDialogOpen={categoryForm.isEditDialogOpen}
              setIsEditDialogOpen={categoryForm.setIsEditDialogOpen}
              formData={categoryForm.formData}
              setFormData={categoryForm.setFormData}
              newSubcategory={categoryForm.newSubcategory}
              setNewSubcategory={categoryForm.setNewSubcategory}
              addSubcategory={categoryForm.addSubcategory}
              removeSubcategory={categoryForm.removeSubcategory}
              handleAdd={categoryForm.handleAdd}
              handleUpdate={categoryForm.handleUpdate}
              resetForm={categoryForm.resetForm}
            /> */}
      </div>
      <div className="grid gap-4">
        {/* {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.icon);
              return (
                <Card key={category.id} className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center space-x-4 space-x-reverse">
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
                          <h3 className="mb-1 font-semibold text-secondary-foreground">
                            {category.name}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {category.subcategories.map((subcategory) => (
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

                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => categoryForm.handleEdit(category)}
                          className="border-primary/30"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center space-x-2 space-x-reverse">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <span>حذف الفئة</span>
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-right">
                                هل أنت متأكد من حذف "{category.name}"؟ لا يمكن
                                التراجع عن هذا الإجراء وسيؤثر على جميع المنتجات
                                في هذه الفئة.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row-reverse">
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCategory(
                                    category.id,
                                    category.name,
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })} */}
      </div>
    </>
  );
}

export default AdminCategoires;
