import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { apiAccessScope } from './signInAuthProvider';

export const useAccessToken = () => {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState(null);

  if (accounts.length > 0) {
    const request = {
      scopes: [apiAccessScope],
      account: accounts[0],
    };
    instance
      .acquireTokenSilent(request)
      .then(response => {
        setAccessToken(response.accessToken);
      })
      .catch(error => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.logoutRedirect();
        }
      });
  }

  return accessToken;
};
