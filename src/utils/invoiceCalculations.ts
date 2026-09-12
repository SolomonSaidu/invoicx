import type { Invoice } from '../types/invoice';

export const calculateSubtotal = (items: Invoice['items']) => {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

export const calculateDiscount = (subtotal: number, type: 'percentage' | 'fixed', value: number) => {
  if (type === 'percentage') {
    return (subtotal * value) / 100;
  }
  return value;
};

export const calculateTax = (taxableAmount: number, taxRate: number) => {
  return (taxableAmount * taxRate) / 100;
};

export const calculateInvoiceTotals = (invoice: Pick<Invoice, 'items' | 'discountType' | 'discountValue' | 'taxRate'>) => {
  const subtotal = calculateSubtotal(invoice.items);
  const discountAmount = calculateDiscount(subtotal, invoice.discountType, invoice.discountValue);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = calculateTax(taxableAmount, invoice.taxRate);
  const total = taxableAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total: Math.max(0, total),
  };
};
