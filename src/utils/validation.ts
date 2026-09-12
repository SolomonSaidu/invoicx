import type { Invoice } from '../types/invoice';

export const validateInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
  const errors: Record<string, string> = {};

  if (!invoice.businessName.trim()) errors.businessName = 'Business name is required';
  if (!invoice.customerName.trim()) errors.customerName = 'Customer name is required';
  if (!invoice.invoiceNumber.trim()) errors.invoiceNumber = 'Invoice number is required';
  
  if (invoice.items.length === 0) {
    errors.items = 'At least one invoice item is required';
  } else {
    invoice.items.forEach((item, index) => {
      if (!item.description.trim()) {
        errors[`itemDescription${index}`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        errors[`itemQuantity${index}`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
        errors[`itemUnitPrice${index}`] = 'Unit price must be >= 0';
      }
    });
  }

  if (invoice.taxRate < 0 || invoice.taxRate > 100) errors.taxRate = 'Tax must be between 0 and 100';
  
  if (invoice.discountType === 'percentage') {
    if (invoice.discountValue < 0 || invoice.discountValue > 100) {
      errors.discountValue = 'Percentage discount must be between 0 and 100';
    }
  } else if (invoice.discountValue < 0) {
    errors.discountValue = 'Fixed discount must be >= 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
