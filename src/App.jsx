import React, { Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Routes from './Routes';
import { CssBaseline } from '@material-ui/core';
import { PermissionContext } from './contexts/PermissionContext';
import { AuthProviderWrapper, ThemeProvider } from 'unity-fluent-library';
import { storeInitialPath } from './utils/redirect/LocalRedirectUrlStorage';
import { storeInitialTenant } from './utils/storage/UnitySessionStorage';
import './App.css';

const queryClient = new QueryClient();

let App = () => {
  const [permissionOptions] = useState({
    level: 'silver',
    option: true,
    mapOption: true,
    mapEditOption: true,
    mapViewOption: true,
  });
  storeInitialPath();
  storeInitialTenant();

  return (
    <Suspense fallback="loading">
      <ThemeProvider>
        <AuthProviderWrapper>
          <PermissionContext.Provider value={permissionOptions}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <Routes />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </PermissionContext.Provider>
        </AuthProviderWrapper>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
