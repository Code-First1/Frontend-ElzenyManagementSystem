import toast from "react-hot-toast";
import { api } from "./api";

type QueryParams = Record<string, string | number | boolean | undefined>;

export interface CrudApi<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  getAll<Response = T[]>(params?: QueryParams): Promise<Response>;
  getOne<Response = T>(id: string, params?: QueryParams): Promise<Response>;
  create<Response = T>(
    payload: CreateDto,
    params?: QueryParams,
  ): Promise<Response>;
  update<Response = T>(
    id: string,
    payload: UpdateDto,
    params?: QueryParams,
  ): Promise<Response>;
  delete(id: string, params?: QueryParams): Promise<void>;
}

export const createCrudApi = <
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
>(
  endpoint: string,
): CrudApi<T, CreateDto, UpdateDto> => ({
  getAll: <Response = T[]>(params?: QueryParams) => {
    try {
      const queryString = params ? buildQueryString(params) : "";
      return api<Response>(`/${endpoint}${queryString}`, { method: "GET" });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errorMessage" in error
      ) {
        toast.error((error as { errorMessage: string }).errorMessage);
      }
      throw error;
    }
  },

  getOne: <Response = T>(id: string, params?: QueryParams) => {
    try {
      const queryString = params ? buildQueryString(params) : "";
      return api<Response>(`/${endpoint}/${id}${queryString}`, {
        method: "GET",
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errorMessage" in error
      ) {
        toast.error((error as { errorMessage: string }).errorMessage);
      }
      throw error;
    }
  },

  create: async <Response = T>(payload: CreateDto, params?: QueryParams) => {
    const queryString = params ? buildQueryString(params) : "";
    try {
      return await api<Response>(`/${endpoint}${queryString}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errorMessage" in error
      ) {
        toast.error((error as { errorMessage: string }).errorMessage);
      }
      throw error;
    }
  },

  update: async <Response = T>(
    id: string,
    payload: UpdateDto,
    params?: QueryParams,
  ) => {
    try {
      const queryString = params ? buildQueryString(params) : "";
      return await api<Response>(`/${endpoint}/${id}${queryString}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errorMessage" in error
      ) {
        toast.error((error as { errorMessage: string }).errorMessage);
      }
      throw error;
    }
  },

  delete: async (id: string, params?: QueryParams) => {
    try {
      const queryString = params ? buildQueryString(params) : "";
      await api<void>(`/${endpoint}/${id}${queryString}`, {
        method: "DELETE",
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errorMessage" in error
      ) {
        toast.error((error as { errorMessage: string }).errorMessage);
      }
      throw error;
    }
  },
});

// Helper function to convert params object to query string
function buildQueryString(params: QueryParams): string {
  const validParams = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

  return validParams.length > 0 ? `?${validParams.join("&")}` : "";
}
