
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from '@/context/InvoiceContext';

interface TaxCalculationProps {
  form: UseFormReturn<Invoice>;
}

const TaxCalculation: React.FC<TaxCalculationProps> = ({ form }) => {
  const { register, watch } = form;
  const watchItems = watch('items');

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cgstRate' | 'sgstRate') => {
    const value = parseFloat(e.target.value) || 0;
    form.setValue(field, value);
    watchItems?.forEach((_, index) => {
      const item = form.getValues(`items.${index}`);
      if (item) {
        const quantity = parseFloat(item.quantity?.toString() || '0') || 0;
        const ratePerItem = parseFloat(item.ratePerItem?.toString() || '0') || 0;
        const amount = quantity * ratePerItem;
        form.setValue(`items.${index}.amount`, amount);
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Tax & Total</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cgstRate">CGST Rate (%)</Label>
                <Input
                  id="cgstRate"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('cgstRate')}
                  onChange={(e) => handleTaxRateChange(e, 'cgstRate')}
                />
              </div>
              <div>
                <Label htmlFor="cgstAmount">CGST Amount</Label>
                <Input
                  id="cgstAmount"
                  {...register('cgstAmount')}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sgstRate">SGST Rate (%)</Label>
                <Input
                  id="sgstRate"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('sgstRate')}
                  onChange={(e) => handleTaxRateChange(e, 'sgstRate')}
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

export default TaxCalculation;
