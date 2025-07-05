
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormRegister } from 'react-hook-form';
import { Invoice } from '@/context/InvoiceContext';

interface InvoiceSellerSectionProps {
  register: UseFormRegister<Invoice>;
}

export const InvoiceSellerSection: React.FC<InvoiceSellerSectionProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sellerName">Company Name</Label>
            <Input id="sellerName" {...register('sellerName')} readOnly className="bg-gray-50" />
          </div>
          
          <div>
            <Label htmlFor="sellerAddress">Address</Label>
            <Textarea id="sellerAddress" {...register('sellerAddress')} readOnly className="bg-gray-50" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerGstin">GSTIN/UIN</Label>
              <Input id="sellerGstin" {...register('sellerGstin')} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="sellerState">State</Label>
              <Input id="sellerState" {...register('sellerState')} readOnly className="bg-gray-50" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerContact">Contact</Label>
              <Input id="sellerContact" {...register('sellerContact')} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="sellerEmail">Email</Label>
              <Input id="sellerEmail" type="email" {...register('sellerEmail')} readOnly className="bg-gray-50" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
