import 'react';
import { useLogoutAction } from '../auth';
import { clearStoredPath } from '../redirect/LocalRedirectUrlStorage';
import { clearStoredExternalPath } from '../redirect/ExternalRedirectUrlStorage';
import { clearStoredTenant } from 'unity-fluent-library';
import { localLogout } from '../auth/authActions';

export const useSingleLogout = () => {
  const logout = useLogoutAction();

  if (process.env.REACT_APP_LOCAL_AUTH === 'true') {
    return () => {
      localLogout();
    };
  } else {
    const channel = new BroadcastChannel('starter_kit_channel');
    channel.onmessage = ev => {
      clearStoredPath();
      clearStoredExternalPath();
      clearStoredTenant();
      logout();
    };

    return () => {
      channel.postMessage('Logout broadcasted');
    };
  }
};
