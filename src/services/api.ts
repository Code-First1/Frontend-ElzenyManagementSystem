import { BASE_URL } from "../constants";

export interface APIError {
  statusCode: number;
  errorMessage: string;
  errors: string[];
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData: APIError = await res.json();
    throw errorData;
  }

  return res.json();
}
