import { useLocation } from 'react-router-dom';
import { useUser } from './useUser';
import { User } from './user';
import { useLoginAction } from './authActions';
import { useIsAuthenticated } from '@azure/msal-react';

/**
 * Hook that provides a returnTo string for the current location
 */
export function useCurrentPageReturnTo() {
  const { pathname, search, hash } = useLocation();

  return { pathname, search, hash };
}

/**
 * Hook used on routes that require a logged in user to ensure that the user is logged in
 * @see {@link useUser}
 */
export function useAuthedUser(): User | null {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const login = useLoginAction();

  if (isAuthenticated) {
    return user;
  } else {
    login();
    return null;
  }
}
