
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from '@/context/InvoiceContext';

interface InvoiceDetailsProps {
  register: UseFormRegister<Invoice>;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="invoiceNo">Invoice No.</Label>
            <Input id="invoiceNo" {...register('invoiceNo')} required />
          </div>
          
          <div>
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input id="invoiceDate" type="date" {...register('invoiceDate')} required />
          </div>
          
          <div>
            <Label htmlFor="eWayBillNo">e-Way Bill No.</Label>
            <Input id="eWayBillNo" {...register('eWayBillNo')} />
          </div>
          
          <div>
            <Label htmlFor="deliveryNote">Delivery Note</Label>
            <Input id="deliveryNote" {...register('deliveryNote')} />
          </div>
          
          <div>
            <Label htmlFor="reference">Reference No. & Date</Label>
            <Input id="reference" {...register('reference')} />
          </div>
          
          <div>
            <Label htmlFor="buyerOrderNo">Buyer's Order No.</Label>
            <Input id="buyerOrderNo" {...register('buyerOrderNo')} />
          </div>
          
          <div>
            <Label htmlFor="dispatchDocNo">Dispatch Doc No.</Label>
            <Input id="dispatchDocNo" {...register('dispatchDocNo')} />
          </div>
          
          <div>
            <Label htmlFor="dispatchedThrough">Dispatched Through</Label>
            <Input id="dispatchedThrough" {...register('dispatchedThrough')} />
          </div>
          
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" {...register('destination')} />
          </div>
          
          <div>
            <Label htmlFor="termsOfDelivery">Terms of Delivery</Label>
            <Input id="termsOfDelivery" {...register('termsOfDelivery')} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetails;
