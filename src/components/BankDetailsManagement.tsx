
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { useCompanyDetails, BankDetails } from '@/context/CompanyDetailsContext';
import { toast } from '@/components/ui/use-toast';

const BankDetailsManagement: React.FC = () => {
  const {
    bankDetails,
    activeBankDetails,
    addBankDetails,
    updateBankDetails,
    deleteBankDetails,
    setActiveBankDetails,
    isLoading,
  } = useCompanyDetails();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDetails, setEditingDetails] = useState<BankDetails | null>(null);
  const [formData, setFormData] = useState<BankDetails>({
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    branch_name: '',
  });

  const handleAdd = () => {
    setEditingDetails(null);
    setFormData({
      bank_name: '',
      account_no: '',
      ifsc_code: '',
      branch_name: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (details: BankDetails) => {
    setEditingDetails(details);
    setFormData(details);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bank_name || !formData.account_no || !formData.ifsc_code || !formData.branch_name) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingDetails) {
        await updateBankDetails({ ...formData, id: editingDetails.id });
      } else {
        await addBankDetails(formData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (bankDetails.length <= 1) {
      toast({
        title: 'Cannot Delete',
        description: 'At least one bank detail must exist',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this bank detail?')) {
      await deleteBankDetails(id);
    }
  };

  const handleSetActive = async (details: BankDetails) => {
    await setActiveBankDetails(details);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bank Details Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDetails ? 'Edit Bank Details' : 'Add Bank Details'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name">Bank Name *</Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account_no">Account Number *</Label>
                  <Input
                    id="account_no"
                    value={formData.account_no}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_no: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ifsc_code">IFSC Code *</Label>
                  <Input
                    id="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="branch_name">Branch Name *</Label>
                  <Input
                    id="branch_name"
                    value={formData.branch_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, branch_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {editingDetails ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {bankDetails.map((details) => (
          <Card key={details.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{details.bank_name}</CardTitle>
                  {activeBankDetails?.id === details.id && (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  {activeBankDetails?.id !== details.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetActive(details)}
                      disabled={isLoading}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(details)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(details.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Account No:</strong> {details.account_no}</p>
                  <p><strong>IFSC Code:</strong> {details.ifsc_code}</p>
                </div>
                <div>
                  <p><strong>Branch:</strong> {details.branch_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bankDetails.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No bank details found. Add your first bank detail to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankDetailsManagement;
