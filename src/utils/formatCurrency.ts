const formatCurrency = (value: number | undefined | null) => {
  const valueOrNull = value ?? null;

  return valueOrNull !== null
    ? valueOrNull.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : '';
};

export default formatCurrency;
