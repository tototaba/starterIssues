/**
 * Format a phone number string from XXXXXXXXXX to (XXX) XXX-XXXX
 *
 * TODO: make more robust to handle other input format
 *
 * @param phone input string
 * @returns formatted string
 */
const formatPhoneNumber = (phone: string | undefined | null) =>
  phone !== undefined && phone !== null
    ? phone.length === 10
      ? `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
      : phone
    : '';

export default formatPhoneNumber;
