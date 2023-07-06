import { useIsAuthenticated } from '@azure/msal-react';
import { getStoredAccessToken } from '../storage/UnitySessionStorage';

export const useIsUnityAuthenticated = () => {
  const isMsalAuthenticated = useIsAuthenticated();
  if (process.env.REACT_APP_LOCAL_AUTH === 'false') {
    return isMsalAuthenticated;
  } else {
    if (!!getStoredAccessToken()) {
      return true;
    } else {
      return false;
    }
  }
};
