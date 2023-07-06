import React, { useMemo } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useIsUnityAuthenticated, useUser } from '../utils/auth';
import PageForbidden from '../UI/routing/PageForbiddenRoute';

const IS_LOCAL_AUTH = process.env.REACT_APP_LOCAL_AUTH === 'true';

const PrivateRoute = ({ ...otherProps }) => {
  const isAuthenticated = useIsUnityAuthenticated();
  const user = useUser();

  const userHasAccessToTenant = useMemo(() => {
    if (user?.tenantIds?.includes(user.currentTenantId)) {
      return true;
    }
    return false;
  }, [user]);

  if (!isAuthenticated && IS_LOCAL_AUTH) {
    return (
      <Redirect to={otherProps.redirectTo ? otherProps.redirectTo : '/login'} />
    );
  }

  if (!userHasAccessToTenant && isAuthenticated && user?.statusCode === 200) {
    return (
      <Route
        path="*"
        render={props => (
          <PageForbidden
            message="You do not have access to this tenant. Please select a different Tenant."
            showButton={false}
          />
        )}
      />
    );
  }

  if (isAuthenticated && user?.statusCode === 200) {
    return <Route {...otherProps} />;
  }

  return null;
};

export default PrivateRoute;
