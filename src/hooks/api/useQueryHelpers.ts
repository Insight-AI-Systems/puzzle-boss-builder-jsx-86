
import { 
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  QueryKey
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@/integrations/supabase/api-client';

/**
 * Custom hook for standardized error handling in queries
 */
export function useApiQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: any
): UseQueryResult<TData, ApiError> {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...options
  });
}

/**
 * Custom hook for standardized error handling in mutations
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: any
): UseMutationResult<TData, ApiError, TVariables> {
  return useMutation({
    mutationFn: async (variables) => {
      const response = await mutationFn(variables);
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...options
  });
}
