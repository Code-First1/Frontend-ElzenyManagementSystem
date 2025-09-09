export type Role = "admin" | "seller";

export interface User {
  userName: string;
  displayName: string;
  role: "Admin" | "Seller";
}
export interface LoginPayload {
  userName: string;
  password: string;
}

export interface LoginResponse {
  displayName: string;
  token: string;
  role: "Admin" | "Seller";
}

export interface RegisterPayload {
  userName: string;
  displayName: string;
  password: string;
  role: Role;
}

export interface RegisterResponse {
  displayName: string;
  role: "Admin" | "Seller";
  token: string;
}
