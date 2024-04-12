import React, { useEffect } from 'react';
import { Button, makeStyles, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MenuOpener from '../utils/MenuOpener';
import UserAvatar from '../utils/UserAvatar';
import { FluentProfileMenuCard, useSingleLogout } from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    background: theme.palette.secondary.main,
  },
}));

const IS_LOCAL_AUTH = process.env.REACT_APP_LOCAL_AUTH === 'true';

const UserWrapper = props => {
  const classes = useStyles();
  const { returnTo, tenant, unityUrl, user, userHasAccessToTenant, id, udprecordid } = props;

  const singleLogout = useSingleLogout();

  useEffect(() => {
    if (!user) {
      return;
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className={classes.root}>
      {user ? (
        <MenuOpener
          button={
            <IconButton
              id={id}
              udprecordid={udprecordid}
            >
              <UserAvatar
                name={user?.name}
                email={user?.email}
                size="toolbar"
                className={classes.avatar}
              />
            </IconButton>
          }
          menuProps={{
            keepMounted: true,
            getContentAnchorEl: null,
            variant: 'menu',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            transformOrigin: { vertical: 'top', horizontal: 'right' },
          }}
        >
          <FluentProfileMenuCard
            userTenants={
              process.env.REACT_APP_UNITY_TENANT_ID === ''
                ? tenant?.options
                : userHasAccessToTenant
                ? tenant?.options?.filter(option => {
                    return (
                      option.tenantId === process.env.REACT_APP_UNITY_TENANT_ID
                    );
                  })
                : []
            }
            currentTenant={tenant?.current}
            user={user}
            setUser={tenant?.onSelect}
            logout={singleLogout}
            unityUrl={unityUrl}
            displayProfileButton={!IS_LOCAL_AUTH}
          />
        </MenuOpener>
      ) : (
        <Button
          component={Link}
          to={{ pathname: '/login', state: { returnTo } }}
          color="inherit"
        >
          Sign in
        </Button>
      )}
    </div>
  );
};
export default UserWrapper;
