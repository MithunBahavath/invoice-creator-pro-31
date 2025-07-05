
import React, { useState } from 'react';
import { useBankDetails } from '@/context/BankDetailsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

const BankDetailsManagement = () => {
  const { 
    bankDetails, 
    activeBankDetails, 
    addBankDetails, 
    updateBankDetails, 
    deleteBankDetails, 
    setActiveBankDetails,
    isLoading 
  } = useBankDetails();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    branch_name: '',
    is_active: false,
  });

  const resetForm = () => {
    setFormData({
      bank_name: '',
      account_no: '',
      ifsc_code: '',
      branch_name: '',
      is_active: false,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateBankDetails(editingItem, formData);
      } else {
        await addBankDetails(formData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      bank_name: item.bank_name,
      account_no: item.account_no,
      ifsc_code: item.ifsc_code,
      branch_name: item.branch_name,
      is_active: item.is_active,
    });
    setEditingItem(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bank details?')) {
      await deleteBankDetails(id);
    }
  };

  const handleSetActive = async (id: string) => {
    await setActiveBankDetails(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bank Details Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Bank Details' : 'Add New Bank Details'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bank_name">Bank Name *</Label>
                <Input
                  id="bank_name"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="account_no">Account Number *</Label>
                <Input
                  id="account_no"
                  value={formData.account_no}
                  onChange={(e) => setFormData({ ...formData, account_no: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ifsc_code">IFSC Code *</Label>
                <Input
                  id="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="branch_name">Branch Name *</Label>
                <Input
                  id="branch_name"
                  value={formData.branch_name}
                  onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {activeBankDetails && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Active Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Bank:</strong> {activeBankDetails.bank_name}</div>
              <div><strong>Account No:</strong> {activeBankDetails.account_no}</div>
              <div><strong>IFSC:</strong> {activeBankDetails.ifsc_code}</div>
              <div><strong>Branch:</strong> {activeBankDetails.branch_name}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {bankDetails.map((item) => (
          <Card key={item.id} className={item.is_active ? 'border-green-300' : ''}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <strong>{item.bank_name}</strong>
                    {item.is_active && <Badge variant="secondary">Active</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Account: {item.account_no}</div>
                    <div>IFSC: {item.ifsc_code}</div>
                    <div className="col-span-2">Branch: {item.branch_name}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!item.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(item.id)}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bankDetails.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No bank details found. Add your first bank details to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankDetailsManagement;
