
import { useState } from 'react';
import type { Invoice, InvoiceItem } from '../types/invoice';
import { calculateInvoiceTotals } from '../utils/invoiceCalculations';
import { validateInvoice } from '../utils/validation';

const createEmptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
});

export const useInvoiceForm = (initialInvoice?: Partial<Invoice>) => {
  const [invoice, setInvoice] = useState<
    Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
  >({
    invoiceNumber:
      initialInvoice?.invoiceNumber || '',

    issueDate:
      initialInvoice?.issueDate ||
      new Date().toISOString().split('T')[0],

    dueDate:
      initialInvoice?.dueDate || '',

    currency:
      initialInvoice?.currency || 'NGN',

    businessName:
      initialInvoice?.businessName || '',

    businessEmail:
      initialInvoice?.businessEmail || '',

    businessPhone:
      initialInvoice?.businessPhone || '',

    businessAddress:
      initialInvoice?.businessAddress || '',

    customerName:
      initialInvoice?.customerName || '',

    customerEmail:
      initialInvoice?.customerEmail || '',

    customerPhone:
      initialInvoice?.customerPhone || '',

    customerAddress:
      initialInvoice?.customerAddress || '',

    items:
      initialInvoice?.items?.length
        ? initialInvoice.items
        : [createEmptyItem()],

    discountType:
      initialInvoice?.discountType || 'percentage',

    discountValue:
      initialInvoice?.discountValue || 0,

    taxRate:
      initialInvoice?.taxRate || 0,

    notes:
      initialInvoice?.notes || '',
  });

  const totals = calculateInvoiceTotals(invoice);

  const { isValid, errors } = validateInvoice(invoice);

  const updateField = <
    K extends keyof typeof invoice
  >(
    field: K,
    value: (typeof invoice)[K]
  ) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        createEmptyItem(),
      ],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) => item.id !== id
      ),
    }));
  };

  const updateItem = <
    K extends keyof InvoiceItem
  >(
    id: string,
    field: K,
    value: InvoiceItem[K]
  ) => {
    setInvoice((prev) => ({
      ...prev,

      items: prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  return {
    invoice,
    totals,
    isValid,
    errors,
    updateField,
    addItem,
    removeItem,
    updateItem,
  };
};