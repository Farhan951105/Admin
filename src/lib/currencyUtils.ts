
export const formatCurrency = (amount: number | undefined) => {
  if (typeof amount === 'undefined') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  if (value.toLowerCase() === 'free') return 0;
  const amount = parseFloat(value.replace(/[^0-9.]+/g, ''));
  return isNaN(amount) ? 0 : amount;
};
