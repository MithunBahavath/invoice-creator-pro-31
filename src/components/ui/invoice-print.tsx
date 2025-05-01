
import React from 'react';
import { useInvoice, Invoice } from '@/context/InvoiceContext';
import { formatDate } from '@/utils/helpers';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  invoice: Invoice;
}

export const InvoicePrint: React.FC<InvoicePrintProps> = ({ invoice }) => {
  const safeNumberFormat = (value: any, decimals = 2): string => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  return (
    <div 
      className="bg-white p-6 shadow-none w-[210mm] mx-auto my-0"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Professional Header */}
      <div className="border border-gray-300 rounded-md print:border-gray-800">
        {/* Header Section */}
        <div className="flex justify-between p-6 border-b border-gray-300 print:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h1>
            <p className="text-sm text-gray-500 mb-4"># {invoice.invoiceNo}</p>
            <div className="text-sm">
              <strong>Date:</strong> {formatDate(invoice.invoiceDate)}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-primary mb-1">{invoice.sellerName}</h2>
            <div className="whitespace-pre-line text-sm text-gray-600">{invoice.sellerAddress}</div>
            <div className="text-sm mt-2">
              <div>GSTIN: {invoice.sellerGstin}</div>
              <div>Phone: {invoice.sellerContact}</div>
              <div>Email: {invoice.sellerEmail}</div>
            </div>
          </div>
        </div>

        {/* Invoice Info Bar */}
        <div className="bg-gray-100 print:bg-gray-100 p-4 grid grid-cols-3 gap-4 text-sm border-b border-gray-300">
          <div>
            <div className="font-semibold text-gray-700">Invoice No.</div>
            <div>{invoice.invoiceNo}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">e-Way Bill No.</div>
            <div>{invoice.eWayBillNo || "N/A"}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">IRN</div>
            <div className="truncate">{invoice.irn}</div>
          </div>
        </div>

        {/* Customer and Supplier Details */}
        <div className="grid grid-cols-2 gap-6 p-6 border-b border-gray-300 print:border-gray-800">
          {/* Customer Details */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Bill To:</h3>
            <div className="font-bold text-lg">{invoice.buyerName}</div>
            <div className="whitespace-pre-line text-sm">{invoice.buyerAddress}</div>
            <div className="text-sm mt-2">
              <div>GSTIN: {invoice.buyerGstin}</div>
              <div>State: {invoice.buyerState}, Code: {invoice.buyerStateCode}</div>
            </div>
          </div>
          
          {/* QR Code and Additional Info */}
          <div className="flex justify-end">
            <div className="text-right">
              <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">e-Invoice</h3>
              <div className="w-24 h-24 ml-auto">
                <QRCodeSVG 
                  value={`IRN:${invoice.irn}\nInvoice:${invoice.invoiceNo}`} 
                  size={96}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Ack No: {invoice.ackNo}<br />
                Ack Date: {formatDate(invoice.ackDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6 border-b border-gray-300 print:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-2 px-3 border-b-2 border-gray-300 text-left">Sl No.</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 text-left">Description</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 text-left">HSN/SAC</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 text-left">Qty</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 text-right">Rate (₹)</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`item-${item.id || index}`} className="border-b border-gray-200">
                  <td className="py-3 px-3">{item.slNo}</td>
                  <td className="py-3 px-3">{item.description}</td>
                  <td className="py-3 px-3">{item.hsnSac}</td>
                  <td className="py-3 px-3">{item.quantity} Nos</td>
                  <td className="py-3 px-3 text-right">{safeNumberFormat(item.ratePerItem)}</td>
                  <td className="py-3 px-3 text-right">{safeNumberFormat(item.amount)}</td>
                </tr>
              ))}

              {/* Empty row if needed for spacing */}
              {invoice.items.length < 5 && Array.from({ length: 5 - invoice.items.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-gray-200">
                  <td className="py-3 px-3">&nbsp;</td>
                  <td className="py-3 px-3">&nbsp;</td>
                  <td className="py-3 px-3">&nbsp;</td>
                  <td className="py-3 px-3">&nbsp;</td>
                  <td className="py-3 px-3">&nbsp;</td>
                  <td className="py-3 px-3">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Calculations */}
        <div className="grid grid-cols-2 p-6 border-b border-gray-300 print:border-gray-800">
          {/* Tax Summary */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-3">Tax Summary</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
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
                    <tr key={`hsn-${index}`} className="border-b border-gray-200">
                      <td className="py-2 px-3 border-x border-gray-300">{hsn}</td>
                      <td className="py-2 px-3 border-r border-gray-300 text-right">{safeNumberFormat(taxableValue)}</td>
                      <td className="py-2 px-3 border-r border-gray-300 text-right">{safeNumberFormat(cgstAmount)}</td>
                      <td className="py-2 px-3 border-r border-gray-300 text-right">{safeNumberFormat(sgstAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Invoice Summary */}
          <div className="pl-8">
            <div className="ml-auto w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">Subtotal:</div>
                <div>₹ {safeNumberFormat(invoice.totalTaxableAmount)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">CGST ({invoice.cgstRate}%):</div>
                <div>₹ {safeNumberFormat(invoice.cgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">SGST ({invoice.sgstRate}%):</div>
                <div>₹ {safeNumberFormat(invoice.sgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">Rounded Off:</div>
                <div>₹ ({Math.abs(parseFloat(invoice.roundedOff?.toString() || '0')).toFixed(2)})</div>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-gray-800 font-bold text-lg">
                <div>Total:</div>
                <div>₹ {safeNumberFormat(invoice.totalAmount)}</div>
              </div>
              <div className="mt-3 text-sm italic text-gray-600">
                Amount in words: <span className="font-semibold">{invoice.amountInWords}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="p-6 border-b border-gray-300 print:border-gray-800">
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Bank Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div><span className="font-semibold">Bank Name:</span> {invoice.bankName}</div>
              <div><span className="font-semibold">Account No:</span> {invoice.accountNo}</div>
            </div>
            <div>
              <div><span className="font-semibold">IFSC Code:</span> {invoice.ifscCode}</div>
              <div><span className="font-semibold">Branch:</span> {invoice.branchName}</div>
            </div>
          </div>
        </div>

        {/* Declaration and Signature */}
        <div className="grid grid-cols-2 p-6">
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Terms & Conditions</h3>
            <div className="text-xs text-gray-600">
              1. Goods once sold will not be taken back.<br />
              2. Interest will be charged @18% p.a. if payment is not made within due date.<br />
              3. All disputes are subject to local jurisdiction only.
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold mb-12">For {invoice.sellerName}</div>
            <div className="mt-2 pt-4 border-t border-gray-400 inline-block">
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>

      {/* e-Way Bill (Second Page) */}
      <div className="page-break mt-8 border border-gray-300 rounded-md print:border-gray-800">
        <div className="bg-gray-100 p-4 border-b border-gray-300 print:border-gray-800">
          <h1 className="text-2xl font-bold text-center">e-Way Bill</h1>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-300 print:border-gray-800">
          <div className="p-4 border-r border-gray-300">
            <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
              <div className="font-semibold">Doc No.</div>
              <div>: Tax Invoice - {invoice.invoiceNo}</div>
              <div className="font-semibold">Date</div>
              <div>: {formatDate(invoice.invoiceDate)}</div>
            </div>
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

        <div className="p-4 border-b border-gray-300 print:border-gray-800 bg-gray-50">
          <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
            <div className="font-semibold">IRN</div>
            <div>: {invoice.irn}</div>
            <div className="font-semibold">Ack No.</div>
            <div>: {invoice.ackNo}</div>
            <div className="font-semibold">Ack Date</div>
            <div>: {formatDate(invoice.ackDate)}</div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 print:border-gray-800">
          <h3 className="font-semibold mb-2">1. e-Way Bill Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="grid grid-cols-[150px_1fr] gap-1">
              <div className="font-semibold">e-Way Bill No.</div>
              <div>: {invoice.eWayBillNo}</div>
              <div className="font-semibold">Mode</div>
              <div>: {invoice.ewbMode}</div>
              <div className="font-semibold">Supply Type</div>
              <div>: {invoice.ewbSupplyType}</div>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-1">
              <div className="font-semibold">Generated Date</div>
              <div>: {invoice.ewbGeneratedDate}</div>
              <div className="font-semibold">Valid Upto</div>
              <div>: {invoice.ewbValidUpto}</div>
              <div className="font-semibold">Approx Distance</div>
              <div>: {invoice.ewbDistance} KM</div>
              <div className="font-semibold">Transaction Type</div>
              <div>: {invoice.ewbTransactionType}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 print:border-gray-800">
          <h3 className="font-semibold mb-2">2. Address Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">From</div>
              <div className="font-bold">{invoice.sellerName}</div>
              <div>GSTIN: {invoice.sellerGstin}</div>
              <div>{invoice.sellerState}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">To</div>
              <div className="font-bold">{invoice.buyerName}</div>
              <div>GSTIN: {invoice.buyerGstin}</div>
              <div>{invoice.buyerState}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <div className="font-semibold mb-1">Dispatch From</div>
              <div>{invoice.sellerAddress}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Ship To</div>
              <div>{invoice.buyerAddress}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 print:border-gray-800">
          <h3 className="font-semibold mb-2">3. Goods Details</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 border border-gray-300 text-left">HSN Code</th>
                <th className="py-2 px-3 border border-gray-300 text-left">Product Description</th>
                <th className="py-2 px-3 border border-gray-300 text-left">Quantity</th>
                <th className="py-2 px-3 border border-gray-300 text-right">Taxable Amt</th>
                <th className="py-2 px-3 border border-gray-300 text-right">Tax Rate (C+S)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`goods-${item.id || index}`} className="border-b border-gray-200">
                  <td className="py-2 px-3 border-x border-gray-300">{item.hsnSac}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{item.description}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{item.quantity} NOS</td>
                  <td className="py-2 px-3 border-r border-gray-300 text-right">{safeNumberFormat(item.amount)}</td>
                  <td className="py-2 px-3 border-r border-gray-300 text-right">{invoice.cgstRate}+{invoice.sgstRate}</td>
                </tr>
              ))}
              
              <tr className="bg-gray-50">
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>Total Taxable Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(invoice.totalTaxableAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>CGST Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(invoice.cgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>SGST Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(invoice.sgstAmount)}</td>
                <td></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>Total Inv Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(invoice.totalAmount)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-b border-gray-300 print:border-gray-800">
          <h3 className="font-semibold mb-2">4. Transportation Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-1">
              <div className="font-semibold">Transporter ID</div>
              <div>: {invoice.transporterId}</div>
              <div className="font-semibold">Name</div>
              <div>: {invoice.transporterName}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-1">
              <div className="font-semibold">Vehicle No.</div>
              <div>: {invoice.vehicleNo}</div>
              <div className="font-semibold">From</div>
              <div>: {invoice.fromPlace}</div>
            </div>
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
};
