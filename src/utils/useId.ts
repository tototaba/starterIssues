import warning from 'tiny-warning';
import useConstant from 'use-constant';

let idCounter = 0;
function nextId(): number {
  idCounter += 1;
  warning(
    idCounter < 1e10,
    'Id: you might have a memory leak.' +
      'The idCounter is not supposed to grow that much.'
  );

  return idCounter;
}

/**
 * A simple hook that returns a unique page ID
 */
export default function useId(
  name?: string | undefined | null,
  idFromProps?: string | undefined | null
): string {
  const id = useConstant(nextId);

  if (idFromProps) {
    return idFromProps;
  }

  if (process.env.NODE_ENV === 'production') {
    return `uid${id}`;
  }

  return `${name || 'unnamed'}-${id}`;
}
