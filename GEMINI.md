# Invoix — Gemini Build Instructions

## 1. Role

You are the primary implementation engineer for Invoix. Build the application from this specification.

Important:
- Follow this document as the source of truth.
- Do not add features outside the MVP without explicit approval.
- Prefer simple, maintainable solutions over unnecessary abstractions.
- Do not replace the chosen stack unless there is a strong technical reason.
- Build production-quality frontend code, not a throwaway prototype.

## 2. Product

Invoix is a responsive web application for freelancers and small businesses to create professional invoices quickly, save them locally, preview them live, and download them as PDFs.

Core value:
Enter business/customer/item information → automatically calculate totals → preview → save → download.

Target users:
- Freelancers
- Small businesses
- Shops
- Service providers
- Contractors
- Nigerian SMEs

## 3. MVP Scope

### Must implement
- Landing page
- Invoice creation
- Business information
- Customer information
- Invoice information
- Invoice items
- Automatic subtotal calculation
- Discount
- Tax
- Currency selection
- Notes
- Live invoice preview
- Save invoices
- View saved invoices
- Edit saved invoices
- Delete invoices
- Invoice details page
- PDF download
- Form validation
- Responsive/mobile UI
- Empty states
- Useful error/validation states
- Accessible form controls

### Explicitly DO NOT implement in V1
- Authentication
- Backend
- Database
- Online payments
- Email sending
- Subscriptions
- Team accounts
- Multi-business accounts
- Analytics
- AI features
- Admin dashboard

Use localStorage for persistence.

## 4. Tech Stack

Use:
- React
- TypeScript
- Tailwind CSS
- Client-side routing
- localStorage
- A suitable client-side PDF generation solution

Do not introduce a backend.

Use strict TypeScript where practical. Avoid `any` unless genuinely unavoidable.

## 5. Routes

Implement these routes:

/
 /create
 /invoices
 /invoices/:id

Expected behavior:
- `/` = landing page
- `/create` = create new invoice
- `/invoices` = saved invoices
- `/invoices/:id` = view/edit a saved invoice

Handle invalid/nonexistent invoice IDs gracefully.

## 6. Visual Direction

The application should look like a polished modern SaaS product.

Design principles:
- Clean
- Professional
- Minimal
- Responsive
- Excellent spacing
- Strong visual hierarchy
- Consistent typography
- Clear primary actions
- Subtle interactions
- Accessible contrast

Avoid:
- Excessive gradients
- Excessive glassmorphism
- Random colors
- Huge unnecessary animations
- Over-designed dashboards
- Decorative UI that doesn't help the workflow

The invoice itself should look like a real professional document.

## 7. Landing Page

### Hero
Headline:
"Create professional invoices in minutes."

Supporting text:
"Create, customize and download invoices without spreadsheets or complicated accounting software."

Primary CTA:
"Create an Invoice"

Secondary CTA:
"View My Invoices"

### Features
Include cards for:
- Fast
- Professional
- Simple

### How it works
1. Enter your details
2. Add your products/services
3. Download your invoice

### Final CTA
"Ready to create your first invoice?"
Button: "Create Invoice"

## 8. Create Invoice Page

Use a two-column layout on desktop:
- Left: invoice form
- Right: live invoice preview

On mobile:
- Form first
- Preview second

The preview must update immediately as form state changes.

### Business Information
Fields:
- Business name — required
- Business email
- Business phone
- Business address
- Business logo — optional

### Customer Information
Fields:
- Customer name — required
- Customer email
- Customer phone
- Customer address

### Invoice Information
Fields:
- Invoice number — required
- Issue date — default to current date
- Due date — optional
- Currency — default NGN

Supported currencies:
- NGN
- USD
- GBP
- EUR

### Items
Each invoice item contains:
- Description — required
- Quantity — must be greater than 0
- Unit price — must be >= 0
- Amount — derived automatically

Formula:
amount = quantity × unit price

Actions:
- Add Item
- Remove Item

### Discount
Support:
- Percentage discount
- Fixed amount discount

Percentage must be between 0 and 100.

### Tax
Tax is entered as a percentage.

Valid range:
0–100%.

### Notes
Optional textarea for additional customer-facing notes.

## 9. Calculations

The application must derive all financial values from invoice state.

Subtotal:
sum of all item amounts.

For percentage discount:
discountAmount = subtotal × discountRate / 100

For fixed discount:
discountAmount = fixed discount value

Taxable amount:
subtotal - discountAmount

Tax:
taxableAmount × taxRate / 100

Total:
taxableAmount + taxAmount

Never allow the displayed total to become negative.

Use appropriate numeric handling. Avoid common floating-point display problems.

Format currency consistently according to the selected currency.

## 10. Invoice Preview

Preview should resemble a real printable invoice.

Structure:

Header:
- Business name
- Business contact information
- "INVOICE"
- Invoice number

Dates:
- Issue date
- Due date when supplied

Customer:
"Bill To"
- Customer name
- Email
- Phone
- Address

Items table:
- Description
- Quantity
- Unit price
- Amount

Totals:
- Subtotal
- Discount
- Tax
- Total

Footer:
- Notes
- Business contact information where appropriate

If information is missing, do not render awkward empty labels.

## 11. Saving

Use localStorage.

Create a clear storage abstraction instead of scattering raw localStorage operations throughout components.

Persist:
- Invoice ID
- Invoice number
- Dates
- Currency
- Business details
- Customer details
- Items
- Discount
- Tax
- Notes
- createdAt
- updatedAt

Saved invoices must survive browser refresh.

When saving a new invoice:
- Generate a unique application ID.
- Preserve the invoice number supplied by the user.
- Do not silently overwrite another invoice with the same application ID.

## 12. Saved Invoices Page

Route:
`/invoices`

Header:
"My Invoices"

Primary CTA:
"+ Create Invoice"

Display each invoice with:
- Invoice number
- Customer name
- Total
- Date
- Useful status if implemented

Actions:
- View
- Edit
- Delete

If there are no invoices, show a useful empty state:
"You haven't created any invoices yet."
CTA:
"Create your first invoice"

Do not make the empty state look like an error.

## 13. Invoice Details Page

Route:
`/invoices/:id`

Show the saved invoice using the same invoice preview component.

Actions:
- Edit
- Download PDF
- Delete
- Back to invoices

If the ID doesn't exist:
- Show a clear not-found state.
- Provide a way back to the invoice list.

## 14. Editing

Editing a saved invoice must:
- Load the complete invoice into the form.
- Preserve its application ID.
- Update `updatedAt`.
- Save changes back to localStorage.
- Reflect changes immediately in the preview.

Do not accidentally create a duplicate invoice when editing.

## 15. PDF

Implement a real PDF download, not a screenshot of the webpage.

Requirements:
- Professional document layout
- Business information
- Customer information
- Items
- Calculations
- Notes
- Correct currency
- Good page margins
- Readable typography
- Multi-item invoices must remain usable
- Long notes/items should not create broken output

The PDF should visually correspond to the invoice preview as closely as practical.

## 16. Validation

Required:
- Business name
- Customer name
- Invoice number
- At least one invoice item
- Item description

Numeric:
- Quantity > 0
- Unit price >= 0
- Tax 0–100
- Percentage discount 0–100
- Fixed discount >= 0

Do not rely exclusively on HTML validation. Provide useful user-facing validation messages.

Do not allow invalid invoice data to be saved.

## 17. Error Handling

Handle:
- Invalid form input
- Invalid localStorage data
- Missing invoice IDs
- PDF generation failures
- Corrupt/old stored data

The UI should fail gracefully rather than crashing the whole application.

If localStorage contains malformed data, recover safely where possible.

## 18. Accessibility

Requirements:
- Semantic HTML
- Labels associated with inputs
- Keyboard accessible controls
- Visible focus states
- Buttons must have clear accessible names
- Do not use color alone to communicate meaning
- Reasonable heading hierarchy
- Accessible modal/dialog behavior if dialogs are used

## 19. Responsive Requirements

Must work well at:
- Mobile
- Tablet
- Desktop

Pay special attention to:
- Invoice table overflow
- Form layout
- Preview width
- Navigation
- Buttons
- Long business/customer names
- Small screens

Do not allow accidental horizontal page overflow.

## 20. Component Architecture

Use reusable components where repetition exists.

Potential structure:

src/
  components/
    invoice/
    forms/
    layout/
    ui/
  pages/
  hooks/
  lib/
  types/
  utils/

This is guidance, not a rigid requirement.

Important:
- Keep business logic separate from presentational components where practical.
- Centralize invoice calculations.
- Centralize localStorage persistence.
- Reuse the invoice preview for both creation and saved invoice viewing.
- Avoid giant components.

## 21. State Management

Do not introduce Redux or another large state-management solution unless clearly necessary.

For MVP, React state/context or another lightweight approach is sufficient.

Keep the invoice state predictable and typed.

Derived values such as subtotal, discount amount, tax amount and total should not be independently editable state.

## 22. Data Integrity

Use stable IDs for:
- invoices
- invoice items

When deleting an item:
- update invoice state
- recalculate totals

When editing:
- preserve invoice ID

When creating:
- generate a new ID

Never use array indexes as persistent invoice/item IDs.

## 23. UX Details

Provide:
- Clear save feedback
- Clear delete confirmation
- Disabled states where an action cannot be performed
- Loading/progress feedback if PDF generation takes noticeable time
- Unsaved-change protection where practical
- Helpful empty states

Do not over-engineer these features.

## 24. Security/Privacy

No sensitive data should be sent to a backend because there is no backend.

Explain through UI copy where appropriate that invoices are stored locally in the user's browser.

Do not log invoice/customer information unnecessarily.

## 25. Testing Checklist

Before considering V1 complete, manually verify:

1. Create an invoice with one item.
2. Create an invoice with multiple items.
3. Add an item.
4. Remove an item.
5. Change quantity.
6. Change unit price.
7. Apply percentage discount.
8. Apply fixed discount.
9. Apply tax.
10. Change currency.
11. Save invoice.
12. Refresh browser.
13. Verify invoice remains.
14. Open invoice.
15. Edit invoice.
16. Verify no duplicate is created.
17. Delete invoice.
18. Test empty invoices state.
19. Test invalid invoice ID.
20. Test malformed localStorage data.
21. Download PDF.
22. Check PDF contents.
23. Test long descriptions.
24. Test long customer/business names.
25. Test mobile layout.
26. Test keyboard navigation.
27. Check browser console for avoidable errors.

## 26. Performance

Keep the application lightweight.

Avoid:
- unnecessary dependencies
- unnecessary re-renders
- huge image assets
- excessive animation
- duplicated calculations

Optimize only where there is an actual reason.

## 27. Documentation

Create a useful README containing:
- Product overview
- Features
- Tech stack
- Local setup
- Available scripts
- Architecture overview
- Storage approach
- PDF approach
- Known limitations
- Future improvements

Do not write fake production metrics or fake testimonials.

## 28. Git Hygiene

Use meaningful commits where possible.

Do not commit:
- `.env`
- secrets
- generated sensitive data
- unnecessary build artifacts

The repository should look like a professional portfolio project.

## 29. Development Workflow

Build in phases:

### Phase 1 — Foundation
- Project setup
- Dependencies
- Routing
- Global styles
- Layout
- Basic pages

### Phase 2 — Invoice Creation
- Typed invoice model
- Form
- Items
- Calculations
- Validation

### Phase 3 — Preview
- Professional invoice preview
- Responsive preview

### Phase 4 — Persistence
- localStorage abstraction
- Save
- List
- View
- Edit
- Delete

### Phase 5 — PDF
- PDF generation
- PDF quality testing

### Phase 6 — Polish
- Accessibility
- Responsive fixes
- Empty/error states
- UX improvements
- README
- Final cleanup

Do not jump randomly between phases.

## 30. AI Coding Rules

AI assistance is allowed and expected, but implementation quality matters.

When generating code:
- Explain important architectural decisions briefly.
- Prefer small, focused changes.
- Do not rewrite unrelated files.
- Do not introduce dependencies without explaining why.
- Do not generate duplicate utilities.
- Reuse existing components.
- Respect existing project conventions.
- After significant changes, verify the affected functionality.

If a requirement is ambiguous:
- Choose the simplest reasonable interpretation.
- Document the assumption.
- Do not invent major product features.

## 31. Final Definition of Done

Invoix V1 is complete only when:
- All four routes work.
- Invoice creation works.
- Calculations are correct.
- Validation works.
- Preview is professional.
- Saving works across refreshes.
- Viewing/editing/deleting works.
- PDF download works.
- Mobile layout works.
- Error/empty states work.
- Accessibility basics are implemented.
- No obvious console/runtime errors remain.
- README is complete.
- The app is ready to deploy.
