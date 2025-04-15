
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { BUYERS } from '@/constants/billing';
import type { Buyer } from '@/constants/billing';

interface BuyerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buyer: Buyer) => void;
  editingBuyer?: Buyer | null;
}

const BuyerDialog: React.FC<BuyerDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBuyer
}) => {
  const [formData, setFormData] = React.useState<Buyer>({
    name: '',
    address: '',
    gstin: '',
    state: 'Tamil Nadu',
    stateCode: '33'
  });

  React.useEffect(() => {
    if (editingBuyer) {
      setFormData(editingBuyer);
    } else {
      setFormData({
        name: '',
        address: '',
        gstin: '',
        state: 'Tamil Nadu',
        stateCode: '33'
      });
    }
  }, [editingBuyer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingBuyer ? 'Edit Buyer' : 'Add New Buyer'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="gstin">GSTIN/UIN</Label>
            <Input
              id="gstin"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingBuyer ? 'Update' : 'Add'} Buyer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerDialog;
