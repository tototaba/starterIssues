import * as gravatar from 'gravatar';
import loadImages from 'image-promise';
import { useEffect, useMemo, useState } from 'react';

export interface GravatarOptions {
  size: number;
}

/**
 * Provides the url to a Gravatar image for an email
 *
 * - Returns null until the image has preloaded so letter avatars can be displayed while loading
 * - Returns null if the email does not have a Gravatar (the loaded image is a 404)
 */
export default function useGravatar(
  email: string,
  { size }: GravatarOptions
): string | null {
  const [loaded, setLoaded] = useState(false);

  const url = useMemo(
    () =>
      email &&
      gravatar.url(email, { s: String(size), protocol: 'https', d: '404' }),
    [email, size]
  );

  useEffect(() => {
    loadImages(url)
      .then(() => {
        // Wait for the image to be preloaded into the cache and confirmed to not be a 404
        setLoaded(loaded);
      })
      .catch(err => {
        // Ignore 404 errors
      });
  }, [loaded, url]);

  return url || null;
}
