import { getStoredTenant } from 'unity-fluent-library';

export interface User {
  name: string | undefined;
  firstName: string | undefined;
  familyName: string | undefined;
  jobTitle: string | undefined;
  email: string | undefined;
  mobile: string | undefined;
  phone: string | undefined;
  id: string | undefined;
  location: string | undefined;
  aadId: string | undefined;
  accessToken: string | undefined;
  defaultTenantId: string | undefined;
  currentTenantId: string | undefined;
  tenantIds: Array<string> | undefined;
  roleIds: Array<string> | undefined;
  products: Array<object> | undefined;
  permissions: Array<object> | undefined;
  can: any | undefined;
  statusCode: number | undefined;
}

/**
 * Create a "unified" user object from MSAL account info and Univerus user data (in the future)
 */
export function createUser(userInfo: any): User {
  let userTenantPermissions: any = [];
  let userTenantRoles: any = [];
  if (userInfo?.tenantIds) {
    const currentUserTenantProperties =
      userInfo?.userTenantPropertiesView?.find(
        (propertyView: any) =>
          propertyView?.tenantId ===
          (userInfo.defaultTenantId ??
            (userInfo?.tenantIds ? userInfo?.tenantIds[0] : ''))
      );
    userTenantPermissions = currentUserTenantProperties
      ? currentUserTenantProperties.permissions
      : [];
    userTenantRoles = currentUserTenantProperties
      ? currentUserTenantProperties.securityRoles
      : [];
  }

  const tenantId: any = getStoredTenant();

  return {
    name: userInfo?.displayName ?? '',
    firstName: userInfo?.givenName ?? '',
    familyName: userInfo?.surname ?? '',
    jobTitle: userInfo?.jobTitle ?? '',
    email: userInfo?.email ?? '',
    mobile: userInfo?.mobilePhone ?? '',
    phone: userInfo?.officePhone ?? '',
    id: userInfo?.userId ?? '',
    location: userInfo?.location ?? '',
    aadId: userInfo?.id ?? '',
    accessToken: userInfo?.accessToken ?? '',
    tenantIds: userInfo?.tenantIds ?? [],
    defaultTenantId: userInfo?.defaultTenantId ?? '',
    currentTenantId:
      process.env.REACT_APP_UNITY_TENANT_ID !== ''
        ? process.env.REACT_APP_UNITY_TENANT_ID
        : tenantId ||
          (userInfo?.defaultTenantId ??
            (userInfo?.tenantIds ? userInfo?.tenantIds[0] : '')),
    roleIds: userTenantRoles.map((role: any) => role.roleId) ?? [],
    products: userInfo?.products ?? [],
    permissions: userTenantPermissions,
    can:
      userTenantPermissions.reduce((can: any, permission: any) => {
        if (permission.value === 'false') {
          can[permission.name] = false;
        } else if (permission.value === 'true') {
          can[permission.name] = true;
        } else {
          can[permission.name] = permission.value;
        }
        return can;
      }, {}) ?? {},
    statusCode: userInfo?.statusCode ?? undefined,
  };
}
