
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
import { Plus, Save, X, Trash2, Edit } from 'lucide-react';
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Bottle Buyer Management</h2>
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add New Bottle Buyer</span>
            <span className="sm:hidden">Add Buyer</span>
          </Button>
        </div>

        {/* Mobile-friendly table container */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm min-w-[120px]">Name</TableHead>
                    <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm min-w-[150px]">Address</TableHead>
                    <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm min-w-[120px]">GSTIN</TableHead>
                    <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm min-w-[100px]">State</TableHead>
                    <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm min-w-[80px]">Code</TableHead>
                    <TableHead className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyers.map(buyer => (
                    <TableRow key={buyer.gstin}>
                      {editingId === buyer.gstin ? (
                        <>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <Input
                              value={editForm.name || ''}
                              onChange={e => setEditForm(current => ({ ...current, name: e.target.value }))}
                              className="min-w-[100px] text-xs sm:text-sm"
                            />
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <Input
                              value={editForm.address || ''}
                              onChange={e => setEditForm(current => ({ ...current, address: e.target.value }))}
                              className="min-w-[120px] text-xs sm:text-sm"
                            />
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <Input
                              value={editForm.gstin || ''}
                              onChange={e => setEditForm(current => ({ ...current, gstin: e.target.value }))}
                              className="min-w-[100px] text-xs sm:text-sm"
                            />
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <Input
                              value={editForm.state || ''}
                              onChange={e => setEditForm(current => ({ ...current, state: e.target.value }))}
                              className="min-w-[80px] text-xs sm:text-sm"
                            />
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <Input
                              value={editForm.stateCode || ''}
                              onChange={e => setEditForm(current => ({ ...current, stateCode: e.target.value }))}
                              className="min-w-[60px] text-xs sm:text-sm"
                            />
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <div className="flex gap-1 sm:gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleSave(buyer)} className="h-8 w-8 p-0">
                                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium">{buyer.name}</TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 text-xs sm:text-sm max-w-[150px] truncate" title={buyer.address}>{buyer.address}</TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-mono">{buyer.gstin}</TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{buyer.state}</TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{buyer.stateCode}</TableCell>
                          <TableCell className="px-2 sm:px-4 py-2">
                            <div className="flex gap-1 sm:gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(buyer)} className="h-8 w-8 p-0 sm:w-auto sm:px-2">
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(buyer.gstin)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
          </div>
        </div>

        {buyers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">No bottle buyers found. Add your first buyer to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BottleBuyerManagement;
