const SessionStorageKey = 'local-url';

export const storeInitialPath = () => {
  if (
    !window.sessionStorage.getItem(SessionStorageKey) ||
    window.sessionStorage.getItem(SessionStorageKey) === '/' ||
    window.sessionStorage.getItem(SessionStorageKey) === '/null'
  ) {
    window.sessionStorage.setItem(
      SessionStorageKey,
      window.location.pathname === '/null' ||
        window.location.pathname === '/aad_callback'
        ? '/'
        : window.location.pathname
    );
  }
};

export const storeCurrentPath = () => {
  window.sessionStorage.setItem(SessionStorageKey, window.location.pathname);
};

export const storePath = pathname => {
  window.sessionStorage.setItem(SessionStorageKey, pathname);
};

export const getStoredPath = () => {
  return window.sessionStorage.getItem(SessionStorageKey);
};

export const clearStoredPath = () => {
  window.sessionStorage.removeItem(SessionStorageKey);
};
