function AdminProducts() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#5d4037]">إدارة المنتجات</h2>
      </div>

      <div className="grid gap-4">
        {/* {products.map((product) => (
              <Card key={product.id} className="border-[#8b4513]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right">
                      <h3 className="mb-1 font-semibold text-[#5d4037]">
                        {product.name}
                      </h3>
                      <p className="mb-2 text-sm text-[#6d4c41]">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm">
                        <span>
                          الفئة:{" "}
                          <Badge variant="outline">{product.category}</Badge>
                        </span>
                        <span>
                          المخزون:{" "}
                          <strong>
                            {product.stock} {product.unit}s
                          </strong>
                        </span>
                        <span>
                          الحد الأدنى: <strong>{product.minStock}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-left">
                        <p className="text-sm text-[#6d4c41]">
                          السعر لكل {product.unit}
                        </p>
                        <p className="text-lg font-bold text-[#8b4513]">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => productForm.handleEdit(product)}
                          className="border-[#8b4513]/30"
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
                                <span>حذف المنتج</span>
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-right">
                                هل أنت متأكد من حذف "{product.name}"؟ لا يمكن
                                التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row-reverse">
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteProduct(product.id, product.name)
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
                  </div>
                </CardContent>
              </Card>
            ))} */}
      </div>
    </>
  );
}

export default AdminProducts;
