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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("تم تسجيل الخروج بنجاح");
  }

  return (
    <header className="border-primary/20 sticky top-0 z-50 border-b-2 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
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

        {/* Navigations */}
        <nav className="hidden items-center space-x-3 space-x-reverse md:flex">
          <NavbarLink to="/" icon={Home} text="الرئيسية" />
          <NavbarLink to="/products" icon={Package} text="المنتجات" />
          <NavbarLink to="/selling" icon={ShoppingCart} text="البيع" />
          <NavbarLink to="/inventory" icon={Archive} text="المخزون" />

          {role === "admin" && (
            <NavbarLink
              to="/adminDashboard"
              icon={Settings}
              text="لوحة الإدارة"
            />
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
          <button
            className="flex items-center gap-2 rounded-md border border-[#E8DAD0] bg-[#FAF8F5] px-4 py-2 hover:bg-[#F2EFE0]"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <p>تسجيل الخروج</p>
          </button>

          <button
            className="bg-primary hover:bg-secondary-foreground rounded-md px-4 py-2 text-white"
            onClick={() =>
              setRole((role) => (role === "admin" ? "seller" : "admin"))
            }
          >
            <p>Switch Role For Test</p>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
