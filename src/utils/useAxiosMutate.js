import { useMemo, useEffect } from 'react';
import useAxios from 'axios-hooks';
import Axios from 'axios';
import { useUser } from './auth';
import { getMergedConfig, handleResponseErrors } from './apiHelpers';
import signInAuthProvider, { apiAccessScope } from './auth/signInAuthProvider';
import enableAxiosInterceptors from './axiosInterceptors';
import { getStoredAccessToken } from './storage/UnitySessionStorage';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
enableAxiosInterceptors();
export const useAxiosMutate = (baseURL, url, config) => {
  const user = useUser();
  const mergedConfig = useMemo(() => {
    return getMergedConfig(user.accessToken, config);
  }, [config, user]);
  const fullURL = { url: `${baseURL}/${url}` };
  const [{ data, loading, error }, execute] = useAxios(
    { ...fullURL, ...mergedConfig },
    { manual: true }
  );
  useEffect(() => {
    handleResponseErrors(error);
  }, [error]);
  return [{ data, loading, error }, execute];
};
// TODO: come up with a hook for apiMutate that will check accessToken before making axios call
export const apiMutate = async (baseURL, url, config, data) => {
  let accessToken = '';
  if (process.env.REACT_APP_LOCAL_AUTH === 'true') {
    accessToken = getStoredAccessToken();
  } else {
    const account = signInAuthProvider.getActiveAccount();
    let token = await signInAuthProvider
      .acquireTokenSilent({ scopes: [apiAccessScope], account: account })
      .catch(async error => {
        if (error instanceof InteractionRequiredAuthError) {
          token = await signInAuthProvider.acquireTokenPopup({
            scopes: [apiAccessScope],
            account: account,
            prompt: 'login',
          });
        }
      });
    accessToken = token?.accessToken;
  }
  const mergedConfig = getMergedConfig(accessToken, config);
  const fullURL = { url: `${baseURL}/${url}` };
  return Axios({ ...fullURL, ...mergedConfig, ...data });
};