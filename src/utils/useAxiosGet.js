import { useMemo, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useUser } from './auth';
import { getMergedConfig, handleResponseErrors } from './apiHelpers';
import enableAxiosInterceptors from './axiosInterceptors';
enableAxiosInterceptors();
export const useAxiosGetQuery = (url, params, config, isManual) => {
  const user = useUser();
  const mergedConfig = useMemo(() => {
    return getMergedConfig(user?.accessToken, config);
  }, [config, user]);
  const [{ data, loading, error }, refetch] = useAxios(
    { url, params, ...mergedConfig },
    { manual: isManual }
  );
  useEffect(() => {
    handleResponseErrors(error);
  }, [error]);
  return [{ data, loading, error }, refetch];
};
export const useAxiosGet = (
  baseURL,
  url,
  config = {},
  isManual,
  useCache = true
) => {
  const user = useUser();
  if (!user?.accessToken) {
    isManual = true;
  }
  const mergedConfig = useMemo(() => {
    return getMergedConfig(user?.accessToken, config);
  }, [config, user]);
  const fullURL = { url: `${baseURL}/${url}` };
  const [{ data, loading, error }, refetch] = useAxios(
    { ...fullURL, ...mergedConfig },
    { manual: isManual, useCache: useCache }
  );
  useEffect(() => {
    handleResponseErrors(error);
  }, [error]);
  return [{ data, loading, error }, refetch];
};