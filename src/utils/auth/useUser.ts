import { useContext } from 'react';
import { UserContext } from './internal';
import { User } from './user';

/**
 * Get the current User object (or null if not logged in)
 *
 * Does not redirect to login
 * @see {@link useAuthedUser}
 */
export function useUser(): User | null {
  return useContext(UserContext);
}
