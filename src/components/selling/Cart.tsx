import { Minus, Plus, Receipt, ShoppingCart, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input } from "../common/Input";
import { unitOptions } from "../../types/adminDashboard.interfaces";
import { Separator } from "../common/Separtor";
import type { CartItem } from "../../pages/Selling";
import { Badge } from "../common/Badge";
import type { ShopProduct } from "../../types/shopProduct.interfaces";
import toast from "react-hot-toast";

type CartProps = {
  shopProducts: ShopProduct[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCustomQuantity: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
};

function Cart({ cart, shopProducts, setCart, setCustomQuantity }: CartProps) {
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.shopProduct.product.pricePerUnit * item.quantity,
    0,
  );
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    const product = shopProducts.find((p) => p.id.toString() === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.quantity) {
      toast.error(
        `الكمية المطلوبة تتجاوز المخزون المتاح (${product.quantity} ${
          unitOptions.find((unit) => unit.value === product.product.unit)?.label
        })`,
      );
      return;
    }

    setCart(
      cart.map((item) =>
        item.shopProduct.id.toString() === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(
      cart.filter((item) => item.shopProduct.id.toString() !== productId),
    );
    toast.success("تم إزالة المنتج من السلة");
  };

  const clearCart = () => {
    setCart([]);
    setCustomQuantity({});
    toast.success("تم مسح السلة");
  };

  const processSale = () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    // Check stock availability one more time
    for (const item of cart) {
      if (item.quantity > item.shopProduct.quantity) {
        toast.error(
          `الكمية المطلوبة من ${item.shopProduct.product.name} تتجاوز المخزون المتاح`,
        );
        return;
      }
    }

    toast.success(
      `تم بيع ${cartItemsCount} منتج بقيمة $${cartTotal.toFixed(2)}`,
    );
    setCart([]);
    setCustomQuantity({});
  };

  return (
    <div className="mt-22 space-y-6">
      <Card className="sticky top-30 border-[#8b4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#5d4037]">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>سلة المشتريات</span>
            </div>
            {cart.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-[#f5e6d3] text-[#5d4037]"
              >
                {cart.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-[#8b4513]/50" />
              <p className="text-[#6d4c41]">السلة فارغة</p>
              <p className="mt-1 text-sm text-[#6d4c41]">
                اختر المنتجات لإضافتها
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-60 space-y-3 overflow-y-auto">
                {cart.map((cartProduct) => (
                  <div
                    key={cartProduct.shopProduct.id}
                    className="rounded-lg bg-[#faf8f5] p-3"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="text-right text-sm font-medium text-[#5d4037]">
                        {cartProduct.shopProduct.product.name}
                      </h4>
                      <button
                        onClick={() =>
                          removeFromCart(cartProduct.shopProduct.id.toString())
                        }
                        className="h-auto p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              cartProduct.shopProduct.id.toString(),
                              cartProduct.quantity - 1,
                            )
                          }
                          className="hover:bg-secondary h-5 w-5 rounded-sm border border-[#8b4513]/30"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <Input
                          type="number"
                          min="1"
                          max={cartProduct.shopProduct.quantity}
                          value={cartProduct.quantity}
                          onChange={(e) =>
                            updateCartQuantity(
                              cartProduct.shopProduct.id.toString(),
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-16 border border-[#8b4513]/30 text-center text-sm"
                        />

                        <button
                          onClick={() => {
                            updateCartQuantity(
                              cartProduct.shopProduct.id.toString(),
                              cartProduct.quantity + 1,
                            );
                          }}
                          className="hover:bg-secondary h-5 w-5 rounded-sm border border-[#8b4513]/30"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="text-sm text-[#6d4c41]">
                        {
                          unitOptions.find(
                            (unit) =>
                              unit.value ===
                              cartProduct.shopProduct.product.unit,
                          )?.label
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6d4c41]">
                        $
                        {cartProduct.shopProduct.product.pricePerUnit.toFixed(
                          2,
                        )}{" "}
                        × {cartProduct.quantity}
                      </span>
                      <span className="font-semibold text-[#8b4513]">
                        $
                        {(
                          cartProduct.shopProduct.product.pricePerUnit *
                          cartProduct.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#6d4c41]">عدد القطع:</span>
                  <span className="font-medium text-[#5d4037]">
                    {cartItemsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-[#5d4037]">
                    الإجمالي:
                  </span>
                  <span className="text-xl font-bold text-[#8b4513]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={processSale}
                  className="flex w-full items-center justify-center gap-1 rounded-md bg-green-600 py-2 text-white hover:bg-green-700"
                >
                  <Receipt className="mt-1 h-4 w-4" />
                  <span>إتمام البيع</span>
                </button>

                <button
                  onClick={clearCart}
                  className="flex w-full items-center justify-center gap-1 rounded-md border border-red-300 py-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mt-1 h-4 w-4" />
                  <span>مسح السلة</span>
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Cart;
