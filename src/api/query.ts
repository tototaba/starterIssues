import {
  useQuery,
  useMutation,
  QueryKey,
  QueryFunction,
  MutationFunction,
  UseQueryOptions,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { useAuthedUser } from 'unity-fluent-library';

export type UseFleetMutationResult<
  Variables = unknown,
  ResponseData = void,
  Context = unknown
> = UseMutationResult<
  AxiosResponse<ResponseData>,
  AxiosError,
  Variables,
  Context
>;

/**
 * Wraps react-query's useQuery to check for login state before enabling query
 * and embellishes useQuery's return object with useful fields from Axios response.
 *
 * @param key The key to associate this query with (see useQuery docs)
 * @param queryFn The query function that returns an AxiosResponse
 * @param queryOptions Additional query options to pass (see useQuery docs)
 */
export const useFleetQuery = <Data = unknown>(
  key: QueryKey,
  queryFn: QueryFunction<AxiosResponse<Data>>,
  queryOptions: UseQueryOptions<
    AxiosResponse<Data>,
    AxiosError,
    AxiosResponse<Data>
  > = {}
) => {
  // This is used to check whether a user is logged in
  const user = useAuthedUser();

  const queryResult = useQuery(key, queryFn, {
    ...queryOptions,
    // Don't enable the query if the user is not logged in
    enabled:
      !!user &&
      (queryOptions.enabled !== undefined ? queryOptions.enabled : true),
  });

  // Hoist frequently-used fields from Axios response
  return {
    ...queryResult,
    status: queryResult.data?.status,
    statusText: queryResult.data?.statusText,
    result: queryResult.data?.data,
    pages: queryResult.data?.pages,
  };
};

/**
 * Wraps react-query's useMutation to configure its type params
 *
 * @param mutationFn The mutation function
 * @param options Mutation options to pass
 */
export const useFleetMutation = <
  Variables = unknown,
  ResponseData = void,
  Context = unknown
>(
  mutationFn: MutationFunction<AxiosResponse<ResponseData>, Variables>,
  options?: UseMutationOptions<
    AxiosResponse<ResponseData>,
    AxiosError,
    Variables,
    Context
  >
): UseFleetMutationResult<Variables, ResponseData, Context> =>
  useMutation(mutationFn, options);
