
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
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Delivery Note</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.deliveryNote || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Mode/Terms of Payment</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.mode || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Reference No. & Date</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.reference || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Other References</td>
                    <td className="border border-gray-400 p-1 text-left"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Buyer's Order No.</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.buyerOrderNo || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Dated</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.buyerOrderDate ? formatDate(invoice.buyerOrderDate) : ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Dispatch Doc No.</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.dispatchDocNo || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Delivery Note Date</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.deliveryNoteDate ? formatDate(invoice.deliveryNoteDate) : ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Dispatched through</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.dispatchedThrough || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Destination</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.destination || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 text-left">Terms of Delivery</td>
                    <td className="border border-gray-400 p-1 text-left">{invoice.termsOfDelivery || ''}</td>
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

      {/* Page 2: e-Way Bill */}
      <div className="page-break mt-8 border border-gray-300 print:border-gray-700">
        <div className="p-4 border-b border-gray-300 flex justify-between">
          <div className="text-center w-1/2">
            <h2 className="text-xl font-bold">e-Way Bill</h2>
          </div>
          <div className="text-center w-1/2">
            <h2 className="text-xl font-bold">e-Way Bill</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-3 p-4 border-b border-gray-300">
          <div className="col-span-2">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-bold w-16">Doc No.:</td>
                  <td>Tax Invoice - {invoice.invoiceNo}</td>
                </tr>
                <tr>
                  <td className="font-bold">Date:</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                </tr>
                <tr className="mt-2">
                  <td className="font-bold">IRN:</td>
                  <td>{invoice.irn}</td>
                </tr>
                <tr>
                  <td className="font-bold">Ack No.:</td>
                  <td>{invoice.ackNo}</td>
                </tr>
                <tr>
                  <td className="font-bold">Ack Date:</td>
                  <td>{formatDate(invoice.ackDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <QRCodeSVG 
              value={`EWB:${invoice.eWayBillNo || 'NA'}`} 
              size={140} 
            />
          </div>
        </div>
        
        {/* e-Way Bill Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-bold mb-2">1. e-Way Bill Details</h3>
          <table className="w-full text-sm mb-2">
            <tbody>
              <tr>
                <td className="w-1/4">
                  <strong>e-Way Bill No.:</strong> {invoice.eWayBillNo || 'N/A'}
                </td>
                <td className="w-1/4">
                  <strong>Mode:</strong> {invoice.ewbMode}
                </td>
                <td className="w-1/4">
                  <strong>Generated Date:</strong> {formatDate(invoice.ewbGeneratedDate)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Generated By:</strong> {invoice.ewbGeneratedBy}
                </td>
                <td>
                  <strong>Approx Distance:</strong> {invoice.ewbDistance} KM
                </td>
                <td>
                  <strong>Valid Upto:</strong> {invoice.ewbValidUpto}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Supply Type:</strong> {invoice.ewbSupplyType}
                </td>
                <td colSpan={2}>
                  <strong>Transaction Type:</strong> {invoice.ewbTransactionType}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Address Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-bold mb-2">2. Address Details</h3>
          <table className="w-full text-sm mb-2">
            <tbody>
              <tr>
                <td className="w-1/2">
                  <p><strong>From</strong></p>
                  <p>Sakthi Gas Service</p>
                  <p>GSTIN: {invoice.sellerGstin}</p>
                  <p>Tamil Nadu</p>
                </td>
                <td className="w-1/2">
                  <p><strong>To</strong></p>
                  <p>AGNEE GAS DISTRIBUTER</p>
                  <p>GSTIN: {invoice.buyerGstin}</p>
                  <p>Tamil Nadu</p>
                </td>
              </tr>
            </tbody>
          </table>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="w-1/2 align-top">
                  <p><strong>Dispatch From</strong></p>
                  <p>2/A Kalyanaraman Kovil Street, Old Bus Stand,</p>
                  <p>Kumbakonam, Kumbakonam Tamil Nadu 612001</p>
                </td>
                <td className="w-1/2 align-top">
                  <p><strong>Ship To</strong></p>
                  <p>3/168B IRRUKUR, PARAMATHI VELUR, NAMAKKAL</p>
                  <p>PARAMATHI Tamil Nadu 637204</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Goods Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-bold mb-2">3. Goods Details</h3>
          <table className="w-full text-sm border-collapse mb-4">
            <thead>
              <tr>
                <th className="border border-gray-400 p-1 text-left">HSN<br />Code</th>
                <th className="border border-gray-400 p-1 text-left">Product Name & Desc.</th>
                <th className="border border-gray-400 p-1 text-right">Quantity</th>
                <th className="border border-gray-400 p-1 text-right">Taxable Amt</th>
                <th className="border border-gray-400 p-1 text-right">Tax Rate<br />(C+S)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`goods-${item.id || index}`}>
                  <td className="border border-gray-400 p-1">{item.hsnSac}</td>
                  <td className="border border-gray-400 p-1">{item.description}</td>
                  <td className="border border-gray-400 p-1 text-right">{item.quantity} nos</td>
                  <td className="border border-gray-400 p-1 text-right">{safeNumberFormat(item.amount)}</td>
                  <td className="border border-gray-400 p-1 text-right">{invoice.cgstRate + invoice.sgstRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="w-1/2">
                  <table className="w-full mb-4">
                    <tbody>
                      <tr>
                        <td className="text-right pr-4"><strong>Tot Taxable Amt</strong></td>
                        <td className="text-right w-24">{safeNumberFormat(invoice.totalTaxableAmount)}</td>
                      </tr>
                      <tr>
                        <td className="text-right pr-4"><strong>CGST Amt</strong></td>
                        <td className="text-right">{safeNumberFormat(invoice.cgstAmount)}</td>
                      </tr>
                      <tr>
                        <td className="text-right pr-4"><strong>SGST Amt</strong></td>
                        <td className="text-right">{safeNumberFormat(invoice.sgstAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="w-1/2">
                  <table className="w-full mb-4">
                    <tbody>
                      <tr>
                        <td className="text-right pr-4"><strong>Other Amt</strong></td>
                        <td className="text-right w-24">{safeNumberFormat(Math.abs(invoice.roundedOff || 0))}</td>
                      </tr>
                      <tr>
                        <td className="text-right pr-4"><strong>Total Inv Amt</strong></td>
                        <td className="text-right">{safeNumberFormat(invoice.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transportation Details */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="font-bold mb-2">4. Transportation Details</h3>
          <table className="w-full text-sm mb-2">
            <tbody>
              <tr>
                <td className="w-1/2">
                  <p><strong>Transporter ID:</strong> {invoice.transporterId || ''}</p>
                </td>
                <td className="w-1/2">
                  <p><strong>Doc No.:</strong> </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p><strong>Name:</strong> {invoice.transporterName || ''}</p>
                </td>
                <td>
                  <p><strong>Date:</strong> </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Vehicle Details */}
        <div className="p-4">
          <h3 className="font-bold mb-2">5. Vehicle Details</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="w-1/3">
                  <p><strong>Vehicle No.:</strong> {invoice.vehicleNo || 'TN68AZ4285'}</p>
                </td>
                <td className="w-1/3">
                  <p><strong>From:</strong> {invoice.fromPlace || 'Kumbakonam'}</p>
                </td>
                <td className="w-1/3">
                  <p><strong>CEWR No.:</strong> </p>
                </td>
              </tr>
            </tbody>
          </table>
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
