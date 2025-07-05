
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormRegister } from 'react-hook-form';
import { Invoice } from '@/context/InvoiceContext';

interface InvoiceTaxSectionProps {
  register: UseFormRegister<Invoice>;
  mode: string;
}

export const InvoiceTaxSection: React.FC<InvoiceTaxSectionProps> = ({ register, mode }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Tax & Total</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="gstInfo">GST Information</Label>
              <p className="text-sm text-muted-foreground mb-4">
                GST rates are applied automatically based on the selected {mode} type from settings.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cgstAmount">CGST Amount</Label>
                <Input
                  id="cgstAmount"
                  {...register('cgstAmount')}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="sgstAmount">SGST Amount</Label>
                <Input
                  id="sgstAmount"
                  {...register('sgstAmount')}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalTaxableAmount">Total Taxable Amount</Label>
              <Input
                id="totalTaxableAmount"
                {...register('totalTaxableAmount')}
                readOnly
                className="bg-gray-50 font-semibold"
              />
            </div>
            
            <div>
              <Label htmlFor="roundedOff">Rounded Off</Label>
              <Input
                id="roundedOff"
                {...register('roundedOff')}
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                {...register('totalAmount')}
                readOnly
                className="bg-gray-50 font-semibold text-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="amountInWords">Amount In Words</Label>
              <Input
                id="amountInWords"
                {...register('amountInWords')}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
