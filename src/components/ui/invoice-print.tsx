
import React from 'react';
import { useInvoice, Invoice } from '@/context/InvoiceContext';
import { formatDate } from '@/utils/helpers';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  invoice: Invoice;
}

export const InvoicePrint: React.FC<InvoicePrintProps> = ({ invoice }) => {
  // Helper function to safely format numbers
  const safeNumberFormat = (value: any, decimals = 2): string => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  return (
    <div 
      className="bg-white p-8 shadow-none w-[210mm] mx-auto my-0"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Tax Invoice Header */}
      <div className="border border-gray-800 print:border-gray-800">
        <div className="flex justify-between p-4 border-b border-gray-800 print:border-gray-800">
          <div className="text-center flex-grow">
            <h1 className="text-2xl font-bold">Tax Invoice</h1>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">e-Invoice</h2>
            <div className="w-32 h-32 ml-auto">
              <QRCodeSVG 
                value={`IRN:${invoice.irn}\nInvoice:${invoice.invoiceNo}`} 
                size={128} 
              />
            </div>
          </div>
        </div>

        {/* IRN Details */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="flex">
            <div className="w-24 font-semibold">IRN</div>
            <div className="w-2">:</div>
            <div className="flex-grow">{invoice.irn}</div>
          </div>
          <div className="flex">
            <div className="w-24 font-semibold">Ack No.</div>
            <div className="w-2">:</div>
            <div className="flex-grow">{invoice.ackNo}</div>
          </div>
          <div className="flex">
            <div className="w-24 font-semibold">Ack Date</div>
            <div className="w-2">:</div>
            <div className="flex-grow">{formatDate(invoice.ackDate)}</div>
          </div>
        </div>

        {/* Seller and Buyer Details */}
        <div className="grid grid-cols-2 border-b border-gray-800 print:border-gray-800">
          {/* Seller Details */}
          <div className="p-3 border-r border-gray-800 print:border-gray-800">
            <div className="font-bold text-lg">{invoice.sellerName}</div>
            <div className="whitespace-pre-line">{invoice.sellerAddress}</div>
            <div className="mt-1">
              GSTIN/UIN: {invoice.sellerGstin}
            </div>
            <div>
              State Name: {invoice.sellerState}, Code: {invoice.sellerStateCode}
            </div>
            <div>
              Contact: {invoice.sellerContact}
            </div>
            <div>
              E-Mail: {invoice.sellerEmail}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="font-semibold">Invoice No.</div>
            <div>{invoice.invoiceNo}</div>
            
            <div className="font-semibold">e-Way Bill No.</div>
            <div>{invoice.eWayBillNo}</div>
            
            <div className="font-semibold">Dated</div>
            <div>{formatDate(invoice.invoiceDate)}</div>
            
            <div className="font-semibold">Delivery Note</div>
            <div>{invoice.deliveryNote}</div>
            
            <div className="font-semibold">Mode/Terms of Payment</div>
            <div>{invoice.mode}</div>
            
            <div className="font-semibold">Reference No. & Date</div>
            <div>{invoice.reference}</div>
            
            <div className="font-semibold">Other References</div>
            <div></div>
            
            <div className="font-semibold">Buyer's Order No.</div>
            <div>{invoice.buyerOrderNo}</div>
            
            <div className="font-semibold">Dated</div>
            <div>{invoice.buyerOrderDate ? formatDate(invoice.buyerOrderDate) : ''}</div>
            
            <div className="font-semibold">Dispatch Doc No.</div>
            <div>{invoice.dispatchDocNo}</div>
            
            <div className="font-semibold">Delivery Note Date</div>
            <div>{invoice.deliveryNoteDate ? formatDate(invoice.deliveryNoteDate) : ''}</div>
            
            <div className="font-semibold">Dispatched through</div>
            <div>{invoice.dispatchedThrough}</div>
            
            <div className="font-semibold">Destination</div>
            <div>{invoice.destination}</div>
            
            <div className="font-semibold">Terms of Delivery</div>
            <div>{invoice.termsOfDelivery}</div>
          </div>
        </div>

        {/* Buyer Details */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold">Buyer (Bill to)</div>
          <div className="font-bold text-lg mt-1">{invoice.buyerName}</div>
          <div className="whitespace-pre-line">{invoice.buyerAddress}</div>
          <div className="mt-1 flex">
            <div className="w-24">GSTIN/UIN</div>
            <div className="w-2">:</div>
            <div>{invoice.buyerGstin}</div>
          </div>
          <div className="flex">
            <div className="w-24">State Name</div>
            <div className="w-2">:</div>
            <div>{invoice.buyerState}, Code: {invoice.buyerStateCode}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="border-b border-gray-800 print:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 print:border-gray-800">
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Sl No.</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Description of Goods</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">HSN/SAC</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Quantity</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Rate<br/>(Incl. of Tax)</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Rate</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`item-${item.id || index}`} className="border-b border-gray-800 print:border-gray-800">
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.slNo}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.description}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.hsnSac}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.quantity} Nos</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{safeNumberFormat(item.rateIncTax)}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{safeNumberFormat(item.ratePerItem)}</td>
                  <td className="p-2 text-right">{safeNumberFormat(item.amount)}</td>
                </tr>
              ))}

              {/* Empty row if needed for spacing */}
              {invoice.items.length < 5 && Array.from({ length: 5 - invoice.items.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-gray-800 print:border-gray-800">
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">&nbsp;</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">&nbsp;</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">&nbsp;</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">&nbsp;</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">&nbsp;</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">&nbsp;</td>
                  <td className="p-2">&nbsp;</td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={3}>Total</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">
                  {invoice.items.reduce((sum, item) => sum + (item?.quantity || 0), 0)} Nos
                </td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 text-right font-bold">₹ {safeNumberFormat(invoice.totalTaxableAmount)}</td>
              </tr>

              {/* Tax Calculation Rows */}
              <tr>
                <td rowSpan={3} colSpan={3} className="p-2 border-r border-gray-800 print:border-gray-800 align-top">
                  <div className="font-bold">Output Cgst</div>
                  <div className="font-bold">Output Sgst</div>
                  <div className="font-bold">Rounded Off</div>
                </td>
                <td colSpan={4} className="p-2 text-right">
                  <div>{safeNumberFormat(invoice.cgstAmount)}</div>
                  <div>{safeNumberFormat(invoice.sgstAmount)}</div>
                  <div>({Math.abs(parseFloat(invoice.roundedOff?.toString() || '0')).toFixed(2)})</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in Words */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold">Amount Chargeable (in words)</div>
          <div className="font-bold">{invoice.amountInWords}</div>
        </div>

        {/* HSN Summary */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 print:border-gray-800">
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">HSN/SAC</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Taxable Value</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-center" colSpan={2}>CGST</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-center" colSpan={2}>SGST/UTGST</th>
                <th className="p-2 text-left">Total Tax Amount</th>
              </tr>
              <tr className="border-b border-gray-800 print:border-gray-800">
                <th className="p-2 border-r border-gray-800 print:border-gray-800"></th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800"></th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Rate</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Amount</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Rate</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Amount</th>
                <th className="p-2"></th>
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
                const totalTax = cgstAmount + sgstAmount;
                
                return (
                  <tr key={`hsn-${index}`} className="border-b border-gray-800 print:border-gray-800">
                    <td className="p-2 border-r border-gray-800 print:border-gray-800">{hsn}</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{safeNumberFormat(taxableValue)}</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{invoice.cgstRate}%</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{safeNumberFormat(cgstAmount)}</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{invoice.sgstRate}%</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{safeNumberFormat(sgstAmount)}</td>
                    <td className="p-2 text-right">{safeNumberFormat(totalTax)}</td>
                  </tr>
                );
              })}
              
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">Total</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.totalTaxableAmount)}</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.cgstAmount)}</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.sgstAmount)}</td>
                <td className="p-2 text-right font-bold">{safeNumberFormat(parseFloat(invoice.cgstAmount?.toString() || '0') + parseFloat(invoice.sgstAmount?.toString() || '0'))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Amount in Words */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="flex">
            <div className="w-32 font-bold">Tax Amount (in words):</div>
            <div className="flex-grow font-bold">
              {invoice.amountInWords}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold">Company's Bank Details</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex">
              <div className="w-32">Bank Name</div>
              <div className="w-2">:</div>
              <div>{invoice.bankName}</div>
            </div>
            <div className="flex">
              <div className="w-32">A/c No.</div>
              <div className="w-2">:</div>
              <div>{invoice.accountNo}</div>
            </div>
            <div className="flex">
              <div className="w-32">Branch & IFS Code</div>
              <div className="w-2">:</div>
              <div>{invoice.branchName} & {invoice.ifscCode}</div>
            </div>
          </div>
        </div>

        {/* Declaration and Signature */}
        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-gray-800 print:border-gray-800">
            <div className="font-bold">Declaration</div>
            <div className="text-sm">
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
            </div>
          </div>
          <div className="p-3 text-right">
            <div className="font-bold mb-10">for {invoice.sellerName}</div>
            <div className="mt-10">Authorised Signatory</div>
          </div>
        </div>

        {/* Computer Generated Invoice */}
        <div className="p-1 text-center text-xs border-t border-gray-800 print:border-gray-800">
          This is a Computer Generated Invoice
        </div>
      </div>

      {/* e-Way Bill (Second Page) */}
      <div className="page-break mt-8 border border-gray-800 print:border-gray-800">
        <div className="flex justify-center p-3 border-b border-gray-800 print:border-gray-800">
          <h1 className="text-2xl font-bold">e-Way Bill</h1>
        </div>

        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-b border-gray-800 print:border-gray-800">
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-bold">Doc No.</div>
              <div>: Tax Invoice - {invoice.invoiceNo}</div>
              <div className="font-bold">Date</div>
              <div>: {formatDate(invoice.invoiceDate)}</div>
            </div>
          </div>
          <div className="p-3 border-b border-gray-800 print:border-gray-800 flex justify-end">
            <div className="w-32 h-32">
              <QRCodeSVG 
                value={`EWB:${invoice.eWayBillNo || 'NA'}`} 
                size={128} 
              />
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="grid grid-cols-[100px_1fr] gap-1">
            <div className="font-bold">IRN</div>
            <div>: {invoice.irn}</div>
            <div className="font-bold">Ack No.</div>
            <div>: {invoice.ackNo}</div>
            <div className="font-bold">Ack Date</div>
            <div>: {formatDate(invoice.ackDate)}</div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold mb-2">1. e-Way Bill Details</div>
          <div className="grid grid-cols-2 gap-2">
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

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold mb-2">2. Address Details</div>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4 mt-4">
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

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold mb-2">3. Goods Details</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 print:border-gray-800">
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">HSN Code</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Product Name & Desc</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Quantity</th>
                <th className="p-2 border-r border-gray-800 print:border-gray-800 text-left">Taxable Amt</th>
                <th className="p-2 text-left">Tax Rate (C+S)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={`goods-${item.id || index}`} className="border-b border-gray-800 print:border-gray-800">
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.hsnSac}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.description}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.quantity} NOS</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{safeNumberFormat(item.amount)}</td>
                  <td className="p-2 text-right">{invoice.cgstRate}+{invoice.sgstRate}</td>
                </tr>
              ))}
              
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>Total Taxable Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.totalTaxableAmount)}</td>
                <td></td>
              </tr>
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>Other Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">({Math.abs(parseFloat(invoice.roundedOff?.toString() || '0')).toFixed(2)})</td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>CGST Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.cgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>SGST Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.sgstAmount)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>Total Inv Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{safeNumberFormat(invoice.totalAmount)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold mb-2">4. Transportation Details</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold">Transporter ID</div>
              <div>: {invoice.transporterId}</div>
              <div className="font-semibold">Name</div>
              <div>: {invoice.transporterName}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold">Doc No.</div>
              <div>:</div>
              <div className="font-semibold">Date</div>
              <div>:</div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="font-bold mb-2">5. Vehicle Details</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold">Vehicle No.</div>
              <div>: {invoice.vehicleNo}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold">From</div>
              <div>: {invoice.fromPlace}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold">CEWB No.</div>
              <div>:</div>
            </div>
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
};
