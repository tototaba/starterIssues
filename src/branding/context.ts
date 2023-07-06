import { createContext } from 'react';
import * as branding from './branding';
import { Branding } from './types';

/**
 * Context providing site branding
 * @internal
 */
export const BrandingContext = createContext<Branding>(branding);
