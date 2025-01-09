import { jsPDF } from 'jspdf';
import { formatCurrency } from './dateUtils';

export function generateBillPDF(customer, deliveries, rate, month) {
  const doc = new jsPDF();
  const totalQty = deliveries.reduce((sum, d) => sum + Number(d.qty_delivered), 0);
  const totalAmount = totalQty * rate;

  // Add content to PDF
  doc.setFontSize(20);
  doc.text('Milk Delivery Bill', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Month: ${month}`, 20, 40);
  doc.text(`Customer: ${customer.name}`, 20, 50);
  doc.text(`Phone: ${customer.phone}`, 20, 60);
  doc.text(`Address: ${customer.address}`, 20, 70);
  
  doc.text('Delivery Details:', 20, 90);
  doc.text(`Total Quantity: ${totalQty} liters`, 20, 100);
  doc.text(`Rate per liter: ${formatCurrency(rate)}`, 20, 110);
  doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 20, 120);
  
  return doc;
}