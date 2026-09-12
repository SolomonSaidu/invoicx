import { jsPDF } from 'jspdf';
import type { Invoice } from '../types/invoice';
import { calculateInvoiceTotals } from './invoiceCalculations';

export const generatePDF = (invoice: Invoice) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totals = calculateInvoiceTotals(invoice);

  // Colors
  const primaryColor = '#1e3a8a'; // Dark blue
  const textColor = '#1f2937'; // Gray 800
  const lightTextColor = '#4b5563'; // Gray 600
  const borderColor = '#e5e7eb'; // Gray 200

  // Margins & Dimensions
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper functions
  const drawLine = (yPos: number) => {
    doc.setDrawColor(borderColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };

  const addText = (text: string, x: number, yPos: number, options?: { align?: 'left' | 'right' | 'center'; fontStyle?: string; fontSize?: number; color?: string }) => {
    const fontSize = options?.fontSize || 10;
    const fontStyle = options?.fontStyle || 'normal';
    const align = options?.align || 'left';
    const color = options?.color || textColor;

    doc.setFontSize(fontSize);
    doc.setFont('Helvetica', fontStyle);
    doc.setTextColor(color);
    doc.text(text, x, yPos, { align });
  };

  // Header - Business Details
  addText(invoice.businessName, margin, y + 5, { fontSize: 20, fontStyle: 'bold', color: primaryColor });
  
  // Header - Invoice Title & Meta
  addText('INVOICE', pageWidth - margin, y + 5, { align: 'right', fontSize: 22, fontStyle: 'bold', color: lightTextColor });
  addText(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - margin, y + 12, { align: 'right', fontSize: 10 });
  addText(`Date: ${invoice.issueDate}`, pageWidth - margin, y + 18, { align: 'right', fontSize: 10 });
  if (invoice.dueDate) {
    addText(`Due Date: ${invoice.dueDate}`, pageWidth - margin, y + 24, { align: 'right', fontSize: 10 });
  }

  // Business Address Details (Left side under business name)
  let businessY = y + 12;
  if (invoice.businessAddress) {
    addText(invoice.businessAddress, margin, businessY, { fontSize: 9, color: lightTextColor });
    businessY += 5;
  }
  if (invoice.businessEmail) {
    addText(invoice.businessEmail, margin, businessY, { fontSize: 9, color: lightTextColor });
    businessY += 5;
  }
  if (invoice.businessPhone) {
    addText(invoice.businessPhone, margin, businessY, { fontSize: 9, color: lightTextColor });
  }

  y = Math.max(businessY, y + 24) + 15;
  drawLine(y);
  y += 10;

  // Bill To Section
  addText('BILL TO', margin, y, { fontSize: 8, fontStyle: 'bold', color: lightTextColor });
  y += 6;
  addText(invoice.customerName, margin, y, { fontSize: 11, fontStyle: 'bold' });
  y += 5;
  if (invoice.customerAddress) {
    addText(invoice.customerAddress, margin, y, { fontSize: 9, color: lightTextColor });
    y += 5;
  }
  if (invoice.customerEmail) {
    addText(invoice.customerEmail, margin, y, { fontSize: 9, color: lightTextColor });
    y += 5;
  }
  if (invoice.customerPhone) {
    addText(invoice.customerPhone, margin, y, { fontSize: 9, color: lightTextColor });
    y += 5;
  }

  y += 10;

  // Items Table Header
  doc.setFillColor('#f3f4f6');
  doc.rect(margin, y, contentWidth, 8, 'F');
  
  addText('Description', margin + 2, y + 5.5, { fontStyle: 'bold', fontSize: 9 });
  addText('Qty', margin + 90, y + 5.5, { align: 'right', fontStyle: 'bold', fontSize: 9 });
  addText('Unit Price', margin + 125, y + 5.5, { align: 'right', fontStyle: 'bold', fontSize: 9 });
  addText('Amount', pageWidth - margin - 2, y + 5.5, { align: 'right', fontStyle: 'bold', fontSize: 9 });

  y += 8;

  // Items Table Body
  invoice.items.forEach((item) => {
    // Check if we need a page break (simple check)
    if (y > 250) {
      doc.addPage();
      y = margin;
      
      // Draw table header again on new page
      doc.setFillColor('#f3f4f6');
      doc.rect(margin, y, contentWidth, 8, 'F');
      addText('Description', margin + 2, y + 5.5, { fontStyle: 'bold', fontSize: 9 });
      addText('Qty', margin + 90, y + 5.5, { align: 'right', fontStyle: 'bold', fontSize: 9 });
      addText('Unit Price', margin + 125, y + 5.5, { align: 'right', fontStyle: 'bold', fontSize: 9 });
      addText('Amount', pageWidth - margin - 2, y + 5.5, { align: 'right', fontStyle: 'bold', fontSize: 9 });
      y += 8;
    }

    const amount = item.quantity * item.unitPrice;
    addText(item.description, margin + 2, y + 6, { fontSize: 9 });
    addText(item.quantity.toString(), margin + 90, y + 6, { align: 'right', fontSize: 9 });
    addText(item.unitPrice.toFixed(2), margin + 125, y + 6, { align: 'right', fontSize: 9 });
    addText(amount.toFixed(2), pageWidth - margin - 2, y + 6, { align: 'right', fontSize: 9 });

    y += 8;
    drawLine(y);
  });

  y += 10;

  // Totals & Notes Layout
  // Left side: Notes, Right side: Totals
  const leftColWidth = contentWidth * 0.5;
  const rightColStart = pageWidth - margin - 60;

  let totalsY = y;

  // Subtotal
  addText('Subtotal', rightColStart, totalsY, { fontSize: 9 });
  addText(totals.subtotal.toFixed(2), pageWidth - margin - 2, totalsY, { align: 'right', fontSize: 9 });
  totalsY += 6;

  // Discount
  if (totals.discountAmount > 0) {
    const discountText = invoice.discountType === 'percentage' 
      ? `Discount (${invoice.discountValue}%)` 
      : 'Discount';
    addText(discountText, rightColStart, totalsY, { fontSize: 9 });
    addText(`-${totals.discountAmount.toFixed(2)}`, pageWidth - margin - 2, totalsY, { align: 'right', fontSize: 9 });
    totalsY += 6;
  }

  // Tax
  if (invoice.taxRate > 0) {
    addText(`Tax (${invoice.taxRate}%)`, rightColStart, totalsY, { fontSize: 9 });
    addText(totals.taxAmount.toFixed(2), pageWidth - margin - 2, totalsY, { align: 'right', fontSize: 9 });
    totalsY += 6;
  }

  // Total
  totalsY += 2;
  doc.setDrawColor(textColor);
  doc.setLineWidth(0.5);
  doc.line(rightColStart, totalsY - 1, pageWidth - margin, totalsY - 1);
  
  addText('Total', rightColStart, totalsY + 4, { fontStyle: 'bold', fontSize: 11, color: primaryColor });
  addText(`${invoice.currency} ${totals.total.toFixed(2)}`, pageWidth - margin - 2, totalsY + 4, { align: 'right', fontStyle: 'bold', fontSize: 11, color: primaryColor });

  // Notes (Only if notes exist, drawn on the left side)
  if (invoice.notes) {
    addText('NOTES', margin, y, { fontSize: 8, fontStyle: 'bold', color: lightTextColor });
    const splitNotes = doc.splitTextToSize(invoice.notes, leftColWidth);
    doc.setFontSize(8.5);
    doc.setTextColor(textColor);
    doc.setFont('Helvetica', 'normal');
    doc.text(splitNotes, margin, y + 5);
  }

  // Save the PDF
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
};
