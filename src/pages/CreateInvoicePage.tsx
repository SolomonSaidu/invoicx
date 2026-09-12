import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { Input } from '../components/ui/Input';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { storage } from '../lib/storage';
import type { InvoiceItem } from '../types/invoice';

export const CreateInvoicePage = () => {
  const navigate = useNavigate();

  const {
    invoice,
    updateField,
    addItem,
    removeItem,
    updateItem,
    isValid,
    errors,
  } = useInvoiceForm();

  const handleSave = () => {
    if (!isValid) return;

    storage.save(invoice);
    navigate('/invoices');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <span>←</span>
            Back to invoices
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create invoice
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a professional invoice and preview it in real time.
          </p>
        </div>

        <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm sm:block">
          Draft · Saved locally
        </div>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">
        {/* FORM */}
        <div className="space-y-5">
          {/* Invoice Details */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              number="01"
              title="Invoice details"
              description="Basic information about this invoice."
            />

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <div>
                <Input
                  label="Invoice Number"
                  value={invoice.invoiceNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('invoiceNumber', e.target.value)
                  }
                />

                {errors.invoiceNumber && (
                  <ErrorMessage>{errors.invoiceNumber}</ErrorMessage>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Currency
                </label>

                <select
                  value={invoice.currency}
                  onChange={(e) =>
                    updateField(
                      'currency',
                      e.target.value as 'NGN' | 'USD' | 'GBP' | 'EUR'
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="NGN">NGN — Nigerian Naira</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>

              <div>
                <Input
                  label="Issue Date"
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('issueDate', e.target.value)
                  }
                />
              </div>

              <div>
                <Input
                  label="Due Date"
                  type="date"
                  value={invoice.dueDate || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('dueDate', e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Business Details */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              number="02"
              title="Your business"
              description="The business information shown on the invoice."
            />

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Business Name"
                  value={invoice.businessName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('businessName', e.target.value)
                  }
                />

                {errors.businessName && (
                  <ErrorMessage>{errors.businessName}</ErrorMessage>
                )}
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="hello@business.com"
                value={invoice.businessEmail || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('businessEmail', e.target.value)
                }
              />

              <Input
                label="Phone"
                placeholder="+234..."
                value={invoice.businessPhone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('businessPhone', e.target.value)
                }
              />

              <div className="sm:col-span-2">
                <Input
                  label="Business Address"
                  placeholder="123 Business Street, Kano, Nigeria"
                  value={invoice.businessAddress || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('businessAddress', e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              number="03"
              title="Bill to"
              description="Who is receiving this invoice?"
            />

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Customer Name"
                  value={invoice.customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('customerName', e.target.value)
                  }
                />

                {errors.customerName && (
                  <ErrorMessage>{errors.customerName}</ErrorMessage>
                )}
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="customer@example.com"
                value={invoice.customerEmail || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('customerEmail', e.target.value)
                }
              />

              <Input
                label="Phone"
                placeholder="+234..."
                value={invoice.customerPhone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('customerPhone', e.target.value)
                }
              />

              <div className="sm:col-span-2">
                <Input
                  label="Customer Address"
                  placeholder="Customer address"
                  value={invoice.customerAddress || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('customerAddress', e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              number="04"
              title="Items"
              description="Add the products or services you're billing for."
            />

            <div className="space-y-4 p-6">
              {errors.items && (
                <ErrorMessage>{errors.items}</ErrorMessage>
              )}

              {invoice.items.map((item: InvoiceItem, index: number) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Item {index + 1}
                    </span>

                    {invoice.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-medium text-slate-400 transition-colors hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                    {/* Description */}
                    <div className="sm:col-span-6">
                      <Input
                        label="Description"
                        placeholder="Website design"
                        value={item.description}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          updateItem(
                            item.id,
                            'description',
                            e.target.value
                          )
                        }
                      />

                      {errors[`itemDescription${index}`] && (
                        <ErrorMessage>
                          {errors[`itemDescription${index}`]}
                        </ErrorMessage>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-2">
                      <Input
                        label="Qty"
                        type="number"
                        min="0"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const value = e.target.value;

                          updateItem(
                            item.id,
                            'quantity',
                            value === '' ? 0 : Number(value)
                          );
                        }}
                      />

                      {errors[`itemQuantity${index}`] && (
                        <ErrorMessage>
                          {errors[`itemQuantity${index}`]}
                        </ErrorMessage>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-4">
                      <Input
                        label="Unit price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const value = e.target.value;

                          updateItem(
                            item.id,
                            'unitPrice',
                            value === '' ? 0 : Number(value)
                          );
                        }}
                      />

                      {errors[`itemUnitPrice${index}`] && (
                        <ErrorMessage>
                          {errors[`itemUnitPrice${index}`]}
                        </ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600"
              >
                <span className="text-lg leading-none">+</span>
                Add line item
              </button>
            </div>
          </section>

          {/* Adjustments */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              number="05"
              title="Adjustments"
              description="Optional discount and tax settings."
            />

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Discount type
                </label>

                <select
                  value={invoice.discountType}
                  onChange={(e) =>
                    updateField(
                      'discountType',
                      e.target.value as 'percentage' | 'fixed'
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </div>

              {/* Discount */}
              <Input
                label="Discount"
                type="number"
                min="0"
                step="0.01"
                value={
                  invoice.discountValue === 0
                    ? ''
                    : invoice.discountValue
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;

                  updateField(
                    'discountValue',
                    value === '' ? 0 : Number(value)
                  );
                }}
              />

              {/* Tax */}
              <Input
                label="Tax rate (%)"
                type="number"
                min="0"
                step="0.01"
                value={invoice.taxRate === 0 ? '' : invoice.taxRate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;

                  updateField(
                    'taxRate',
                    value === '' ? 0 : Number(value)
                  );
                }}
              />
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              number="06"
              title="Additional information"
              description="Optional notes or payment instructions."
            />

            <div className="p-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
              </label>

              <textarea
                rows={4}
                placeholder="Thank you for your business..."
                value={invoice.notes || ''}
                onChange={(e) =>
                  updateField('notes', e.target.value)
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </section>

          {/* Mobile Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:hidden"
          >
            Save invoice
          </button>
        </div>

        {/* PREVIEW */}
        <div className="xl:sticky xl:top-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Live preview
              </p>

              <p className="text-xs text-slate-500">
                Updates as you type
              </p>
            </div>

            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm sm:p-5">
            <InvoicePreview invoice={invoice} />
          </div>

          <div className="mt-4 hidden sm:block">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Save invoice
            </button>

            {!isValid && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Complete the required fields to save this invoice.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type SectionHeaderProps = {
  number: string;
  title: string;
  description: string;
};

const SectionHeader = ({
  number,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <div className="flex gap-4 border-b border-slate-100 px-6 py-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
        {number}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const ErrorMessage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="mt-1.5 text-xs font-medium text-red-500">
      {children}
    </p>
  );
};