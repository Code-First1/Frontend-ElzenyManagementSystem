import type { LoginPayload, LoginResponse } from "../types/auth.interfaces";
import { api } from "./api";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return api<LoginResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
