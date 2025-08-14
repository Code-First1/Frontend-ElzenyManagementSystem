import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import type { Role } from "../types/auth.interfaces";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser, isLoading } = useAppContext();
  const navigate = useNavigate();

  const userRole = currentUser?.role.toLowerCase() as Role;
  const isAuthorized = allowedRoles ? allowedRoles.includes(userRole) : true;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول");
      navigate("/login", { replace: true });
    } else if (!isAuthorized) {
      toast.error("ليس لديك صلاحية الوصول");
      navigate("/", { replace: true });
    }
  }, [isLoading, isAuthenticated, isAuthorized, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
