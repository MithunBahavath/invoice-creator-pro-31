
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormRegister } from 'react-hook-form';
import { Invoice } from '@/context/InvoiceContext';

interface InvoiceDetailsSectionProps {
  register: UseFormRegister<Invoice>;
}

export const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoiceNo">Invoice No.</Label>
            <Input id="invoiceNo" {...register('invoiceNo')} required />
          </div>
          
          <div>
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input id="invoiceDate" type="date" {...register('invoiceDate')} required />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
