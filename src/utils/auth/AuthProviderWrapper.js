import React from 'react';
import { AuthProvider, LocalAuthProvider } from './';

export const AuthProviderWrapper = props => {
  const { children } = props;

  return process.env.REACT_APP_LOCAL_AUTH === 'true' ? (
    <LocalAuthProvider>{children}</LocalAuthProvider>
  ) : (
    <AuthProvider>{children}</AuthProvider>
  );
};
