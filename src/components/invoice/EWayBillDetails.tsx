
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from '@/context/InvoiceContext';

interface EWayBillDetailsProps {
  register: UseFormRegister<Invoice>;
}

const EWayBillDetails: React.FC<EWayBillDetailsProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">e-Way Bill Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="ewbMode">Mode</Label>
            <Input id="ewbMode" {...register('ewbMode')} />
          </div>
          
          <div>
            <Label htmlFor="ewbDistance">Approx Distance (KM)</Label>
            <Input id="ewbDistance" {...register('ewbDistance')} />
          </div>
          
          <div>
            <Label htmlFor="ewbTransactionType">Transaction Type</Label>
            <Input id="ewbTransactionType" {...register('ewbTransactionType')} />
          </div>
          
          <div>
            <Label htmlFor="vehicleNo">Vehicle No.</Label>
            <Input id="vehicleNo" {...register('vehicleNo')} />
          </div>
          
          <div>
            <Label htmlFor="transporterId">Transporter ID</Label>
            <Input id="transporterId" {...register('transporterId')} />
          </div>
          
          <div>
            <Label htmlFor="transporterName">Transporter Name</Label>
            <Input id="transporterName" {...register('transporterName')} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EWayBillDetails;
