
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Save, X, Trash2 } from 'lucide-react';
import { Buyer } from '@/constants/billing';
import { toast } from 'sonner';
import { useBuyers } from '@/context/BuyerContext';

const BottleBuyerManagement = () => {
  const { buyers, addBuyer, updateBuyer, deleteBuyer } = useBuyers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Buyer>>({});

  const handleEdit = (buyer: Buyer) => {
    setEditingId(buyer.gstin);
    setEditForm(buyer);
  };

  const handleSave = (buyer: Buyer) => {
    if (!editForm.name || !editForm.gstin) {
      toast.error('Name and GSTIN are required');
      return;
    }

    const updatedBuyer = { ...buyer, ...editForm };
    
    if (buyer.gstin === editingId) {
      updateBuyer(updatedBuyer);
    }
    
    setEditingId(null);
    setEditForm({});
    toast.success('Bottle buyer updated successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = () => {
    const newBuyer: Buyer = {
      name: 'New Bottle Buyer',
      address: '',
      gstin: `33${Date.now()}1Z5`,
      state: 'Tamil Nadu',
      stateCode: '33'
    };
    addBuyer(newBuyer);
    setEditingId(newBuyer.gstin);
    setEditForm(newBuyer);
  };

  const handleDelete = (gstin: string) => {
    if (window.confirm('Are you sure you want to delete this bottle buyer? This action cannot be undone.')) {
      deleteBuyer(gstin);
      toast.success('Bottle buyer deleted successfully');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bottle Buyer Management</h2>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Bottle Buyer
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>State</TableHead>
                <TableHead>State Code</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyers.map(buyer => (
                <TableRow key={buyer.gstin}>
                  {editingId === buyer.gstin ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm.name || ''}
                          onChange={e => setEditForm(current => ({ ...current, name: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.address || ''}
                          onChange={e => setEditForm(current => ({ ...current, address: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.gstin || ''}
                          onChange={e => setEditForm(current => ({ ...current, gstin: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.state || ''}
                          onChange={e => setEditForm(current => ({ ...current, state: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.stateCode || ''}
                          onChange={e => setEditForm(current => ({ ...current, stateCode: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(buyer)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{buyer.name}</TableCell>
                      <TableCell>{buyer.address}</TableCell>
                      <TableCell>{buyer.gstin}</TableCell>
                      <TableCell>{buyer.state}</TableCell>
                      <TableCell>{buyer.stateCode}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(buyer)}>
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(buyer.gstin)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BottleBuyerManagement;
