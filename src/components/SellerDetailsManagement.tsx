
import React, { useState } from 'react';
import { useSellerDetails } from '@/context/SellerDetailsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

const SellerDetailsManagement = () => {
  const { 
    sellerDetails, 
    activeSellerDetails, 
    addSellerDetails, 
    updateSellerDetails, 
    deleteSellerDetails, 
    setActiveSellerDetails,
    isLoading 
  } = useSellerDetails();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    gstin: '',
    contact: '',
    email: '',
    state: '',
    state_code: '',
    is_active: false,
  });

  const resetForm = () => {
    setFormData({
      company_name: '',
      address: '',
      gstin: '',
      contact: '',
      email: '',
      state: '',
      state_code: '',
      is_active: false,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateSellerDetails(editingItem, formData);
      } else {
        await addSellerDetails(formData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving seller details:', error);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      company_name: item.company_name,
      address: item.address,
      gstin: item.gstin,
      contact: item.contact || '',
      email: item.email || '',
      state: item.state,
      state_code: item.state_code,
      is_active: item.is_active,
    });
    setEditingItem(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this seller details?')) {
      await deleteSellerDetails(id);
    }
  };

  const handleSetActive = async (id: string) => {
    await setActiveSellerDetails(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Details Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Seller Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Seller Details' : 'Add New Seller Details'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gstin">GSTIN *</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state_code">State Code *</Label>
                  <Input
                    id="state_code"
                    value={formData.state_code}
                    onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
                    required
                  />
                </div>
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

      {activeSellerDetails && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Active Seller Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Company:</strong> {activeSellerDetails.company_name}</div>
              <div><strong>GSTIN:</strong> {activeSellerDetails.gstin}</div>
              <div className="col-span-2"><strong>Address:</strong> {activeSellerDetails.address}</div>
              <div><strong>Contact:</strong> {activeSellerDetails.contact || 'N/A'}</div>
              <div><strong>Email:</strong> {activeSellerDetails.email || 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sellerDetails.map((item) => (
          <Card key={item.id} className={item.is_active ? 'border-green-300' : ''}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <strong>{item.company_name}</strong>
                      {item.is_active && <Badge variant="secondary">Active</Badge>}
                    </div>
                    <div className="text-sm text-gray-600">GSTIN: {item.gstin}</div>
                    <div className="text-sm text-gray-600">{item.address}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Contact: {item.contact || 'N/A'}</div>
                    <div>Email: {item.email || 'N/A'}</div>
                    <div>State: {item.state} ({item.state_code})</div>
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

      {sellerDetails.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No seller details found. Add your first seller details to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerDetailsManagement;
