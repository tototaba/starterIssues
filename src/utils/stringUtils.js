export const removeWhiteSpace = str => {
  if (!str) {
    return '';
  }
  return str.replace(/\s/g, '');
};
