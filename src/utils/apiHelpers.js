import signInAuthProvider, { apiAccessScope } from './auth/signInAuthProvider';
import { getStoredAccessToken } from './storage/UnitySessionStorage';
import { localLogout } from './auth/authActions';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { getStoredTenant } from './storage/UnitySessionStorage';
export const getMergedConfig = (accessToken, config) => {
  if (config?.headers?.Authorization) {
    if (!config?.headers?.currentTenantId) {
      config.headers['currentTenantId'] = getStoredTenant();
    }
    return config;
  } else {
    if (config?.headers) {
      const headers = config.headers;
      const combinedHeaders = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
        currentTenantId: getStoredTenant(),
      };
      config.headers = combinedHeaders;
      return config;
    } else {
      return {
        ...config,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          currentTenantId: getStoredTenant(),
        },
      };
    }
  }
};
export const handleResponseErrors = async error => {
  if (error?.response?.status === 401) {
    if (process.env.REACT_APP_LOCAL_AUTH === 'true') {
      localLogout();
    } else {
      const account = signInAuthProvider.getActiveAccount();
      if (!account) {
        return;
      }
      await signInAuthProvider
        .acquireTokenSilent({
          scopes: [apiAccessScope],
          account: account,
        })
        .catch(async error => {
          if (error instanceof InteractionRequiredAuthError) {
            await signInAuthProvider.acquireTokenPopup({
              scopes: [apiAccessScope],
              account: account,
              prompt: 'login',
            });
          }
        });
    }
  }
};
export const getAccessToken = async () => {
  if (process.env.REACT_APP_LOCAL_AUTH === 'true') {
    return getStoredAccessToken();
  } else {
    const account = signInAuthProvider.getActiveAccount();
    if (!account) {
      return '';
    }
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
    return token?.accessToken;
  }
};