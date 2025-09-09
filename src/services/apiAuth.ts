import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "../types/auth.interfaces";
import { api } from "./api";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return api<LoginResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const register = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  return api<RegisterResponse>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return api<User[]>("/Auth/GetAllUsers", {
    method: "GET",
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return api<User>("/Auth/GetProfile", {
    method: "GET",
  });
};

export const deleteUser = async (userName: string): Promise<void> => {
  return api<void>(`/Auth/${userName}`, {
    method: "DELETE",
  });
};
