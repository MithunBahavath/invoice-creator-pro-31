
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { useCompanyDetails, SellerDetails } from '@/context/CompanyDetailsContext';
import { toast } from '@/components/ui/use-toast';

const SellerDetailsManagement: React.FC = () => {
  const {
    sellerDetails,
    activeSellerDetails,
    addSellerDetails,
    updateSellerDetails,
    deleteSellerDetails,
    setActiveSellerDetails,
    isLoading,
  } = useCompanyDetails();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDetails, setEditingDetails] = useState<SellerDetails | null>(null);
  const [formData, setFormData] = useState<SellerDetails>({
    company_name: '',
    address: '',
    gstin: '',
    contact: '',
    email: '',
    state: '',
    state_code: '',
  });

  const handleAdd = () => {
    setEditingDetails(null);
    setFormData({
      company_name: '',
      address: '',
      gstin: '',
      contact: '',
      email: '',
      state: '',
      state_code: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (details: SellerDetails) => {
    setEditingDetails(details);
    setFormData(details);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.address || !formData.gstin || !formData.state || !formData.state_code) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingDetails) {
        await updateSellerDetails({ ...formData, id: editingDetails.id });
      } else {
        await addSellerDetails(formData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving seller details:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (sellerDetails.length <= 1) {
      toast({
        title: 'Cannot Delete',
        description: 'At least one seller detail must exist',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this seller detail?')) {
      await deleteSellerDetails(id);
    }
  };

  const handleSetActive = async (details: SellerDetails) => {
    await setActiveSellerDetails(details);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Details Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Seller Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDetails ? 'Edit Seller Details' : 'Add Seller Details'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gstin">GSTIN *</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state_code">State Code *</Label>
                  <Input
                    id="state_code"
                    value={formData.state_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, state_code: e.target.value }))}
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
        {sellerDetails.map((details) => (
          <Card key={details.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{details.company_name}</CardTitle>
                  {activeSellerDetails?.id === details.id && (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  {activeSellerDetails?.id !== details.id && (
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
                  <p><strong>GSTIN:</strong> {details.gstin}</p>
                  <p><strong>State:</strong> {details.state} ({details.state_code})</p>
                  {details.contact && <p><strong>Contact:</strong> {details.contact}</p>}
                  {details.email && <p><strong>Email:</strong> {details.email}</p>}
                </div>
                <div>
                  <p><strong>Address:</strong></p>
                  <p className="text-gray-600">{details.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sellerDetails.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No seller details found. Add your first seller detail to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerDetailsManagement;
