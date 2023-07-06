import { useState, useEffect } from 'react';

/**
 * React hook that returns the device's current pixel ratio according to `window.devicePixelRatio`
 *
 * This hook will automatically re-render a component if `window.devicePixelRatio` changes (due to monitor preference changes or moving windows between monitors).
 */
export default function useDevicePixelRatio(): number {
  const [devicePixelRatio, updateDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  // Effect that listens for changes to the devicePixelRatio and updates the state if it changes
  useEffect(() => {
    const mm = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);

    const handler = () => {
      updateDevicePixelRatio(window.devicePixelRatio);
    };

    mm.addListener(handler);
    return () => mm.removeListener(handler);
  }, [devicePixelRatio]);

  return devicePixelRatio;
}
