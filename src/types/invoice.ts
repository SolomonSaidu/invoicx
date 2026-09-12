export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  currency: 'NGN' | 'USD' | 'GBP' | 'EUR';
  
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  
  items: InvoiceItem[];
  
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number;
  
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}
