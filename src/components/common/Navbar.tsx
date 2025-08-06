import {
  Archive,
  Home,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import Logo from "./Logo";
import NavbarLink from "./NavbarLink";

function Navbar() {
  const { role } = useAppContext();
  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#8b4513]/20 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <div>
            <h1 className="text-xl font-bold text-[#5d4037]">محلات الزيني</h1>
            <p className="text-sm text-[#6d4c41]">
              نظام إدارة المخزون والمبيعات
            </p>
          </div>
        </div>

        {/* Navigations */}
        <nav className="hidden items-center space-x-3 space-x-reverse md:flex">
          <NavbarLink to="/" icon={Home} text="الرئيسية" />
          <NavbarLink to="/products" icon={Package} text="المنتجات" />
          <NavbarLink to="/selling" icon={ShoppingCart} text="البيع" />
          <NavbarLink to="/inventory" icon={Archive} text="المخزون" />

          {role === "admin" && (
            <NavbarLink to="/settings" icon={Settings} text="لوحة الإدارة" />
          )}
        </nav>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 rounded-full bg-[#f5deb3] px-3 py-1">
            {role === "admin" ? (
              <Shield className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
            {role === "admin" ? "مدير" : "بائع"}
          </div>
          <p>Username</p>
          <button className="flex items-center gap-2 rounded-md border border-[#E8DAD0] bg-[#FAF8F5] px-4 py-1 hover:bg-[#F2EFE0]">
            <LogOut className="h-5 w-5" />
            <p>تسجيل الخروج</p>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
