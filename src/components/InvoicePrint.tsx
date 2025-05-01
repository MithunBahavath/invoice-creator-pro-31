
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
      {/* Professional Header */}
      <div className="border border-gray-300 rounded-md print:border-gray-800">
        {/* Header Section */}
        <div className="flex justify-between p-6 border-b border-gray-300 print:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h1>
            <p className="text-sm text-gray-500 mb-4"># {currentInvoice.invoiceNo}</p>
            <div className="text-sm">
              <strong>Date:</strong> {formatDate(currentInvoice.invoiceDate)}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-primary mb-1">{currentInvoice.sellerName}</h2>
            <div className="whitespace-pre-line text-sm text-gray-600">{currentInvoice.sellerAddress}</div>
            <div className="text-sm mt-2">
              <div>GSTIN: {currentInvoice.sellerGstin}</div>
              <div>Phone: {currentInvoice.sellerContact}</div>
              <div>Email: {currentInvoice.sellerEmail}</div>
            </div>
          </div>
        </div>

        {/* Invoice Info Bar */}
        <div className="bg-gray-100 print:bg-gray-100 p-4 grid grid-cols-3 gap-4 text-sm border-b border-gray-300">
          <div>
            <div className="font-semibold text-gray-700">Invoice No.</div>
            <div>{currentInvoice.invoiceNo}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">e-Way Bill No.</div>
            <div>{currentInvoice.eWayBillNo || "N/A"}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">IRN</div>
            <div className="truncate">{currentInvoice.irn}</div>
          </div>
        </div>

        {/* Customer and Supplier Details */}
        <div className="grid grid-cols-2 gap-6 p-6 border-b border-gray-300 print:border-gray-800">
          {/* Customer Details */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Bill To:</h3>
            <div className="font-bold text-lg">{currentInvoice.buyerName}</div>
            <div className="whitespace-pre-line text-sm">{currentInvoice.buyerAddress}</div>
            <div className="text-sm mt-2">
              <div>GSTIN: {currentInvoice.buyerGstin}</div>
              <div>State: {currentInvoice.buyerState}, Code: {currentInvoice.buyerStateCode}</div>
            </div>
          </div>
          
          {/* QR Code and Additional Info */}
          <div className="flex justify-end">
            <div className="text-right">
              <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">e-Invoice</h3>
              <div className="w-24 h-24 ml-auto">
                <QRCodeSVG 
                  value={`IRN:${currentInvoice.irn}\nInvoice:${currentInvoice.invoiceNo}`} 
                  size={96}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Ack No: {currentInvoice.ackNo}<br />
                Ack Date: {formatDate(currentInvoice.ackDate)}
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
              {currentInvoice.items.map((item, index) => (
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
              {currentInvoice.items.length < 5 && Array.from({ length: 5 - currentInvoice.items.length }).map((_, i) => (
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
                {currentInvoice.items.length > 0 && Array.from(
                  new Set(currentInvoice.items.map(item => item.hsnSac))
                ).map((hsn, index) => {
                  const itemsWithHsn = currentInvoice.items.filter(item => item.hsnSac === hsn);
                  const taxableValue = itemsWithHsn.reduce((sum, item) => sum + (parseFloat(item.amount?.toString() || '0') || 0), 0);
                  const cgstAmount = (taxableValue * parseFloat(currentInvoice.cgstRate?.toString() || '0')) / 100;
                  const sgstAmount = (taxableValue * parseFloat(currentInvoice.sgstRate?.toString() || '0')) / 100;
                  
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
                <div>₹ {safeNumberFormat(currentInvoice.totalTaxableAmount)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">CGST ({currentInvoice.cgstRate}%):</div>
                <div>₹ {safeNumberFormat(currentInvoice.cgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">SGST ({currentInvoice.sgstRate}%):</div>
                <div>₹ {safeNumberFormat(currentInvoice.sgstAmount)}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <div className="font-semibold">Rounded Off:</div>
                <div>₹ ({Math.abs(parseFloat(currentInvoice.roundedOff?.toString() || '0')).toFixed(2)})</div>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-gray-800 font-bold text-lg">
                <div>Total:</div>
                <div>₹ {safeNumberFormat(currentInvoice.totalAmount)}</div>
              </div>
              <div className="mt-3 text-sm italic text-gray-600">
                Amount in words: <span className="font-semibold">{currentInvoice.amountInWords}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="p-6 border-b border-gray-300 print:border-gray-800">
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Bank Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div><span className="font-semibold">Bank Name:</span> {currentInvoice.bankName}</div>
              <div><span className="font-semibold">Account No:</span> {currentInvoice.accountNo}</div>
            </div>
            <div>
              <div><span className="font-semibold">IFSC Code:</span> {currentInvoice.ifscCode}</div>
              <div><span className="font-semibold">Branch:</span> {currentInvoice.branchName}</div>
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
            <div className="font-semibold mb-12">For {currentInvoice.sellerName}</div>
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
              <div>: Tax Invoice - {currentInvoice.invoiceNo}</div>
              <div className="font-semibold">Date</div>
              <div>: {formatDate(currentInvoice.invoiceDate)}</div>
            </div>
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

        <div className="p-4 border-b border-gray-300 print:border-gray-800 bg-gray-50">
          <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
            <div className="font-semibold">IRN</div>
            <div>: {currentInvoice.irn}</div>
            <div className="font-semibold">Ack No.</div>
            <div>: {currentInvoice.ackNo}</div>
            <div className="font-semibold">Ack Date</div>
            <div>: {formatDate(currentInvoice.ackDate)}</div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 print:border-gray-800">
          <h3 className="font-semibold mb-2">1. e-Way Bill Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="grid grid-cols-[150px_1fr] gap-1">
              <div className="font-semibold">e-Way Bill No.</div>
              <div>: {currentInvoice.eWayBillNo}</div>
              <div className="font-semibold">Mode</div>
              <div>: {currentInvoice.ewbMode}</div>
              <div className="font-semibold">Supply Type</div>
              <div>: {currentInvoice.ewbSupplyType}</div>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-1">
              <div className="font-semibold">Generated Date</div>
              <div>: {currentInvoice.ewbGeneratedDate}</div>
              <div className="font-semibold">Valid Upto</div>
              <div>: {currentInvoice.ewbValidUpto}</div>
              <div className="font-semibold">Approx Distance</div>
              <div>: {currentInvoice.ewbDistance} KM</div>
              <div className="font-semibold">Transaction Type</div>
              <div>: {currentInvoice.ewbTransactionType}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 print:border-gray-800">
          <h3 className="font-semibold mb-2">2. Address Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">From</div>
              <div className="font-bold">{currentInvoice.sellerName}</div>
              <div>GSTIN: {currentInvoice.sellerGstin}</div>
              <div>{currentInvoice.sellerState}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">To</div>
              <div className="font-bold">{currentInvoice.buyerName}</div>
              <div>GSTIN: {currentInvoice.buyerGstin}</div>
              <div>{currentInvoice.buyerState}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <div className="font-semibold mb-1">Dispatch From</div>
              <div>{currentInvoice.sellerAddress}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Ship To</div>
              <div>{currentInvoice.buyerAddress}</div>
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
              {currentInvoice.items.map((item, index) => (
                <tr key={`goods-${item.id || index}`} className="border-b border-gray-200">
                  <td className="py-2 px-3 border-x border-gray-300">{item.hsnSac}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{item.description}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{item.quantity} NOS</td>
                  <td className="py-2 px-3 border-r border-gray-300 text-right">{safeNumberFormat(item.amount)}</td>
                  <td className="py-2 px-3 border-r border-gray-300 text-right">{currentInvoice.cgstRate}+{currentInvoice.sgstRate}</td>
                </tr>
              ))}
              
              <tr className="bg-gray-50">
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>Total Taxable Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(currentInvoice.totalTaxableAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>CGST Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(currentInvoice.cgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>SGST Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(currentInvoice.sgstAmount)}</td>
                <td></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-3 font-semibold text-right" colSpan={2}>Total Inv Amt</td>
                <td className="py-2 px-3 border-l border-gray-300">:</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right font-semibold">{safeNumberFormat(currentInvoice.totalAmount)}</td>
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
              <div>: {currentInvoice.transporterId}</div>
              <div className="font-semibold">Name</div>
              <div>: {currentInvoice.transporterName}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-1">
              <div className="font-semibold">Vehicle No.</div>
              <div>: {currentInvoice.vehicleNo}</div>
              <div className="font-semibold">From</div>
              <div>: {currentInvoice.fromPlace}</div>
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

export default InvoicePrint;
