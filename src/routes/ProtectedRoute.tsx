import { useNavigate } from "react-router-dom";
import { useAppContext, type Role } from "../context/AppContext";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAppContext();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.error("يرجى تسجيل الدخول");
      navigate("/login", { replace: true });
    } else if (
      isAuthenticated &&
      allowedRoles &&
      !allowedRoles.includes(role) &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      toast.error("ليس لديك صلاحية الوصول");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, role, allowedRoles, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
