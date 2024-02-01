export const formatDate = (dateString) => {
  if (dateString === null || dateString === undefined) {
    return null;
  }
  const parts = dateString.split('-'); // Split the string into parts

  // Extract the month, day, and year from the parts (assuming the format is MM/DD/YYYY)
  const month = parseInt(parts[0], 10) - 1; // Subtract 1 since months are 0-based
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Create the Date object
  const date = new Date(year, month, day);
  return date;
}
export function formatDateString(inputDateString) {
  const date = new Date(inputDateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${day}-${month}`;
}
