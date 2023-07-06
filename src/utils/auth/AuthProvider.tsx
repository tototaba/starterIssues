import React, {
  ReactNode,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from 'react';
import signInAuthProvider, {
  apiAccessScope,
  tokenRequest,
  loginRequest,
} from './signInAuthProvider';
import { UserContext, UserDispatchContext } from './internal';
import { User, createUser } from './user';
import LoadingIndicator from '../LoadingIndicator';
import { whitelistedPaths } from './whitelistedPaths';
import jwtDecode from 'jwt-decode';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import {
  InteractionRequiredAuthError,
  InteractionType,
  EventType,
} from '@azure/msal-browser';
import {
  MsalProvider,
  MsalAuthenticationTemplate,
  useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';
import { useAccessToken } from './useAccessToken';
import { useHistory } from 'react-router-dom';
import CustomNavigationClient from '../../CustomNavigationClient';
import { getStoredTenant, storeTenant } from 'unity-fluent-library';

export interface UserProviderProps {
  children: ReactNode;
  sessionExpiredModalOpen: boolean;
  setSessionExpiredModalOpen: Function;
}

const emptyUser: User = {
  name: '',
  firstName: '',
  familyName: '',
  jobTitle: '',
  email: '',
  mobile: '',
  phone: '',
  id: '',
  location: '',
  aadId: '',
  accessToken: '',
  defaultTenantId: '',
  currentTenantId: '',
  tenantIds: [],
  roleIds: [],
  products: [],
  permissions: [],
  can: {},
  statusCode: undefined,
};

const UserProvider = ({
  children,
  setSessionExpiredModalOpen,
}: UserProviderProps) => {
  const { accounts } = useMsal();
  signInAuthProvider.setActiveAccount(accounts[0]);
  const idTokenClaims: any = accounts[0]?.idTokenClaims;
  const sub: any = idTokenClaims?.sub;
  const accessToken: any = useAccessToken();

  const isForgotPassword = idTokenClaims?.isForgotPassword;
  if (isForgotPassword) {
    signInAuthProvider.logoutRedirect();
  }
  const [adUserInfo, setAdUserInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [didLoad, setDidLoad] = useState(false);

  const user = useMemo<User | null>(() => {
    if (adUserInfo && userInfo) {
      return createUser({
        ...userInfo,
        ...adUserInfo,
        accessToken: accessToken,
      });
    }

    return null;
  }, [adUserInfo, userInfo, accessToken]);

  const [userState, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case 'SET_USER':
          state = {
            ...state,
            user: action.user,
          };
          break;
        default:
          throw new Error(`Unknown action type ${action.type}`);
      }

      return state.user;
    },
    user ? user : emptyUser
  );

  useEffect(() => {
    const getUserInfo = async () => {
      if (!accessToken) return;
      const decodedToken: { exp: any } = jwtDecode(accessToken);
      const accessTokenExp: number = decodedToken.exp * 1000;
      const remainingAccessTokenDuration = accessTokenExp - Date.now() + 3000;

      setTimeout(() => {
        signInAuthProvider
          .acquireTokenSilent(tokenRequest)
          .then(data => data.accessToken)
          .catch(async error => {
            if (error instanceof InteractionRequiredAuthError) {
              setSessionExpiredModalOpen(true);
            }
          });
      }, remainingAccessTokenDuration);

      const aadResponse: any = await axios
        .request({
          method: 'get',
          url: `${process.env.REACT_APP_SECURITY_API_BASE}/users/${sub}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch(e => console.log(e));

      const unityResponse: any = await axios
        .request({
          method: 'get',
          url: `${process.env.REACT_APP_SECURITY_API_BASE}/users/unityuser?sub=${sub}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch(e => {
          console.log(e);
          setUserInfo({ ...emptyUser, statusCode: e?.response?.status });
        });

      if (aadResponse) {
        setAdUserInfo(aadResponse?.data);
      }
      if (unityResponse) {
        if (unityResponse?.data?.defaultTenantId) {
          if (!getStoredTenant()) {
            if (process.env.REACT_APP_UNITY_TENANT_ID) {
              storeTenant(process.env.REACT_APP_UNITY_TENANT_ID);
            } else {
              storeTenant(unityResponse.data.defaultTenantId);
            }
          }
        }
        setUserInfo({
          ...unityResponse?.data,
          statusCode: unityResponse?.status,
        });
      }
    };
    if (sub) {
      getUserInfo();
    }
  }, [sub, accessToken, setSessionExpiredModalOpen]);

  useEffect(() => {
    if (!user?.aadId || !user?.statusCode || didLoad) {
      return;
    }
    setDidLoad(true);
    dispatch({ type: 'SET_USER', user });
  }, [user, dispatch, didLoad]);

  return (
    <UserContext.Provider value={userState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides msal+univerus authentication to the app
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const url = window.location.pathname;
  const isWhiteListed = whitelistedPaths.includes(url);
  const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  signInAuthProvider.setNavigationClient(navigationClient);

  useEffect(() => {
    const callbackId = signInAuthProvider.addEventCallback((event: any) => {
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (
          event.error &&
          event.error.errorMessage.indexOf('AADB2C90091') > -1
        ) {
          if (event.interactionType === InteractionType.Redirect) {
            signInAuthProvider.loginRedirect(tokenRequest);
          }
        }
      }
    });

    return () => {
      if (callbackId) {
        signInAuthProvider.removeEventCallback(callbackId);
      }
    };
  }, []);

  if (isWhiteListed && !isAuthenticated) {
    return (
      <MsalProvider instance={signInAuthProvider}>
        <UserProvider
          sessionExpiredModalOpen={sessionExpiredModalOpen}
          setSessionExpiredModalOpen={setSessionExpiredModalOpen}
        >
          {children}
        </UserProvider>
      </MsalProvider>
    );
  }

  return (
    <MsalProvider instance={signInAuthProvider}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={loginRequest}
        loadingComponent={() => <LoadingIndicator />}
      >
        <Dialog open={sessionExpiredModalOpen} maxWidth="xs" onClose={() => {}}>
          <DialogContent>
            <DialogContentText>
              <Typography variant="subtitle2">
                {'Your session has expired. Please login to continue.'}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                signInAuthProvider
                  .acquireTokenPopup({
                    scopes: [apiAccessScope],
                    prompt: 'none',
                  })
                  .then(() => {
                    setSessionExpiredModalOpen(false);
                  })
                  .catch(err => {
                    if (err instanceof InteractionRequiredAuthError) {
                      signInAuthProvider
                        .acquireTokenPopup({
                          scopes: [apiAccessScope],
                          prompt: 'login',
                        })
                        .then(() => {
                          setSessionExpiredModalOpen(false);
                        })
                        .catch(err =>
                          console.log('Could not re-authenticate user: ', err)
                        );
                    }
                  });
              }}
              color="primary"
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
        <UserProvider
          sessionExpiredModalOpen={sessionExpiredModalOpen}
          setSessionExpiredModalOpen={setSessionExpiredModalOpen}
        >
          {children}
        </UserProvider>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
};
