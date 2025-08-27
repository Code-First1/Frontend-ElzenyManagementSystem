import {
  Archive,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import Logo from "./Logo";
import NavbarLink from "./NavbarLink";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

function Navbar() {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.success("تم تسجيل الخروج بنجاح");
  }

  return (
    <header className="border-primary/20 sticky top-0 z-50 border-b-2 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navbar */}
        <div className="hidden items-center justify-between xl:flex">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <div>
              <h1 className="text-secondary-foreground text-xl font-bold">
                محلات الزيني
              </h1>
              <p className="text-muted-foreground text-sm">
                نظام إدارة المخزون والمبيعات
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-3 space-x-reverse">
            <NavbarLink to="/" icon={Home} text="الرئيسية" />
            <NavbarLink to="/products" icon={Package} text="المنتجات" />
            <NavbarLink to="/selling" icon={ShoppingCart} text="البيع" />
            <NavbarLink to="/inventory" icon={Archive} text="المخزون" />
            <NavbarLink to="/shop" icon={Store} text="المحل" />

            {currentUser?.role === "Admin" && (
              <NavbarLink
                to="/adminDashboard"
                icon={Settings}
                text="لوحة الإدارة"
              />
            )}
          </nav>

          <div className="flex items-center gap-5">
            <div className="mr-5 flex items-center gap-2 rounded-full bg-[#f5deb3] px-3 py-1">
              {currentUser?.role === "Admin" ? (
                <Shield className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
              {currentUser?.role === "Admin" ? "مدير" : "بائع"}
            </div>
            <p>{currentUser?.displayName}</p>
            <button
              className="flex items-center gap-2 rounded-md border border-[#E8DAD0] bg-[#FAF8F5] px-4 py-2 hover:bg-[#F2EFE0]"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <p>تسجيل الخروج</p>
            </button>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="flex items-center justify-between xl:hidden">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <div>
              <h1 className="text-secondary-foreground text-lg font-bold">
                محلات الزيني
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 z-50 bg-white shadow-lg xl:hidden">
            <div className="container mx-auto px-4 py-3">
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                <NavbarLink to="/" icon={Home} text="الرئيسية" />
                <NavbarLink to="/products" icon={Package} text="المنتجات" />
                <NavbarLink to="/selling" icon={ShoppingCart} text="البيع" />
                <NavbarLink to="/inventory" icon={Archive} text="المخزون" />
                {currentUser?.role === "Admin" && (
                  <NavbarLink
                    to="/adminDashboard"
                    icon={Settings}
                    text="لوحة الإدارة"
                  />
                )}
              </nav>

              {/* User Info and Logout */}
              <div className="mt-4 flex flex-col space-y-3 border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-[#f5deb3] px-3 py-1">
                    {currentUser?.role === "Admin" ? (
                      <Shield className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    {currentUser?.role === "Admin" ? "مدير" : "بائع"}
                  </div>
                  <p>Username</p>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[#E8DAD0] bg-[#FAF8F5] px-4 py-2 hover:bg-[#F2EFE0]"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <p>تسجيل الخروج</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
