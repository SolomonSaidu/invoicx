
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { storage } from '../lib/storage';
import type { Invoice } from '../types/invoice';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { Input } from '../components/ui/Input';
import { generatePDF } from '../utils/pdfGenerator';
import { calculateInvoiceTotals } from '../utils/invoiceCalculations';

export const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isEditing = searchParams.get('edit') === 'true';

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const found = storage.getById(id);

    setInvoice(found || null);
    setIsLoading(false);
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          Loading invoice...
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Not found                                                              */
  /* ---------------------------------------------------------------------- */

  if (!invoice) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          📄
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          Invoice not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This invoice may have been deleted or no longer exists.
        </p>

        <button
          onClick={() => navigate('/invoices')}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Back to invoices
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Edit mode                                                              */
  /* ---------------------------------------------------------------------- */

  if (isEditing) {
    return (
      <EditInvoice
        invoice={invoice}
        onSave={(updatedInvoice) => {
          const savedInvoice: Invoice = {
            ...updatedInvoice,
            id: invoice.id,
            createdAt: invoice.createdAt,
            updatedAt: new Date().toISOString(),
          };

          storage.save(savedInvoice);
          setInvoice(savedInvoice);

          navigate(`/invoices/${invoice.id}`);
        }}
        onCancel={() => navigate(`/invoices/${invoice.id}`)}
      />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* View mode                                                              */
  /* ---------------------------------------------------------------------- */

  return (
    <InvoiceView
      invoice={invoice}
      onEdit={() =>
        navigate(`/invoices/${invoice.id}?edit=true`)
      }
      onDelete={() => {
        const confirmed = window.confirm(
          `Delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`
        );

        if (!confirmed) return;

        storage.delete(invoice.id);
        navigate('/invoices');
      }}
      onDownload={() => generatePDF(invoice)}
    />
  );
};

/* ========================================================================== */
/* VIEW MODE                                                                  */
/* ========================================================================== */

type InvoiceViewProps = {
  invoice: Invoice;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
};

const InvoiceView = ({
  invoice,
  onEdit,
  onDelete,
  onDownload,
}: InvoiceViewProps) => {
  const navigate = useNavigate();

  const { total } = calculateInvoiceTotals(invoice);

  const formatCurrency = () => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: invoice.currency || 'NGN',
        minimumFractionDigits: 2,
      }).format(total);
    } catch {
      return `${invoice.currency || ''} ${total.toFixed(2)}`;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span>←</span>
          Back to invoices
        </button>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {invoice.invoiceNumber}
              </h1>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Invoice
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Issued {formatDate(invoice.issueDate)}
              {invoice.customerName && (
                <>
                  {' '}
                  · Billed to {invoice.customerName}
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Edit
            </button>

            <button
              onClick={onDownload}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Download PDF
            </button>

            <button
              onClick={onDelete}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Customer"
          value={invoice.customerName || 'No customer'}
        />

        <SummaryCard
          label="Issue date"
          value={formatDate(invoice.issueDate)}
        />

        <SummaryCard
          label="Total"
          value={formatCurrency()}
          highlight
        />
      </div>

      {/* Invoice document */}
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm sm:p-6 lg:p-8">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
};

/* ========================================================================== */
/* EDIT MODE                                                                  */
/* ========================================================================== */

type EditInvoiceProps = {
  invoice: Invoice;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
};

const EditInvoice = ({
  invoice,
  onSave,
  onCancel,
}: EditInvoiceProps) => {
  const {
    invoice: formInvoice,
    updateField,
    addItem,
    removeItem,
    updateItem,
    isValid,
    errors,
  } = useInvoiceForm(invoice);

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      ...invoice,
      ...formInvoice,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={onCancel}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to invoice
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Edit invoice
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the invoice details and review your changes live.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!isValid}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        {/* ================================================================ */}
        {/* FORM                                                              */}
        {/* ================================================================ */}

        <div className="space-y-5">
          {/* Invoice details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              number="01"
              title="Invoice details"
              description="Basic information about this invoice."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Input
                  label="Invoice Number"
                  value={formInvoice.invoiceNumber}
                  onChange={(e) =>
                    updateField('invoiceNumber', e.target.value)
                  }
                />

                {errors.invoiceNumber && (
                  <ErrorMessage message={errors.invoiceNumber} />
                )}
              </div>

              <Input
                label="Currency"
                value={formInvoice.currency}
                onChange={(e) =>
                  updateField(
                    'currency',
                    e.target.value as Invoice['currency']
                  )
                }
              />

              <Input
                label="Issue Date"
                type="date"
                value={formInvoice.issueDate}
                onChange={(e) =>
                  updateField('issueDate', e.target.value)
                }
              />

              <Input
                label="Due Date"
                type="date"
                value={formInvoice.dueDate || ''}
                onChange={(e) =>
                  updateField('dueDate', e.target.value)
                }
              />
            </div>
          </section>

          {/* Business details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              number="02"
              title="Your business"
              description="The information that appears on your invoice."
            />

            <div className="mt-6 space-y-4">
              <div>
                <Input
                  label="Business Name"
                  value={formInvoice.businessName}
                  onChange={(e) =>
                    updateField('businessName', e.target.value)
                  }
                />

                {errors.businessName && (
                  <ErrorMessage message={errors.businessName} />
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={formInvoice.businessEmail || ''}
                  onChange={(e) =>
                    updateField('businessEmail', e.target.value)
                  }
                />

                <Input
                  label="Phone"
                  value={formInvoice.businessPhone || ''}
                  onChange={(e) =>
                    updateField('businessPhone', e.target.value)
                  }
                />
              </div>

              <Input
                label="Address"
                value={formInvoice.businessAddress || ''}
                onChange={(e) =>
                  updateField('businessAddress', e.target.value)
                }
              />
            </div>
          </section>

          {/* Customer details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              number="03"
              title="Bill to"
              description="Who is receiving this invoice?"
            />

            <div className="mt-6 space-y-4">
              <div>
                <Input
                  label="Customer Name"
                  value={formInvoice.customerName}
                  onChange={(e) =>
                    updateField('customerName', e.target.value)
                  }
                />

                {errors.customerName && (
                  <ErrorMessage message={errors.customerName} />
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={formInvoice.customerEmail || ''}
                  onChange={(e) =>
                    updateField('customerEmail', e.target.value)
                  }
                />

                <Input
                  label="Phone"
                  value={formInvoice.customerPhone || ''}
                  onChange={(e) =>
                    updateField('customerPhone', e.target.value)
                  }
                />
              </div>

              <Input
                label="Address"
                value={formInvoice.customerAddress || ''}
                onChange={(e) =>
                  updateField('customerAddress', e.target.value)
                }
              />
            </div>
          </section>

          {/* Items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              number="04"
              title="Items"
              description="Add the products or services you're charging for."
            />

            {errors.items && (
              <div className="mt-4">
                <ErrorMessage message={errors.items} />
              </div>
            )}

            <div className="mt-6 space-y-3">
              {formInvoice.items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                      Item {index + 1}
                    </p>

                    {formInvoice.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-semibold text-red-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <Input
                        label="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            'description',
                            e.target.value
                          )
                        }
                      />

                      {errors[`itemDescription${index}`] && (
                        <ErrorMessage
                          message={errors[`itemDescription${index}`]}
                        />
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            'quantity',
                            Number(e.target.value)
                          )
                        }
                      />

                      {errors[`itemQuantity${index}`] && (
                        <ErrorMessage
                          message={errors[`itemQuantity${index}`]}
                        />
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        label="Unit price"
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            'unitPrice',
                            Number(e.target.value)
                          )
                        }
                      />

                      {errors[`itemUnitPrice${index}`] && (
                        <ErrorMessage
                          message={errors[`itemUnitPrice${index}`]}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-4 w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              + Add line item
            </button>
          </section>

          {/* Discount & tax */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              number="05"
              title="Adjustments"
              description="Apply a discount or tax to this invoice."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Discount type
                </label>

                <select
                  value={formInvoice.discountType}
                  onChange={(e) =>
                    updateField(
                      'discountType',
                      e.target.value as Invoice['discountType']
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed amount
                  </option>
                </select>
              </div>

              <Input
                label={
                  formInvoice.discountType === 'percentage'
                    ? 'Discount (%)'
                    : 'Discount amount'
                }
                type="number"
                min="0"
                value={formInvoice.discountValue}
                onChange={(e) =>
                  updateField(
                    'discountValue',
                    Number(e.target.value)
                  )
                }
              />

              <Input
                label="Tax rate (%)"
                type="number"
                min="0"
                value={formInvoice.taxRate}
                onChange={(e) =>
                  updateField(
                    'taxRate',
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              number="06"
              title="Additional information"
              description="Optional notes or payment instructions."
            />

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Notes
              </label>

              <textarea
                value={formInvoice.notes || ''}
                onChange={(e) =>
                  updateField('notes', e.target.value)
                }
                rows={4}
                placeholder="Thank you for your business..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </section>
        </div>

        {/* ================================================================ */}
        {/* PREVIEW                                                           */}
        {/* ================================================================ */}

        <div className="lg:sticky lg:top-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Live preview
              </p>

              <p className="text-xs text-slate-400">
                Changes appear instantly
              </p>
            </div>

            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Live
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm sm:p-5">
            <InvoicePreview invoice={formInvoice} />
          </div>

          <button
            onClick={handleSave}
            disabled={!isValid}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Save changes
          </button>

          {!isValid && (
            <p className="mt-2 text-center text-xs text-slate-400">
              Fix the highlighted fields before saving.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* COMPONENTS                                                                 */
/* ========================================================================== */

const SummaryCard = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 truncate text-lg font-bold ${
          highlight
            ? 'text-blue-600'
            : 'text-slate-950'
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const SectionHeader = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
        {number}
      </div>

      <div>
        <h2 className="font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const ErrorMessage = ({
  message,
}: {
  message?: string;
}) => {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs font-medium text-red-500">
      {message}
    </p>
  );
};
