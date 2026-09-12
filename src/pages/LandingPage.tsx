import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-blue-50 via-slate-50 to-slate-50" />

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Hero content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Free · No signup · Works offline
              </div>

              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                Professional invoices.
                <span className="block text-blue-600">
                  Without the headache.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Create beautiful, professional invoices in minutes. Save them
                locally, customize your details, and download ready-to-send
                PDFs without creating an account.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25"
                >
                  Create an invoice
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/invoices"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  View my invoices
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span>✓ PDF export</span>
                <span>✓ Saved locally</span>
                <span>✓ No account required</span>
              </div>
            </div>

            {/* Invoice preview */}
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-blue-200/30 blur-3xl" />

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
                <div className="rounded-xl border border-slate-100 bg-white p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-xl font-bold tracking-tight text-slate-950">
                        Solomon Studio
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        solomon@example.com
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold tracking-tight text-slate-950">
                        INVOICE
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        #INV-0024
                      </div>
                    </div>
                  </div>

                  <div className="my-7 h-px bg-slate-200" />

                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Bill To
                      </p>
                      <p className="font-semibold text-slate-800">
                        Acme Ltd
                      </p>
                      <p className="text-slate-500">acme@example.com</p>
                    </div>

                    <div className="text-right">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Due Date
                      </p>
                      <p className="font-semibold text-slate-800">
                        September 26, 2026
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 overflow-hidden rounded-lg border border-slate-100">
                    <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="col-span-7">Description</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-3 text-right">Amount</span>
                    </div>

                    <div className="divide-y divide-slate-100 text-sm">
                      <div className="grid grid-cols-12 px-4 py-3.5">
                        <span className="col-span-7 font-medium text-slate-700">
                          Website Design
                        </span>
                        <span className="col-span-2 text-center text-slate-500">
                          1
                        </span>
                        <span className="col-span-3 text-right font-medium text-slate-700">
                          ₦80,000
                        </span>
                      </div>

                      <div className="grid grid-cols-12 px-4 py-3.5">
                        <span className="col-span-7 font-medium text-slate-700">
                          UI Development
                        </span>
                        <span className="col-span-2 text-center text-slate-500">
                          2
                        </span>
                        <span className="col-span-3 text-right font-medium text-slate-700">
                          ₦100,000
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className="w-48 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal</span>
                        <span>₦180,000</span>
                      </div>

                      <div className="flex justify-between text-slate-500">
                        <span>Tax</span>
                        <span>₦0</span>
                      </div>

                      <div className="my-2 h-px bg-slate-200" />

                      <div className="flex justify-between text-base font-bold text-slate-950">
                        <span>Total</span>
                        <span>₦180,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    Thank you for your business.
                  </div>
                </div>
              </div>

              {/* Floating saved indicator */}
              <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-600">
                  ✓
                </span>
                Saved locally
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Invoicing without the unnecessary complexity.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Invoix gives freelancers and small businesses the essentials
              without turning a simple invoice into an accounting project.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '⚡',
                title: 'Create in minutes',
                description:
                  'Enter your business, customer, and item details and have a professional invoice ready quickly.',
              },
              {
                icon: '📄',
                title: 'Professional PDFs',
                description:
                  'Generate clean, polished invoices that are ready to download, print, or send to your clients.',
              },
              {
                icon: '💾',
                title: 'Saved locally',
                description:
                  'Your invoices stay in your browser. No account or cloud storage required.',
              },
              {
                icon: '🧮',
                title: 'Automatic calculations',
                description:
                  'Quantities, prices, subtotals, taxes, discounts, and totals are calculated for you.',
              },
              {
                icon: '🎨',
                title: 'Built for your brand',
                description:
                  'Create invoices that look professional and represent your business properly.',
              },
              {
                icon: '📱',
                title: 'Works everywhere',
                description:
                  'Create and manage invoices from your desktop, tablet, or phone.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-slate-200">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Built for real work
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Whether you're freelancing or running a small business.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Invoix is designed for people who need to send professional
                invoices without learning complicated accounting software.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                'Freelancers',
                'Small businesses',
                'Consultants',
                'Creators',
                'Developers',
                'Contractors',
              ].map((audience) => (
                <div
                  key={audience}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700 shadow-sm"
                >
                  {audience}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From blank page to invoice in three steps.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Enter your details',
                description:
                  'Add your business information, customer details, invoice number, and dates.',
              },
              {
                number: '02',
                title: 'Add your items',
                description:
                  'Add products or services with quantities and prices. Invoix handles the calculations.',
              },
              {
                number: '03',
                title: 'Download and send',
                description:
                  'Review the live preview, save your invoice, and download a professional PDF.',
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-black tracking-tight text-blue-100">
                  {step.number}
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy / local-first */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
                🔒
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Your invoices stay yours.
              </h2>

              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                Invoix is local-first. Your invoice data is stored directly in
                your browser instead of being uploaded to a server.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="space-y-4">
                {[
                  'No account required',
                  'No complicated setup',
                  'Invoices saved on your device',
                  'Export professional PDFs',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-slate-200"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Your next invoice is
            <span className="text-blue-600"> minutes away.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Create a professional invoice without signing up, installing
            software, or dealing with complicated accounting tools.
          </p>

          <div className="mt-8">
            <Link
              to="/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl"
            >
              Create your first invoice
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Free · No signup · No credit card
          </p>
        </div>
      </section>
    </div>
  );
};
