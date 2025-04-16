
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from '@/context/InvoiceContext';

interface BankDetailsProps {
  register: UseFormRegister<Invoice>;
}

const BankDetails: React.FC<BankDetailsProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" {...register('bankName')} />
          </div>
          
          <div>
            <Label htmlFor="accountNo">A/C No.</Label>
            <Input id="accountNo" {...register('accountNo')} />
          </div>
          
          <div>
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input id="ifscCode" {...register('ifscCode')} />
          </div>
          
          <div>
            <Label htmlFor="branchName">Branch</Label>
            <Input id="branchName" {...register('branchName')} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetails;
