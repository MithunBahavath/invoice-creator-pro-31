
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Invoice } from '@/context/InvoiceContext';
import { Buyer } from '@/constants/billing';

interface InvoiceBuyerSectionProps {
  register: UseFormRegister<Invoice>;
  setValue: UseFormSetValue<Invoice>;
  buyers: Buyer[];
  mode: string;
}

export const InvoiceBuyerSection: React.FC<InvoiceBuyerSectionProps> = ({ 
  register, 
  setValue, 
  buyers, 
  mode 
}) => {
  const handleBuyerSelect = (buyerId: string) => {
    const selectedBuyer = buyers.find(buyer => buyer.gstin === buyerId);
    if (selectedBuyer) {
      setValue('buyerName', selectedBuyer.name);
      setValue('buyerAddress', selectedBuyer.address);
      setValue('buyerGstin', selectedBuyer.gstin);
      setValue('buyerState', selectedBuyer.state);
      setValue('buyerStateCode', selectedBuyer.stateCode);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
        <div className="space-y-4">
          <div>
            <Label>Select {mode === 'cylinder' ? 'Cylinder' : 'Bottle'} Customer</Label>
            <Select onValueChange={handleBuyerSelect}>
              <SelectTrigger>
                <SelectValue placeholder={`Select a ${mode} customer`} />
              </SelectTrigger>
              <SelectContent>
                {buyers.map((buyer) => (
                  <SelectItem key={buyer.gstin} value={buyer.gstin}>
                    {buyer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="buyerName">Company Name</Label>
            <Input id="buyerName" {...register('buyerName')} readOnly />
          </div>
          
          <div>
            <Label htmlFor="buyerAddress">Address</Label>
            <Textarea id="buyerAddress" {...register('buyerAddress')} readOnly />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyerGstin">GSTIN/UIN</Label>
              <Input id="buyerGstin" {...register('buyerGstin')} readOnly />
            </div>
            <div>
              <Label htmlFor="buyerState">State</Label>
              <Input id="buyerState" {...register('buyerState')} readOnly />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
