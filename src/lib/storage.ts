import type { Invoice } from '../types/invoice';

const STORAGE_KEY = 'invoix_invoices';

export const storage = {
  getAll: (): Invoice[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Invoice | undefined => {
    return storage.getAll().find((i) => i.id === id);
  },

  save: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Invoice => {
    const all = storage.getAll();
    const now = new Date().toISOString();

    if (invoice.id) {
      // Update
      const index = all.findIndex((i) => i.id === invoice.id);
      if (index !== -1) {
        all[index] = { ...all[index], ...invoice, updatedAt: now };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return all[index];
      }
    }

    // Create
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    all.push(newInvoice);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newInvoice;
  },

  delete: (id: string): void => {
    const all = storage.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter((i) => i.id !== id)));
  },
};
