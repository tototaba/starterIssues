const formatDate = (date: string | undefined | null) =>
  date !== undefined && date !== null
    ? new Date(date).toLocaleDateString()
    : '';

export default formatDate;
