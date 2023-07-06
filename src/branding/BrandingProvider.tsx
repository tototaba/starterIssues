import React, { ReactNode } from 'react';
import { BrandingContext } from './context';
import { Branding } from './types';

interface BrandingProviderProps {
  branding: Branding;
  children: ReactNode;
}

/**
 * Provider that overrides the branding with whitelabel branding
 */
export const BrandingProvider = (props: BrandingProviderProps) => {
  const { branding, children } = props;

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
};
