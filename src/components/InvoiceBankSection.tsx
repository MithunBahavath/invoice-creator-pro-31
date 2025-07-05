
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormRegister } from 'react-hook-form';
import { Invoice } from '@/context/InvoiceContext';

interface InvoiceBankSectionProps {
  register: UseFormRegister<Invoice>;
}

export const InvoiceBankSection: React.FC<InvoiceBankSectionProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" {...register('bankName')} readOnly className="bg-gray-50" />
          </div>
          
          <div>
            <Label htmlFor="accountNo">A/C No.</Label>
            <Input id="accountNo" {...register('accountNo')} readOnly className="bg-gray-50" />
          </div>
          
          <div>
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input id="ifscCode" {...register('ifscCode')} readOnly className="bg-gray-50" />
          </div>
          
          <div>
            <Label htmlFor="branchName">Branch</Label>
            <Input id="branchName" {...register('branchName')} readOnly className="bg-gray-50" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
