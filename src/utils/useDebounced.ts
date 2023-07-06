import { useState, useEffect } from 'react';

// Originally from https://usehooks.com/useDebounce/, no copyright
export function useDebounced(
  value: any,
  delay: number,
  valuesToWatch: any[] | null = null
) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    // TODO: possibly cleanup?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...(valuesToWatch || [value]), delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export default useDebounced;
