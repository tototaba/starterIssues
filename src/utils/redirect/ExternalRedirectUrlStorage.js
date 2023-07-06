const SessionStorageKey = 'external-url';

export const storeExternalPath = url => {
  window.sessionStorage.setItem(SessionStorageKey, url);
};

export const getStoredExternalPath = () => {
  return window.sessionStorage.getItem(SessionStorageKey);
};

export const clearStoredExternalPath = () => {
  window.sessionStorage.removeItem(SessionStorageKey);
};
