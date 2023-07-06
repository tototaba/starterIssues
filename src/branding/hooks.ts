import { useContext } from 'react';
import { BrandingContext } from './context';
import { Branding } from './types';

/**
 * Provides the site's branding information (i.e. site name, logo, etc)
 */
export function useBranding(): Branding {
  return useContext(BrandingContext);
}
