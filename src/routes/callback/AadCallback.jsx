import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  getStoredPath,
  clearStoredPath,
} from '../../utils/redirect/LocalRedirectUrlStorage';
import {
  getStoredExternalPath,
  clearStoredExternalPath,
} from '../../utils/redirect/ExternalRedirectUrlStorage';

const AadCallback = props => {
  // const localUrl = getStoredPath();
  const localUrl = "https://localhost:3000";
  const externalUrl = getStoredExternalPath();

  clearStoredPath();
  clearStoredExternalPath();

  if (externalUrl) {
    return (
      <Route
        component={() => {
          window.location.href = externalUrl;
          return null;
        }}
      />
    );
  }

  return <Redirect to={localUrl === '/aad_callback' ? '/' : localUrl} />;
};

export default AadCallback;
