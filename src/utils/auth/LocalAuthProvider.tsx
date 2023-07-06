import React, {
  ReactNode,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from 'react';
import { UserContext, UserDispatchContext } from './internal';
import { User, createUser } from './user';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import {
  storeTenant,
  getStoredTenant,
  storeAccessToken,
  getStoredAccessToken,
} from '../storage/UnitySessionStorage';
import { localLogout } from './authActions';

export interface LocalAuthProviderProps {
  children: ReactNode;
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

export const LocalAuthProvider = ({ children }: LocalAuthProviderProps) => {
  const [adUserInfo, setAdUserInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [didLoad, setDidLoad] = useState(false);
  const [accessToken, setAccessToken] = useState<any>(getStoredAccessToken());

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
        case 'SET_ACCESS_TOKEN':
          state = {
            ...state,
          };
          setAccessToken(action.accessToken);
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

      storeAccessToken(accessToken);

      // To mimick a Unity token the sub will be oid
      const decodedToken: { exp: any; oid: any } = jwtDecode(accessToken);
      const accessTokenExp: number = decodedToken.exp * 1000;
      const remainingAccessTokenDuration = accessTokenExp - Date.now() + 3000;

      const sub = decodedToken.oid;

      setTimeout(() => {
        // TODO: re-authorize
        localLogout();
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
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!user?.aadId || !user?.statusCode || didLoad) {
      return;
    }
    setDidLoad(true);
    dispatch({ type: 'SET_USER', user });
  }, [user, didLoad, dispatch]);

  return (
    <UserContext.Provider value={userState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
