import type { Invoice } from '../../types/invoice';
import { calculateInvoiceTotals } from '../../utils/invoiceCalculations';

interface InvoicePreviewProps {
  invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const totals = calculateInvoiceTotals(invoice);

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{invoice.businessName || 'Business Name'}</h1>
          <p className="text-sm text-gray-600">{invoice.businessAddress}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-400">INVOICE</h2>
          <p className="text-sm">#{invoice.invoiceNumber || '---'}</p>
          <p className="text-sm">Date: {invoice.issueDate}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">Bill To</h3>
        <p className="font-medium">{invoice.customerName || 'Customer Name'}</p>
        <p className="text-sm">{invoice.customerAddress}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 text-sm">
              <td className="py-2">{item.description}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{item.unitPrice.toFixed(2)}</td>
              <td className="py-2 text-right">{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{totals.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
            <span>Total</span>
            <span>{invoice.currency} {totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      {invoice.notes && (
        <div className="mt-8 border-t pt-4 text-sm text-gray-600">
          <p className="font-semibold">Notes:</p>
          <p>{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};
