import { useContext, useCallback } from 'react';
import { UserDispatchContext } from './internal';

export function useUserActions() {
  const dispatch = useContext(UserDispatchContext);
  const setUser = useCallback(
    user => {
      dispatch({ type: 'SET_USER', user });
    },
    [dispatch]
  );

  return { setUser };
}

export function useLocalUserActions() {
  const dispatch = useContext(UserDispatchContext);
  const setUser = useCallback(
    user => {
      dispatch({ type: 'SET_USER', user });
    },
    [dispatch]
  );

  const setAccessToken = useCallback(
    accessToken => {
      dispatch({ type: 'SET_ACCESS_TOKEN', accessToken });
    },
    [dispatch]
  );

  return { setUser, setAccessToken };
}
