
import React, { forwardRef } from 'react';
import { Invoice } from '@/context/InvoiceContext';
import { formatDate } from '@/utils/helpers';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  invoice: Invoice;
  ref?: React.Ref<HTMLDivElement>;
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(({ invoice }, ref) => {
  const safeNumberFormat = (value: any, decimals = 2): string => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  return (
    <div 
      ref={ref}
      className="bg-white p-6 shadow-none w-[210mm] mx-auto my-0"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Invoice Page */}
      <div className="border border-gray-300 print:border-gray-700">
        <div className="flex justify-between items-start p-4">
          <div className="w-2/3">
            <div className="text-center">
              <h1 className="text-xl font-bold">Tax Invoice</h1>
            </div>
            <div className="mt-2">
              <p className="mb-1"><strong>IRN:</strong> {invoice.irn}</p>
              <p className="mb-1"><strong>Ack No:</strong> {invoice.ackNo}</p>
              <p className="mb-1"><strong>Ack Date:</strong> {formatDate(invoice.ackDate)}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Sakthi Gas Service</h3>
              <p className="text-sm">2/A Kalyanaraman Kovil Street, Old Bus Stand,</p>
              <p className="text-sm">Kumbakonam</p>
              <p className="text-sm">Tamil Nadu - 612001, India</p>
              <p className="text-sm">GSTIN: {invoice.sellerGstin}, State Code: 33</p>
              <p className="text-sm">Contact: {invoice.sellerContact}</p>
              <p className="text-sm">E-Mail: {invoice.sellerEmail}</p>
            </div>
            <div className="mt-2">
              <p className="font-bold">Bill To:</p>
              <p className="text-sm font-bold">{invoice.buyerName}</p>
              <p className="text-sm whitespace-pre-line">{invoice.buyerAddress}</p>
              <p className="text-sm">Tamil Nadu - 637204, India</p>
              <p className="text-sm">GSTIN: {invoice.buyerGstin}</p>
              <p className="text-sm">State Name: {invoice.buyerState}, Code: {invoice.buyerStateCode}</p>
            </div>
          </div>
          <div className="w-1/3 text-right">
            <div className="text-center mb-2">
              <h2 className="font-bold">e-Invoice</h2>
            </div>
            <div className="flex justify-end mb-2">
              <QRCodeSVG 
                value={`IRN:${invoice.irn}\nInvoice:${invoice.invoiceNo}`} 
                size={130}
              />
            </div>
            <div className="mb-2">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Invoice No.</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.invoiceNo}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Dated</td>
                    <td className="border border-gray-400 p-1 text-left">{formatDate(invoice.invoiceDate)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-4 pb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-400 p-1 text-center w-8">SI.</th>
                <th className="border border-gray-400 p-1 text-center">Description of Goods</th>
                <th className="border border-gray-400 p-1 text-center">HSN/SAC</th>
                <th className="border border-gray-400 p-1 text-center">Quantity</th>
                <th className="border border-gray-400 p-1 text-center">Rate<br />(Net of Tax)</th>
                <th className="border border-gray-400 p-1 text-center">Per</th>
                <th className="border border-gray-400 p-1 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`item-${item.id || index}`}>
                  <td className="border border-gray-400 p-1 text-center">{index + 1}</td>
                  <td className="border border-gray-400 p-1">{item.description}</td>
                  <td className="border border-gray-400 p-1 text-center">{item.hsnSac}</td>
                  <td className="border border-gray-400 p-1 text-center">{item.quantity} Nos</td>
                  <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(item.ratePerItem)}</td>
                  <td className="border border-gray-400 p-1 text-center">Nos</td>
                  <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(item.amount)}</td>
                </tr>
              ))}
              
              {/* Empty rows for alignment */}
              {invoice.items.length < 5 && Array.from({ length: 5 - invoice.items.length }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                  <td className="border border-gray-400 p-1">&nbsp;</td>
                </tr>
              ))}
              
              {/* Totals row */}
              <tr>
                <td className="border border-gray-400 p-1" colSpan={3}></td>
                <td className="border border-gray-400 p-1 text-right font-bold">Total</td>
                <td className="border border-gray-400 p-1"></td>
                <td className="border border-gray-400 p-1 text-center">
                  {invoice.items.reduce((sum, item) => sum + (parseFloat(item.quantity?.toString() || '0') || 0), 0)} Nos
                </td>
                <td className="border border-gray-400 p-1 text-right font-bold">
                  ₹ {safeNumberFormat(invoice.totalTaxableAmount)}
                </td>
              </tr>
              
              {/* Amount in words */}
              <tr>
                <td colSpan={7} className="border border-gray-400 p-1">
                  <div className="flex justify-between">
                    <div>
                      <strong>Amount Chargeable (in words)</strong><br />
                      {invoice.amountInWords}
                    </div>
                    <div className="text-right">
                      <strong>E & O E</strong>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          {/* Tax Summary Table */}
          <table className="w-full text-sm border-collapse mt-2">
            <thead>
              <tr>
                <th className="border border-gray-400 p-1">HSN/SAC</th>
                <th className="border border-gray-400 p-1">Taxable<br />Value</th>
                <th colSpan={2} className="border border-gray-400 p-1 text-center">CGST</th>
                <th colSpan={2} className="border border-gray-400 p-1 text-center">SGST/UTGST</th>
                <th className="border border-gray-400 p-1 text-center">Total<br />Tax Amount</th>
              </tr>
              <tr>
                <th className="border border-gray-400 p-1"></th>
                <th className="border border-gray-400 p-1"></th>
                <th className="border border-gray-400 p-1 text-center">Rate</th>
                <th className="border border-gray-400 p-1 text-center">Amount</th>
                <th className="border border-gray-400 p-1 text-center">Rate</th>
                <th className="border border-gray-400 p-1 text-center">Amount</th>
                <th className="border border-gray-400 p-1"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(invoice.items.map(item => item.hsnSac))).map((hsn, index) => {
                const itemsWithHsn = invoice.items.filter(item => item.hsnSac === hsn);
                const taxableValue = itemsWithHsn.reduce((sum, item) => sum + (parseFloat(item.amount?.toString() || '0') || 0), 0);
                const cgstAmount = (taxableValue * parseFloat(invoice.cgstRate?.toString() || '0')) / 100;
                const sgstAmount = (taxableValue * parseFloat(invoice.sgstRate?.toString() || '0')) / 100;
                
                return (
                  <tr key={`hsn-${index}`}>
                    <td className="border border-gray-400 p-1">{hsn}</td>
                    <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(taxableValue)}</td>
                    <td className="border border-gray-400 p-1 text-center">{invoice.cgstRate}%</td>
                    <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(cgstAmount)}</td>
                    <td className="border border-gray-400 p-1 text-center">{invoice.sgstRate}%</td>
                    <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(sgstAmount)}</td>
                    <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(cgstAmount + sgstAmount)}</td>
                  </tr>
                );
              })}
              
              {/* Total tax row */}
              <tr>
                <td className="border border-gray-400 p-1 text-right font-bold">Total</td>
                <td className="border border-gray-400 p-1 text-right font-bold">{safeNumberFormat(invoice.totalTaxableAmount)}</td>
                <td className="border border-gray-400 p-1"></td>
                <td className="border border-gray-400 p-1 text-right font-bold">{safeNumberFormat(invoice.cgstAmount)}</td>
                <td className="border border-gray-400 p-1"></td>
                <td className="border border-gray-400 p-1 text-right font-bold">{safeNumberFormat(invoice.sgstAmount)}</td>
                <td className="border border-gray-400 p-1 text-right font-bold">{safeNumberFormat(invoice.cgstAmount + invoice.sgstAmount)}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Tax Amount in Words and Bank Details */}
          <div className="mt-2">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2" colSpan={2}>
                    <p><strong>Tax Amount (in words):</strong> {invoice.amountInWords}</p>
                    <div className="mt-2">
                      <p><strong>Company's Bank Details</strong></p>
                      <p><strong>Bank Name:</strong> {invoice.bankName}</p>
                      <p><strong>A/c No.:</strong> {invoice.accountNo}</p>
                      <p><strong>Branch & IFS Code:</strong> {invoice.branchName} & {invoice.ifscCode}</p>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-2 align-bottom text-right">
                    <div className="mt-12 pt-4 border-t border-gray-400 inline-block text-center">
                      <p>for Sakthi Gas Service</p>
                      <p className="mb-1 font-bold">Authorized Signatory</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center text-xs mt-2">
            <p>This is a Computer Generated Invoice</p>
          </div>
        </div>
      </div>

      <style>
        {`
          @page {
            size: A4;
            margin: 10mm;
          }
          @media print {
            .page-break {
              page-break-before: always;
            }
          }
        `}
      </style>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';
