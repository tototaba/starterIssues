import { PublicClientApplication, Configuration } from '@azure/msal-browser';

const PUBLIC_URL = new URL(
  process.env.PUBLIC_URL,
  window.location.origin
).href.replace(/\/$/, '');

if (!process.env.REACT_APP_MSAL_TENANT)
  throw new Error('REACT_APP_MSAL_TENANT not configured');
if (!process.env.REACT_APP_MSAL_CLIENT_ID)
  throw new Error('REACT_APP_MSAL_CLIENT_ID not configured');

const tenant: string = process.env.REACT_APP_MSAL_TENANT;
const signInPolicy: string = 'B2C_1A_signup_signin_v2';
const applicationID: string = process.env.REACT_APP_MSAL_CLIENT_ID;
const reactRedirectUri: string = `${PUBLIC_URL}/aad_callback`;
const tenantSubdomain: string = tenant.split('.')[0];
const instance: string = `https://${tenantSubdomain}.b2clogin.com/`;
const signInAuthority: string = `${instance}${tenant}/${signInPolicy}`;
export const apiAccessScope: string = `https://${tenant}/${process.env.REACT_APP_MSAL_API_ACCESS_SCOPE}`;
const passwordChangePolicy: string = 'B2C_1A_profile_edit_password_change';
export const changePasswordUri: string = `https://${tenantSubdomain}.b2clogin.com/${tenant}/oauth2/v2.0/authorize?p=${passwordChangePolicy}&client_id=${
  process.env.REACT_APP_MSAL_API_CLIENT_ID
}&nonce=defaultNonce&redirect_uri=${encodeURIComponent(
  reactRedirectUri
)}&scope=openid&response_type=id_token`;

// Msal Configurations
export const signInConfig: Configuration = {
  auth: {
    authority: signInAuthority,
    knownAuthorities: [`${tenantSubdomain}.b2clogin.com`],
    clientId: applicationID,
    redirectUri: reactRedirectUri,
    postLogoutRedirectUri: PUBLIC_URL + '/', // @todo Create some sort of goodbye page
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    allowRedirectInIframe: false,
  },
};

const signInAuthProvider = new PublicClientApplication(signInConfig);

export const tokenRequest = { scopes: [apiAccessScope] };

export const loginRequest = { scopes: ['openid', 'offline_access'] };

export default signInAuthProvider;
