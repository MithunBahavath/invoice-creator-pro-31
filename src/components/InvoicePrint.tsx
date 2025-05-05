
import React from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { formatDate } from '@/utils/helpers';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  forwardRef: React.RefObject<HTMLDivElement>;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ forwardRef }) => {
  const { currentInvoice } = useInvoice();

  // Helper function to safely format numbers
  const safeNumberFormat = (value: any, decimals = 2): string => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  return (
    <div 
      ref={forwardRef} 
      className="bg-white p-6 shadow-none w-[210mm] mx-auto my-0"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Page 1: Invoice */}
      <div className="border border-gray-300 print:border-gray-700">
        <div className="flex justify-between p-4 border-b border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-sm"># {currentInvoice.invoiceNo}</p>
            <p className="text-sm mt-1">Date: {formatDate(currentInvoice.invoiceDate)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-purple-600">AGNEE GAS DISTRIBUTER</h2>
            <p className="text-sm text-gray-600">
              3/168B IRRUKUR, PARAMATHI VELUR, NAMAKKAL, Tamil Nadu - 637204, India
            </p>
            <p className="text-sm text-gray-600">GSTIN: {currentInvoice.sellerGstin}</p>
            <p className="text-sm text-gray-600">Phone: {currentInvoice.sellerContact}</p>
            <p className="text-sm text-gray-600">Email: {currentInvoice.sellerEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-300 bg-gray-50">
          <div>
            <p className="text-sm font-semibold">Invoice No.</p>
            <p className="text-sm">{currentInvoice.invoiceNo}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">e-Way Bill No.</p>
            <p className="text-sm">{currentInvoice.eWayBillNo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">IRN</p>
            <p className="text-sm truncate">{currentInvoice.irn}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-4 border-b border-gray-300">
          <div>
            <h3 className="text-sm font-semibold uppercase">BILL TO:</h3>
            <p className="font-bold text-lg">{currentInvoice.buyerName}</p>
            <p className="whitespace-pre-line text-sm">{currentInvoice.buyerAddress}</p>
            <p className="text-sm">GSTIN: {currentInvoice.buyerGstin}</p>
            <p className="text-sm">State: {currentInvoice.buyerState}, Code: {currentInvoice.buyerStateCode}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold uppercase">E-INVOICE</h3>
            <div className="w-24 h-24 ml-auto">
              <QRCodeSVG 
                value={`IRN:${currentInvoice.irn}\nInvoice:${currentInvoice.invoiceNo}`} 
                size={96}
              />
            </div>
            <p className="text-xs mt-1">
              Ack No: {currentInvoice.ackNo}<br />
              Ack Date: {formatDate(currentInvoice.ackDate)}
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
              {currentInvoice.items.map((item, index) => (
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
              {currentInvoice.items.length < 5 && Array.from({ length: 5 - currentInvoice.items.length }).map((_, i) => (
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
                {currentInvoice.items.length > 0 && Array.from(
                  new Set(currentInvoice.items.map(item => item.hsnSac))
                ).map((hsn, index) => {
                  const itemsWithHsn = currentInvoice.items.filter(item => item.hsnSac === hsn);
                  const taxableValue = itemsWithHsn.reduce((sum, item) => sum + (parseFloat(item.amount?.toString() || '0') || 0), 0);
                  const cgstAmount = (taxableValue * parseFloat(currentInvoice.cgstRate?.toString() || '0')) / 100;
                  const sgstAmount = (taxableValue * parseFloat(currentInvoice.sgstRate?.toString() || '0')) / 100;
                  
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
                <div>₹ {safeNumberFormat(currentInvoice.totalTaxableAmount)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="font-semibold">CGST ({currentInvoice.cgstRate}%):</div>
                <div>₹ {safeNumberFormat(currentInvoice.cgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="font-semibold">SGST ({currentInvoice.sgstRate}%):</div>
                <div>₹ {safeNumberFormat(currentInvoice.sgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="font-semibold">Rounded Off:</div>
                <div>₹ ({Math.abs(parseFloat(currentInvoice.roundedOff?.toString() || '0')).toFixed(2)})</div>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-800">
                <div>Total:</div>
                <div>₹ {safeNumberFormat(currentInvoice.totalAmount)}</div>
              </div>
              <div className="mt-2 text-sm italic text-gray-600">
                Amount in words: <span className="font-semibold">{currentInvoice.amountInWords}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-sm font-semibold uppercase mb-2">BANK DETAILS</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Bank Name:</span> {currentInvoice.bankName}</p>
              <p><span className="font-semibold">Account No:</span> {currentInvoice.accountNo}</p>
            </div>
            <div>
              <p><span className="font-semibold">IFSC Code:</span> {currentInvoice.ifscCode}</p>
              <p><span className="font-semibold">Branch:</span> {currentInvoice.branchName}</p>
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
            <p className="font-semibold mb-12">For {currentInvoice.sellerName}</p>
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
                  <td>: Tax Invoice - {currentInvoice.invoiceNo}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Date</td>
                  <td>: {formatDate(currentInvoice.invoiceDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end">
            <div className="w-32 h-32">
              <QRCodeSVG 
                value={`EWB:${currentInvoice.eWayBillNo || 'NA'}`} 
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
                <td>: {currentInvoice.irn}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-2">Ack No.</td>
                <td>: {currentInvoice.ackNo}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-2">Ack Date</td>
                <td>: {formatDate(currentInvoice.ackDate)}</td>
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
                  <td>: {currentInvoice.eWayBillNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Mode</td>
                  <td>: {currentInvoice.ewbMode}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Supply Type</td>
                  <td>: {currentInvoice.ewbSupplyType}</td>
                </tr>
              </tbody>
            </table>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2 w-32">Generated Date</td>
                  <td>: {currentInvoice.ewbGeneratedDate}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Valid Upto</td>
                  <td>: {currentInvoice.ewbValidUpto}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Approx Distance</td>
                  <td>: {currentInvoice.ewbDistance} KM</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Transaction Type</td>
                  <td>: {currentInvoice.ewbTransactionType}</td>
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
              <p className="font-bold">{currentInvoice.sellerName}</p>
              <p>GSTIN: {currentInvoice.sellerGstin}</p>
              <p>{currentInvoice.sellerState}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">To</p>
              <p className="font-bold">{currentInvoice.buyerName}</p>
              <p>GSTIN: {currentInvoice.buyerGstin}</p>
              <p>{currentInvoice.buyerState}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Dispatch From</p>
              <p>{currentInvoice.sellerAddress}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Ship To</p>
              <p>{currentInvoice.buyerAddress}</p>
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
              {currentInvoice.items.map((item, index) => (
                <tr key={`goods-${item.id || index}`}>
                  <td className="py-1 px-2 border border-gray-300">{item.hsnSac}</td>
                  <td className="py-1 px-2 border border-gray-300">{item.description}</td>
                  <td className="py-1 px-2 border border-gray-300">{item.quantity} NOS</td>
                  <td className="py-1 px-2 border border-gray-300 text-right">{safeNumberFormat(item.amount)}</td>
                  <td className="py-1 px-2 border border-gray-300 text-right">{currentInvoice.cgstRate}+{currentInvoice.sgstRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <table className="w-full text-sm mt-4">
            <tbody>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>Total Taxable Amt</td>
                <td className="px-2">:</td>
                <td className="w-32 text-right">{safeNumberFormat(currentInvoice.totalTaxableAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>CGST Amt</td>
                <td className="px-2">:</td>
                <td className="text-right">{safeNumberFormat(currentInvoice.cgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>SGST Amt</td>
                <td className="px-2">:</td>
                <td className="text-right">{safeNumberFormat(currentInvoice.sgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-right font-semibold" colSpan={2}>Total Inv Amt</td>
                <td className="px-2">:</td>
                <td className="text-right font-semibold">{safeNumberFormat(currentInvoice.totalAmount)}</td>
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
                  <td>: {currentInvoice.transporterId}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">Name</td>
                  <td>: {currentInvoice.transporterName}</td>
                </tr>
              </tbody>
            </table>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-2 w-32">Vehicle No.</td>
                  <td>: {currentInvoice.vehicleNo}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-2">From</td>
                  <td>: {currentInvoice.fromPlace}</td>
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
};

export default InvoicePrint;
