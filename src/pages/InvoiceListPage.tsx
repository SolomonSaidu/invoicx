import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { Invoice } from '../types/invoice';
import { calculateInvoiceTotals } from '../utils/invoiceCalculations';

type Filter = 'all' | 'this-month' | 'last-month';
type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    setInvoices(storage.getAll());
  }, []);

  const refreshInvoices = () => {
    setInvoices(storage.getAll());
  };

  const handleDelete = (id: string) => {
    const invoice = invoices.find((item) => item.id === id);

    if (!invoice) return;

    const confirmed = window.confirm(
      `Delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`
    );

    if (!confirmed) return;

    storage.delete(id);
    refreshInvoices();
    setMenuOpen(null);
  };

  const filteredInvoices = useMemo(() => {
    const now = new Date();

    let result = [...invoices];

    // Search
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((invoice) => {
        return (
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.customerName.toLowerCase().includes(query) ||
          invoice.businessName.toLowerCase().includes(query)
        );
      });
    }

    // Date filter
    if (filter !== 'all') {
      result = result.filter((invoice) => {
        const date = new Date(invoice.issueDate);

        if (Number.isNaN(date.getTime())) return false;

        if (filter === 'this-month') {
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }

        const previousMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

        return (
          date.getMonth() === previousMonth.getMonth() &&
          date.getFullYear() === previousMonth.getFullYear()
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sort === 'highest' || sort === 'lowest') {
        const totalA = calculateInvoiceTotals(a).total;
        const totalB = calculateInvoiceTotals(b).total;

        return sort === 'highest'
          ? totalB - totalA
          : totalA - totalB;
      }

      const dateA = new Date(a.issueDate).getTime();
      const dateB = new Date(b.issueDate).getTime();

      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [invoices, search, filter, sort]);

  const totalBilled = invoices.reduce((sum, invoice) => {
    return sum + calculateInvoiceTotals(invoice).total;
  }, 0);

  const thisMonthTotal = invoices.reduce((sum, invoice) => {
    const date = new Date(invoice.issueDate);
    const now = new Date();

    if (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return sum + calculateInvoiceTotals(invoice).total;
    }

    return sum;
  }, 0);

  const formatCurrency = (invoice: Invoice, amount: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: invoice.currency || 'NGN',
        minimumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${invoice.currency || ''} ${amount.toFixed(2)}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getInitial = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || '?';
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Invoice management
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Invoices
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage, edit, and download your invoices.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl"
          >
            <span className="text-lg leading-none">+</span>
            New invoice
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total invoices
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              {invoices.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              All saved invoices
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total billed
            </p>

            <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">
              {invoices.length > 0
                ? formatCurrency(invoices[0], totalBilled)
                : '—'}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Across all invoices
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              This month
            </p>

            <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">
              {invoices.length > 0
                ? formatCurrency(invoices[0], thisMonthTotal)
                : '—'}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Issued this month
            </p>
          </div>
        </div>

        {/* Search / filters */}
        {invoices.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search invoices, customers..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as Filter)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="all">All invoices</option>
                  <option value="this-month">This month</option>
                  <option value="last-month">Last month</option>
                </select>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as SortOption)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="highest">Highest amount</option>
                  <option value="lowest">Lowest amount</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {invoices.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📄
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No invoices yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first professional invoice and have it ready
              to download in minutes.
            </p>

            <Link
              to="/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <span>+</span>
              Create your first invoice
            </Link>

            <p className="mt-4 text-xs text-slate-400">
              No signup · Saved locally · PDF export
            </p>
          </div>
        )}

        {/* No search results */}
        {invoices.length > 0 && filteredInvoices.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              🔍
            </div>

            <h2 className="mt-4 font-bold text-slate-950">
              No invoices found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Desktop table */}
        {filteredInvoices.length > 0 && (
          <div className="hidden overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50/70">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Invoice
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((invoice) => {
                    const { total } = calculateInvoiceTotals(invoice);

                    return (
                      <tr
                        key={invoice.id}
                        className="group transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-600"
                          >
                            {invoice.invoiceNumber}
                          </Link>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {invoice.businessName}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                              {getInitial(invoice.customerName)}
                            </div>

                            <span className="font-medium text-slate-700">
                              {invoice.customerName}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">
                            {formatCurrency(invoice, total)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(invoice.issueDate)}
                        </td>

                        <td className="relative px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              setMenuOpen(
                                menuOpen === invoice.id
                                  ? null
                                  : invoice.id
                              )
                            }
                            className="rounded-lg px-3 py-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Actions for ${invoice.invoiceNumber}`}
                          >
                            ⋮
                          </button>

                          {menuOpen === invoice.id && (
                            <div className="absolute right-6 top-14 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                              <Link
                                to={`/invoices/${invoice.id}`}
                                onClick={() => setMenuOpen(null)}
                                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                              >
                                View invoice
                              </Link>

                              <Link
                                to={`/invoices/${invoice.id}?edit=true`}
                                onClick={() => setMenuOpen(null)}
                                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Edit invoice
                              </Link>

                              <button
                                onClick={() => handleDelete(invoice.id)}
                                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                Delete invoice
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>
        )}

        {/* Mobile cards */}
        {filteredInvoices.length > 0 && (
          <div className="space-y-3 md:hidden">
            {filteredInvoices.map((invoice) => {
              const { total } = calculateInvoiceTotals(invoice);

              return (
                <div
                  key={invoice.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                        {getInitial(invoice.customerName)}
                      </div>

                      <div>
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="font-bold text-slate-900"
                        >
                          {invoice.invoiceNumber}
                        </Link>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {invoice.customerName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setMenuOpen(
                          menuOpen === invoice.id ? null : invoice.id
                        )
                      }
                      className="rounded-lg px-2 py-1 text-lg text-slate-400 hover:bg-slate-100"
                      aria-label={`Actions for ${invoice.invoiceNumber}`}
                    >
                      ⋮
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Amount
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatCurrency(invoice, total)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Issued
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(invoice.issueDate)}
                      </p>
                    </div>
                  </div>

                  {menuOpen === invoice.id && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          onClick={() => setMenuOpen(null)}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                        >
                          View
                        </Link>

                        <Link
                          to={`/invoices/${invoice.id}?edit=true`}
                          onClick={() => setMenuOpen(null)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-600"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
