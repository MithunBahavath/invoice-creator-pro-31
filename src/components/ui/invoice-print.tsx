
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
      {/* Page 1: Invoice */}
      <div className="border border-gray-300 print:border-gray-700">
        <div className="flex justify-between p-4 border-b border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-sm"># {invoice.invoiceNo}</p>
            <p className="text-sm mt-1">Date: {formatDate(invoice.invoiceDate)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-purple-600">AGNEE GAS DISTRIBUTER</h2>
            <p className="text-sm text-gray-600">
              3/168B IRRUKUR, PARAMATHI VELUR, NAMAKKAL, Tamil Nadu - 637204, India
            </p>
            <p className="text-sm text-gray-600">GSTIN: {invoice.sellerGstin}</p>
            <p className="text-sm text-gray-600">Phone: {invoice.sellerContact}</p>
            <p className="text-sm text-gray-600">Email: {invoice.sellerEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-300 bg-gray-50">
          <div>
            <p className="text-sm font-semibold">Invoice No.</p>
            <p className="text-sm">{invoice.invoiceNo}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">e-Way Bill No.</p>
            <p className="text-sm">{invoice.eWayBillNo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">IRN</p>
            <p className="text-sm truncate">{invoice.irn}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-4 border-b border-gray-300">
          <div>
            <h3 className="text-sm font-semibold uppercase">BILL TO:</h3>
            <p className="font-bold text-lg">{invoice.buyerName}</p>
            <p className="whitespace-pre-line text-sm">{invoice.buyerAddress}</p>
            <p className="text-sm">GSTIN: {invoice.buyerGstin}</p>
            <p className="text-sm">State: {invoice.buyerState}, Code: {invoice.buyerStateCode}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold uppercase">E-INVOICE</h3>
            <div className="w-24 h-24 ml-auto">
              <QRCodeSVG 
                value={`IRN:${invoice.irn}\nInvoice:${invoice.invoiceNo}`} 
                size={96}
              />
            </div>
            <p className="text-xs mt-1">
              Ack No: {invoice.ackNo}<br />
              Ack Date: {formatDate(invoice.ackDate)}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-4 border-b border-gray-300">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 px-3 border border-gray-300 text-left">Sl No.</th>
                <th className="py-2 px-3 border border-gray-300 text-left">Description</th>
                <th className="py-2 px-3 border border-gray-300 text-left">HSN/SAC</th>
                <th className="py-2 px-3 border border-gray-300 text-left">Qty</th>
                <th className="py-2 px-3 border border-gray-300 text-right">Rate (₹)</th>
                <th className="py-2 px-3 border border-gray-300 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`item-${item.id || index}`}>
                  <td className="py-2 px-3 border border-gray-300">{item.slNo}</td>
                  <td className="py-2 px-3 border border-gray-300">{item.description}</td>
                  <td className="py-2 px-3 border border-gray-300">{item.hsnSac}</td>
                  <td className="py-2 px-3 border border-gray-300">{item.quantity} Nos</td>
                  <td className="py-2 px-3 border border-gray-300 text-right">{safeNumberFormat(item.ratePerItem)}</td>
                  <td className="py-2 px-3 border border-gray-300 text-right">{safeNumberFormat(item.amount)}</td>
                </tr>
              ))}
              
              {/* Empty rows for alignment */}
              {invoice.items.length < 5 && Array.from({ length: 5 - invoice.items.length }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="py-2 px-3 border border-gray-300">&nbsp;</td>
                  <td className="py-2 px-3 border border-gray-300">&nbsp;</td>
                  <td className="py-2 px-3 border border-gray-300">&nbsp;</td>
                  <td className="py-2 px-3 border border-gray-300">&nbsp;</td>
                  <td className="py-2 px-3 border border-gray-300">&nbsp;</td>
                  <td className="py-2 px-3 border border-gray-300">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Summary and Totals */}
        <div className="grid grid-cols-2 p-4 border-b border-gray-300">
          <div>
            <h3 className="text-sm font-semibold uppercase mb-2">TAX SUMMARY</h3>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-3 border border-gray-300 text-left">HSN/SAC</th>
                  <th className="py-2 px-3 border border-gray-300 text-right">Taxable Value</th>
                  <th className="py-2 px-3 border border-gray-300 text-right">CGST</th>
                  <th className="py-2 px-3 border border-gray-300 text-right">SGST</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.length > 0 && Array.from(
                  new Set(invoice.items.map(item => item.hsnSac))
                ).map((hsn, index) => {
                  const itemsWithHsn = invoice.items.filter(item => item.hsnSac === hsn);
                  const taxableValue = itemsWithHsn.reduce((sum, item) => sum + (parseFloat(item.amount?.toString() || '0') || 0), 0);
                  const cgstAmount = (taxableValue * parseFloat(invoice.cgstRate?.toString() || '0')) / 100;
                  const sgstAmount = (taxableValue * parseFloat(invoice.sgstRate?.toString() || '0')) / 100;
                  
                  return (
                    <tr key={`hsn-${index}`}>
                      <td className="py-2 px-3 border border-gray-300">{hsn}</td>
                      <td className="py-2 px-3 border border-gray-300 text-right">{safeNumberFormat(taxableValue)}</td>
                      <td className="py-2 px-3 border border-gray-300 text-right">{safeNumberFormat(cgstAmount)}</td>
                      <td className="py-2 px-3 border border-gray-300 text-right">{safeNumberFormat(sgstAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="pl-8">
            <div className="ml-auto w-64">
              <div className="flex justify-between py-2">
                <div className="font-semibold">Subtotal:</div>
                <div>₹ {safeNumberFormat(invoice.totalTaxableAmount)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="font-semibold">CGST ({invoice.cgstRate}%):</div>
                <div>₹ {safeNumberFormat(invoice.cgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="font-semibold">SGST ({invoice.sgstRate}%):</div>
                <div>₹ {safeNumberFormat(invoice.sgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="font-semibold">Rounded Off:</div>
                <div>₹ ({Math.abs(parseFloat(invoice.roundedOff?.toString() || '0')).toFixed(2)})</div>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-800">
                <div>Total:</div>
                <div>₹ {safeNumberFormat(invoice.totalAmount)}</div>
              </div>
              <div className="mt-2 text-sm italic text-gray-600">
                Amount in words: <span className="font-semibold">{invoice.amountInWords}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-sm font-semibold uppercase mb-2">BANK DETAILS</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Bank Name:</span> {invoice.bankName}</p>
              <p><span className="font-semibold">Account No:</span> {invoice.accountNo}</p>
            </div>
            <div>
              <p><span className="font-semibold">IFSC Code:</span> {invoice.ifscCode}</p>
              <p><span className="font-semibold">Branch:</span> {invoice.branchName}</p>
            </div>
          </div>
        </div>

        {/* Terms and Signature */}
        <div className="grid grid-cols-2 p-4">
          <div>
            <h3 className="text-sm font-semibold uppercase mb-2">TERMS & CONDITIONS</h3>
            <ol className="text-xs text-gray-600 list-decimal pl-4">
              <li>Goods once sold will not be taken back.</li>
              <li>Interest will be charged @18% p.a. if payment is not made within due date.</li>
              <li>All disputes are subject to local jurisdiction only.</li>
            </ol>
          </div>
          <div className="text-right">
            <p className="font-semibold mb-12">For {invoice.sellerName}</p>
            <p className="mt-2 pt-2 border-t border-gray-400 inline-block">
              Authorised Signatory
            </p>
          </div>
        </div>
      </div>

      {/* Page 2: e-Way Bill */}
      <div className="page-break mt-8 border border-gray-300 print:border-gray-700">
        <div className="bg-gray-100 p-4 border-b border-gray-300 text-center">
          <h1 className="text-xl font-bold">e-Way Bill</h1>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-4 border-r border-gray-300">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2">Doc No.</td>
                  <td>: Tax Invoice - {invoice.invoiceNo}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Date</td>
                  <td>: {formatDate(invoice.invoiceDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end">
            <div className="w-32 h-32">
              <QRCodeSVG 
                value={`EWB:${invoice.eWayBillNo || 'NA'}`} 
                size={128} 
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 bg-gray-50">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="font-semibold pr-2 w-24">IRN</td>
                <td>: {invoice.irn}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-2">Ack No.</td>
                <td>: {invoice.ackNo}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-2">Ack Date</td>
                <td>: {formatDate(invoice.ackDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* e-Way Bill Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-semibold mb-2">1. e-Way Bill Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2 w-32">e-Way Bill No.</td>
                  <td>: {invoice.eWayBillNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Mode</td>
                  <td>: {invoice.ewbMode}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Supply Type</td>
                  <td>: {invoice.ewbSupplyType}</td>
                </tr>
              </tbody>
            </table>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2 w-32">Generated Date</td>
                  <td>: {invoice.ewbGeneratedDate}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Valid Upto</td>
                  <td>: {invoice.ewbValidUpto}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Approx Distance</td>
                  <td>: {invoice.ewbDistance} KM</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Transaction Type</td>
                  <td>: {invoice.ewbTransactionType}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Address Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-semibold mb-2">2. Address Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-semibold mb-1">From</p>
              <p className="font-bold">{invoice.sellerName}</p>
              <p>GSTIN: {invoice.sellerGstin}</p>
              <p>{invoice.sellerState}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">To</p>
              <p className="font-bold">{invoice.buyerName}</p>
              <p>GSTIN: {invoice.buyerGstin}</p>
              <p>{invoice.buyerState}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Dispatch From</p>
              <p>{invoice.sellerAddress}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Ship To</p>
              <p>{invoice.buyerAddress}</p>
            </div>
          </div>
        </div>

        {/* Goods Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-semibold mb-2">3. Goods Details</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-2 border border-gray-300 text-left">HSN Code</th>
                <th className="py-2 px-2 border border-gray-300 text-left">Product Description</th>
                <th className="py-2 px-2 border border-gray-300 text-left">Quantity</th>
                <th className="py-2 px-2 border border-gray-300 text-right">Taxable Amt</th>
                <th className="py-2 px-2 border border-gray-300 text-right">Tax Rate (C+S)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`goods-${item.id || index}`}>
                  <td className="py-1 px-2 border border-gray-300">{item.hsnSac}</td>
                  <td className="py-1 px-2 border border-gray-300">{item.description}</td>
                  <td className="py-1 px-2 border border-gray-300">{item.quantity} NOS</td>
                  <td className="py-1 px-2 border border-gray-300 text-right">{safeNumberFormat(item.amount)}</td>
                  <td className="py-1 px-2 border border-gray-300 text-right">{invoice.cgstRate}+{invoice.sgstRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <table className="w-full text-sm mt-4">
            <tbody>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>Total Taxable Amt</td>
                <td className="px-2">:</td>
                <td className="w-32 text-right">{safeNumberFormat(invoice.totalTaxableAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>CGST Amt</td>
                <td className="px-2">:</td>
                <td className="text-right">{safeNumberFormat(invoice.cgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>SGST Amt</td>
                <td className="px-2">:</td>
                <td className="text-right">{safeNumberFormat(invoice.sgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>Total Inv Amt</td>
                <td className="px-2">:</td>
                <td className="text-right font-semibold">{safeNumberFormat(invoice.totalAmount)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transportation Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-semibold mb-2">4. Transportation Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2 w-32">Transporter ID</td>
                  <td>: {invoice.transporterId}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Name</td>
                  <td>: {invoice.transporterName}</td>
                </tr>
              </tbody>
            </table>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2 w-32">Vehicle No.</td>
                  <td>: {invoice.vehicleNo}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">From</td>
                  <td>: {invoice.fromPlace}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 text-center text-sm text-gray-500">
          This is a system generated e-Way Bill
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
