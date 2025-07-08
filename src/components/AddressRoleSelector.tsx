
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressRoleSelectorProps {
  selectedRole: 'seller' | 'buyer';
  onRoleChange: (role: 'seller' | 'buyer') => void;
}

const AddressRoleSelector: React.FC<AddressRoleSelectorProps> = ({ 
  selectedRole, 
  onRoleChange 
}) => {
  return (
    <div className="mb-4">
      <Label>AGNEE GAS DISTRIBUTER Address Role</Label>
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select role for AGNEE GAS DISTRIBUTER" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="seller">Use as Seller</SelectItem>
          <SelectItem value="buyer">Use as Buyer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AddressRoleSelector;
