
import React from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { formatDate } from '@/utils/helpers';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  forwardRef: React.RefObject<HTMLDivElement>;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ forwardRef }) => {
  const { currentInvoice } = useInvoice();

  return (
    <div 
      ref={forwardRef} 
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
                value={`IRN:${currentInvoice.irn}\nInvoice:${currentInvoice.invoiceNo}`} 
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
            <div className="flex-grow">{currentInvoice.irn}</div>
          </div>
          <div className="flex">
            <div className="w-24 font-semibold">Ack No.</div>
            <div className="w-2">:</div>
            <div className="flex-grow">{currentInvoice.ackNo}</div>
          </div>
          <div className="flex">
            <div className="w-24 font-semibold">Ack Date</div>
            <div className="w-2">:</div>
            <div className="flex-grow">{formatDate(currentInvoice.ackDate)}</div>
          </div>
        </div>

        {/* Seller and Buyer Details */}
        <div className="grid grid-cols-2 border-b border-gray-800 print:border-gray-800">
          {/* Seller Details */}
          <div className="p-3 border-r border-gray-800 print:border-gray-800">
            <div className="font-bold text-lg">{currentInvoice.sellerName}</div>
            <div className="whitespace-pre-line">{currentInvoice.sellerAddress}</div>
            <div className="mt-1">
              GSTIN/UIN: {currentInvoice.sellerGstin}
            </div>
            <div>
              State Name: {currentInvoice.sellerState}, Code: {currentInvoice.sellerStateCode}
            </div>
            <div>
              Contact: {currentInvoice.sellerContact}
            </div>
            <div>
              E-Mail: {currentInvoice.sellerEmail}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="font-semibold">Invoice No.</div>
            <div>{currentInvoice.invoiceNo}</div>
            
            <div className="font-semibold">e-Way Bill No.</div>
            <div>{currentInvoice.eWayBillNo}</div>
            
            <div className="font-semibold">Dated</div>
            <div>{formatDate(currentInvoice.invoiceDate)}</div>
            
            <div className="font-semibold">Delivery Note</div>
            <div>{currentInvoice.deliveryNote}</div>
            
            <div className="font-semibold">Mode/Terms of Payment</div>
            <div>{currentInvoice.mode}</div>
            
            <div className="font-semibold">Reference No. & Date</div>
            <div>{currentInvoice.reference}</div>
            
            <div className="font-semibold">Other References</div>
            <div></div>
            
            <div className="font-semibold">Buyer's Order No.</div>
            <div>{currentInvoice.buyerOrderNo}</div>
            
            <div className="font-semibold">Dated</div>
            <div>{currentInvoice.buyerOrderDate ? formatDate(currentInvoice.buyerOrderDate) : ''}</div>
            
            <div className="font-semibold">Dispatch Doc No.</div>
            <div>{currentInvoice.dispatchDocNo}</div>
            
            <div className="font-semibold">Delivery Note Date</div>
            <div>{currentInvoice.deliveryNoteDate ? formatDate(currentInvoice.deliveryNoteDate) : ''}</div>
            
            <div className="font-semibold">Dispatched through</div>
            <div>{currentInvoice.dispatchedThrough}</div>
            
            <div className="font-semibold">Destination</div>
            <div>{currentInvoice.destination}</div>
            
            <div className="font-semibold">Terms of Delivery</div>
            <div>{currentInvoice.termsOfDelivery}</div>
          </div>
        </div>

        {/* Buyer Details */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold">Buyer (Bill to)</div>
          <div className="font-bold text-lg mt-1">{currentInvoice.buyerName}</div>
          <div className="whitespace-pre-line">{currentInvoice.buyerAddress}</div>
          <div className="mt-1 flex">
            <div className="w-24">GSTIN/UIN</div>
            <div className="w-2">:</div>
            <div>{currentInvoice.buyerGstin}</div>
          </div>
          <div className="flex">
            <div className="w-24">State Name</div>
            <div className="w-2">:</div>
            <div>{currentInvoice.buyerState}, Code: {currentInvoice.buyerStateCode}</div>
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
              {currentInvoice.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-800 print:border-gray-800">
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.slNo}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.description}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.hsnSac}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.quantity} Nos</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{item.rateIncTax.toFixed(2)}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{item.ratePerItem.toFixed(2)}</td>
                  <td className="p-2 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))}

              {/* Empty row if needed for spacing */}
              {currentInvoice.items.length < 5 && Array.from({ length: 5 - currentInvoice.items.length }).map((_, i) => (
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
                  {currentInvoice.items.reduce((sum, item) => sum + item.quantity, 0)} Nos
                </td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 text-right font-bold">₹ {currentInvoice.totalTaxableAmount.toFixed(2)}</td>
              </tr>

              {/* Tax Calculation Rows */}
              <tr>
                <td rowSpan={3} colSpan={3} className="p-2 border-r border-gray-800 print:border-gray-800 align-top">
                  <div className="font-bold">Output Cgst</div>
                  <div className="font-bold">Output Sgst</div>
                  <div className="font-bold">Rounded Off</div>
                </td>
                <td colSpan={4} className="p-2 text-right">
                  <div>{currentInvoice.cgstAmount.toFixed(2)}</div>
                  <div>{currentInvoice.sgstAmount.toFixed(2)}</div>
                  <div>({Math.abs(currentInvoice.roundedOff).toFixed(2)})</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in Words */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold">Amount Chargeable (in words)</div>
          <div className="font-bold">{currentInvoice.amountInWords}</div>
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
              {currentInvoice.items.length > 0 && Array.from(
                new Set(currentInvoice.items.map(item => item.hsnSac))
              ).map((hsn, index) => {
                const itemsWithHsn = currentInvoice.items.filter(item => item.hsnSac === hsn);
                const taxableValue = itemsWithHsn.reduce((sum, item) => sum + item.amount, 0);
                const cgstAmount = (taxableValue * currentInvoice.cgstRate) / 100;
                const sgstAmount = (taxableValue * currentInvoice.sgstRate) / 100;
                const totalTax = cgstAmount + sgstAmount;
                
                return (
                  <tr key={index} className="border-b border-gray-800 print:border-gray-800">
                    <td className="p-2 border-r border-gray-800 print:border-gray-800">{hsn}</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{taxableValue.toFixed(2)}</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{currentInvoice.cgstRate}%</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{cgstAmount.toFixed(2)}</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{currentInvoice.sgstRate}%</td>
                    <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{sgstAmount.toFixed(2)}</td>
                    <td className="p-2 text-right">{totalTax.toFixed(2)}</td>
                  </tr>
                );
              })}
              
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">Total</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.totalTaxableAmount.toFixed(2)}</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.cgstAmount.toFixed(2)}</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800"></td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.sgstAmount.toFixed(2)}</td>
                <td className="p-2 text-right font-bold">{(currentInvoice.cgstAmount + currentInvoice.sgstAmount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Amount in Words */}
        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="flex">
            <div className="w-32 font-bold">Tax Amount (in words):</div>
            <div className="flex-grow font-bold">
              {currentInvoice.amountInWords}
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
              <div>{currentInvoice.bankName}</div>
            </div>
            <div className="flex">
              <div className="w-32">A/c No.</div>
              <div className="w-2">:</div>
              <div>{currentInvoice.accountNo}</div>
            </div>
            <div className="flex">
              <div className="w-32">Branch & IFS Code</div>
              <div className="w-2">:</div>
              <div>{currentInvoice.branchName} & {currentInvoice.ifscCode}</div>
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
            <div className="font-bold mb-10">for {currentInvoice.sellerName}</div>
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
              <div>: Tax Invoice - {currentInvoice.invoiceNo}</div>
              <div className="font-bold">Date</div>
              <div>: {formatDate(currentInvoice.invoiceDate)}</div>
            </div>
          </div>
          <div className="p-3 border-b border-gray-800 print:border-gray-800 flex justify-end">
            <div className="w-32 h-32">
              <QRCodeSVG 
                value={`EWB:${currentInvoice.eWayBillNo || 'NA'}`} 
                size={128} 
              />
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="grid grid-cols-[100px_1fr] gap-1">
            <div className="font-bold">IRN</div>
            <div>: {currentInvoice.irn}</div>
            <div className="font-bold">Ack No.</div>
            <div>: {currentInvoice.ackNo}</div>
            <div className="font-bold">Ack Date</div>
            <div>: {formatDate(currentInvoice.ackDate)}</div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold mb-2">1. e-Way Bill Details</div>
          <div className="grid grid-cols-2 gap-2">
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

        <div className="p-3 border-b border-gray-800 print:border-gray-800">
          <div className="font-bold mb-2">2. Address Details</div>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4 mt-4">
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
              {currentInvoice.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-800 print:border-gray-800">
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.hsnSac}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.description}</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800">{item.quantity} NOS</td>
                  <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right">{item.amount.toFixed(2)}</td>
                  <td className="p-2 text-right">{currentInvoice.cgstRate}+{currentInvoice.sgstRate}</td>
                </tr>
              ))}
              
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>Total Taxable Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.totalTaxableAmount.toFixed(2)}</td>
                <td></td>
              </tr>
              <tr className="border-b border-gray-800 print:border-gray-800">
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>Other Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">({Math.abs(currentInvoice.roundedOff).toFixed(2)})</td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>CGST Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.cgstAmount.toFixed(2)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>SGST Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.sgstAmount.toFixed(2)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold" colSpan={2}>Total Inv Amt</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800">:</td>
                <td className="p-2 border-r border-gray-800 print:border-gray-800 text-right font-bold">{currentInvoice.totalAmount.toFixed(2)}</td>
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
              <div>: {currentInvoice.transporterId}</div>
              <div className="font-semibold">Name</div>
              <div>: {currentInvoice.transporterName}</div>
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
              <div>: {currentInvoice.vehicleNo}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold">From</div>
              <div>: {currentInvoice.fromPlace}</div>
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

export default InvoicePrint;
