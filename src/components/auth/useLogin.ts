import { useMutation } from "@tanstack/react-query";
import type { LoginPayload, LoginResponse } from "../../types/auth.interfaces";
import { login } from "../../services/apiAuth";
import { toast } from "react-hot-toast";
import type { APIError } from "../../services/api";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();
  return useMutation<LoginResponse, APIError, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.errorMessage);
    },
  });
};
