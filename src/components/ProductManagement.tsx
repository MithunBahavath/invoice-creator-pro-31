
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
import { Plus, Save, X } from 'lucide-react';
import { PRESET_ITEMS, PresetItem } from '@/constants/billing';
import { toast } from 'sonner';

const ProductManagement = () => {
  const [items, setItems] = useState<PresetItem[]>(PRESET_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PresetItem>>({});

  const handleEdit = (item: PresetItem) => {
    setEditingId(item.description);
    setEditForm(item);
  };

  const handleSave = (item: PresetItem) => {
    setItems(current =>
      current.map(i =>
        i.description === item.description
          ? { ...i, ...editForm }
          : i
      )
    );
    setEditingId(null);
    setEditForm({});
    toast.success('Product updated successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = () => {
    const newItem: PresetItem = {
      description: 'New Item',
      hsnSac: '27111900',
      defaultRate: 0,
      gstRate: 5,
      usageType: 'Domestic',
      category: 'Cylinder',
    };
    setItems(current => [...current, newItem]);
    setEditingId(newItem.description);
    setEditForm(newItem);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Management</h2>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>HSN/SAC</TableHead>
                <TableHead>Default Rate</TableHead>
                <TableHead>GST Rate (%)</TableHead>
                <TableHead>Usage Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.description}>
                  {editingId === item.description ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm.description || ''}
                          onChange={e => setEditForm(current => ({ ...current, description: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.hsnSac || ''}
                          onChange={e => setEditForm(current => ({ ...current, hsnSac: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.defaultRate || 0}
                          onChange={e => setEditForm(current => ({ ...current, defaultRate: Number(e.target.value) }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.gstRate || 0}
                          onChange={e => setEditForm(current => ({ ...current, gstRate: Number(e.target.value) }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.usageType || ''}
                          onChange={e => setEditForm(current => ({ ...current, usageType: e.target.value as "Domestic" | "Commercial" }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.category || ''}
                          onChange={e => setEditForm(current => ({ ...current, category: e.target.value as "Cylinder" | "Bottle" }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(item)}>
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
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.hsnSac}</TableCell>
                      <TableCell>₹{item.defaultRate}</TableCell>
                      <TableCell>{item.gstRate}%</TableCell>
                      <TableCell>{item.usageType}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
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

export default ProductManagement;
