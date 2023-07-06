/**
 * Convert a primitive boolean to a string
 *
 * @param bool the boolean to convert
 *
 * @example boolToString(true) == 'true'
 * @example boolToString(false) == 'false'
 * @example boolToString(4) == null
 */
const boolToString = (bool: boolean | null | undefined) =>
  bool !== null && bool !== undefined && typeof bool === 'boolean'
    ? bool
      ? 'true'
      : 'false'
    : null;

export default boolToString;
