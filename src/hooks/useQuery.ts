import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import type {
  DefaultError,
  UndefinedInitialDataOptions,
  QueryKey,
  UseQueryResult,
} from '@tanstack/react-query';

function useQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, QueryKey>,
): UseQueryResult<TData, TError> {
  return useTanstackQuery<TQueryFnData, TError, TData>({ ...options });
}

export default useQuery;
