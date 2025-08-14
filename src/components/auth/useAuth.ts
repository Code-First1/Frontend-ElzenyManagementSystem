import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "../../types/auth.interfaces";
import {
  getAllUsers,
  getCurrentUser,
  login,
  register,
} from "../../services/apiAuth";
import { toast } from "react-hot-toast";
import type { APIError } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  // const { setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  return useMutation<LoginResponse, APIError, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      localStorage.setItem("token", data.token);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.errorMessage);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<RegisterResponse, APIError, RegisterPayload>({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success(
        data.role === "Admin"
          ? `تم إنشاء حساب مدير جديد: ${data.displayName}`
          : `تم إنشاء حساب بائع جديد: ${data.displayName}`,
      );
      // Refetch users after successful registration
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.errorMessage);
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((msg) => toast.error(msg));
      }
    },
  });
};

export const useGetAllUsersQuery = () => {
  return useQuery<User[], APIError>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};

export const useGetCurrentUserQuery = () => {
  return useQuery<User, APIError>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
};
