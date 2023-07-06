import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Redirect route for MSAL
 */
export const MsalRedirect = props => {
  const history = useHistory();
  useEffect(() => {
    // @note We cannot actually implement returnTo because react-aad-msal does not give access to MSAL.js' authResponse.accountState
    //       Making this functional will have to wait for the issue to be fixed: https://github.com/syncweek-react-aad/react-aad/issues/249
    const accountState = '{"pathname": "/"}';
    let returnToData = accountState ? JSON.parse(accountState) : {};
    let returnTo = { pathname: '/' };

    let { pathname, search, hash } = returnToData;

    // Only allow location parameters to be strings
    if (pathname && typeof pathname !== 'string') pathname = undefined;
    if (search && typeof search !== 'string') search = undefined;
    if (hash && typeof hash !== 'string') hash = undefined;

    if (pathname) {
      // Apply returnTo data from the state
      // For security reasons we don't allow the state parameter to provide a `state` portion for the history location
      returnTo = { pathname, search, hash };
    }

    history.replace(returnTo);
  }, [history]);

  return null;
};
