import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { BrowserUtils } from '@azure/msal-browser';
import { clearStoredPath } from '../utils/redirect/LocalRedirectUrlStorage';
import { clearStoredExternalPath } from '../utils/redirect/ExternalRedirectUrlStorage';

const Logout = () => {
  const { instance } = useMsal();

  useEffect(() => {
    clearStoredPath();
    clearStoredExternalPath();
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
      onRedirectNavigate: () => !BrowserUtils.isInIframe(),
    });
  }, [instance]);

  return <div>Logout</div>;
};

export default Logout;
