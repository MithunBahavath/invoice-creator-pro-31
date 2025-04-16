
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Invoice } from '@/context/InvoiceContext';

interface SellerInfoProps {
  register: UseFormRegister<Invoice>;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ register }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sellerName">Company Name</Label>
            <Input id="sellerName" {...register('sellerName')} />
          </div>
          
          <div>
            <Label htmlFor="sellerAddress">Address</Label>
            <Textarea id="sellerAddress" {...register('sellerAddress')} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerGstin">GSTIN/UIN</Label>
              <Input id="sellerGstin" {...register('sellerGstin')} />
            </div>
            <div>
              <Label htmlFor="sellerState">State</Label>
              <Input id="sellerState" {...register('sellerState')} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerContact">Contact</Label>
              <Input id="sellerContact" {...register('sellerContact')} />
            </div>
            <div>
              <Label htmlFor="sellerEmail">Email</Label>
              <Input id="sellerEmail" type="email" {...register('sellerEmail')} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
