export interface LoginPayload {
  userName: string;
  password: string;
}

export interface LoginResponse {
  displayName: string;
  token: string;
}
