export const generateProductCode = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PROD-${timestamp}-${random}`;
};

export const calculateDiscount = (mrp: number, sellingPrice: number): number => {
  if (mrp <= 0) return 0;
  const discount = ((mrp - sellingPrice) / mrp) * 100;
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};