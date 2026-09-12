# Invoix

Invoix is a modern, responsive client-side web application designed for freelancers, small businesses, contractors, and Nigerian SMEs to create, preview, save, and download professional invoices without the overhead of spreadsheets or complex accounting systems.

---

## 🚀 Features

- **Landing Page:** Professional, marketing-oriented landing page explaining key selling points and how it works.
- **Invoice Creation:** Clean, two-column layout showing the entry form side-by-side with a real-time updating live preview.
- **Client-Side Calculations:** Automates calculation of item subtotals, custom discounts (percentage/fixed), and taxes (VAT/sales tax rate).
- **Persistent Storage:** Instantly saves invoices locally, maintaining your draft or completed list across page reloads.
- **Manage Invoices:** A centralized dashboard to view, edit, update, or safely delete previously saved invoices.
- **Direct PDF Download:** Generates vector-based, clean, high-resolution selectable PDFs natively in the browser.
- **Fully Responsive:** Beautiful layout tailored to smartphones, tablets, and desktops.
- **Accessibility Integration:** Semantic elements with focus indicators and accessible form labels.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev)
- **Language:** [TypeScript](https://www.typescriptlang.org) (strict types)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (utility-first, modern config)
- **Routing:** [React Router 7](https://reactrouter.com)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) (vector-drawn client-side exports)

---

## 🏗️ Architecture Overview

The codebase is organized into highly modular, decoupled directories:

- `src/components/invoice/`: Contains layout and visual components (such as `InvoicePreview`) that visually mock real-world printed invoices.
- `src/components/ui/`: Contains highly reusable elements, like our accessible `Input` component.
- `src/hooks/`: Abstracted business workflows (e.g., `useInvoiceForm.ts`) to cleanly manage invoice state.
- `src/lib/`: Abstraction layers for storage (`storage.ts`).
- `src/pages/`: Standard pages routing (`LandingPage`, `CreateInvoicePage`, `InvoiceListPage`, `InvoiceDetailPage`).
- `src/utils/`: Pure utility functions for calculations (`invoiceCalculations.ts`), validation (`validation.ts`), and PDF compilation (`pdfGenerator.ts`).

### Storage Approach
Invoix leverages the browser's built-in `localStorage` through a clean, unified storage abstraction layer in `src/lib/storage.ts`. All invoices are indexed by a cryptographically secure `crypto.randomUUID()`. Saving edits safely overrides the existing record by ID instead of generating duplicates.

### PDF Approach
We avoid low-resolution HTML-to-image screenshots. The application utilizes native canvas/text drawing with `jsPDF` to assemble a vector PDF directly. This guarantees that text remains selectable, vector lines are razor-sharp, and the output scales smoothly without pixelation.

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Invoix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`.

---

## 📦 Available Scripts

- `npm run dev`: Runs the Vite server in development watch mode.
- `npm run build`: Validates TypeScript rules and compiles the application into the optimized `dist/` production folder.
- `npm run preview`: Locally previews the compiled production build.
- `npm run lint`: Evaluates source code matching modern ESLint criteria.

---

## 🔒 Security & Privacy

Since Invoix runs entirely client-side:
- **No external servers** are reached.
- **Zero personal, client, or monetary data** ever leaves your web browser.
- All stored documents live safely in your browser's private `localStorage`.

---

## 🔮 Future Improvements

- **Template Selection:** Introduce different aesthetic invoice layout styles.
- **Client Directory:** Auto-saving regular clients for quick creation select lists.
- **Multi-currency Converter:** Add integration with real-time conversion rates.
- **Tax Templates:** Region-specific pre-configured tax configurations.
