export const TrimForAvatar = avatar => {
  return avatar?.trim()?.charAt(0) || '?';
};
