const TenantStorageKey = 'active-tenant';
const AccessTokenKey = 'active-access-token';

export const storeInitialTenant = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlTenantId = urlParams.get('tenantId');

  if (urlTenantId) {
    storeTenant(urlTenantId);
  }
};

export const storeTenant = tenantId => {
  window.sessionStorage.setItem(TenantStorageKey, tenantId);
};

export const getStoredTenant = () => {
  return window.sessionStorage.getItem(TenantStorageKey);
};

export const clearStoredTenant = () => {
  window.sessionStorage.removeItem(TenantStorageKey);
};

export const storeAccessToken = accessTokent => {
  window.sessionStorage.setItem(AccessTokenKey, accessTokent);
};

export const getStoredAccessToken = () => {
  return window.sessionStorage.getItem(AccessTokenKey);
};

export const clearStoredAccessToken = () => {
  window.sessionStorage.removeItem(AccessTokenKey);
};
