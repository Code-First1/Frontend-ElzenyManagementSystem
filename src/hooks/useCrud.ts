import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { CrudApi } from "../services/apiCrud";
import type { APIError } from "../services/api";
import toast from "react-hot-toast";

export const useCrud = <T, CreateDto, UpdateDto = CreateDto>(
  api: CrudApi<T, CreateDto, UpdateDto>,
  queryKey: QueryKey,
) => {
  const queryClient = useQueryClient();

  // Get all items
  const {
    data: items,
    isLoading,
    error,
  } = useQuery<T[]>({
    queryKey,
    queryFn: () => api.getAll(),
  });

  // Get single item
  const { data: item, isLoading: isLoadingSingle } = useQuery<T>({
    queryKey,
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey as [string, string];
      return api.getOne(id);
    },
    enabled: Array.isArray(queryKey) && queryKey.length > 1 && !!queryKey[1],
  });

  // Create mutation
  const createMutation = useMutation<T, APIError, CreateDto>({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(error.errorMessage),
  });

  // Update mutation
  const updateMutation = useMutation<
    T,
    APIError,
    { id: string; payload: UpdateDto }
  >({
    mutationFn: ({ id, payload }) => api.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(error.errorMessage),
  });

  // Delete mutation
  const deleteMutation = useMutation<void, APIError, { id: string }>({
    mutationFn: ({ id }) => api.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(error.errorMessage),
  });

  return {
    items,
    item,
    isLoading,
    isLoadingSingle,
    error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
