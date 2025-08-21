export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('es-AR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const parseAmount = (value: string): number => {
  return parseFloat(value.replace(',', '.'));
};

export const isValidAmount = (value: string): boolean => {
  const amount = parseAmount(value);
  return !isNaN(amount) && amount > 0;
};