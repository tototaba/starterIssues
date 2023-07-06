import signinAuthProvider, { tokenRequest } from './signInAuthProvider';
import { BrowserUtils } from '@azure/msal-browser';
import { clearStoredAccessToken } from '../storage/UnitySessionStorage';

export type LoginFunction = () => void;
export type LogoutFunction = () => void;

/**
 * Hook providing auth "actions" such as login/logout
 */
export function useLoginAction(): LoginFunction {
  return () => signinAuthProvider.loginRedirect(tokenRequest);
}

export function useLogoutAction(): LogoutFunction {
  return () => {
    signinAuthProvider.logoutRedirect({
      account: signinAuthProvider.getActiveAccount(),
      onRedirectNavigate: () => !BrowserUtils.isInIframe(),
    });
  };
}

export const localLogout = () => {
  clearStoredAccessToken();
  window.location.replace(`${window.location.origin}/login`);
};
