
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
import { toast } from 'sonner';
import { useCylinders, Cylinder } from '@/context/CylinderContext';

// Define a type for our edit form that explicitly allows string or number for rate fields
type CylinderEditForm = Partial<Cylinder> & { 
  defaultRate?: string | number;
  gstRate?: string | number;
};

const CylinderManagement = () => {
  const { cylinders, addCylinder, updateCylinder, deleteCylinder } = useCylinders();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CylinderEditForm>({});

  const handleEdit = (cylinder: Cylinder) => {
    setEditingId(cylinder.id);
    setEditForm(cylinder);
  };

  const handleSave = (cylinder: Cylinder) => {
    if (!editForm.name || editForm.name.trim() === '') {
      toast.error('Name is required and cannot be empty');
      return;
    }
    
    // Fix: Change the comparison to check for undefined or empty string
    if (editForm.defaultRate === undefined || editForm.defaultRate === '') {
      toast.error('Default rate is required');
      return;
    }
    
    // Convert string values to numbers before saving
    const updatedCylinder = { 
      ...cylinder, 
      ...editForm, 
      hsnSac: editForm.hsnSac || '27111900',
      defaultRate: Number(editForm.defaultRate),
      gstRate: Number(editForm.gstRate || 5)
    };

    if (cylinder.id === editingId) {
      updateCylinder(updatedCylinder);
    }
    
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = () => {
    const newCylinder = {
      name: '8kg Cylinder',  // Provide a default name
      hsnSac: '27111900',
      defaultRate: 800,
      gstRate: 5
    };
    addCylinder(newCylinder);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this cylinder? This action cannot be undone.')) {
      deleteCylinder(id);
      toast.success('Cylinder deleted successfully');
    }
  };

  // Handle input focus to select all text
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cylinder Management</h2>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Cylinder
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>HSN/SAC</TableHead>
                <TableHead>Default Rate</TableHead>
                <TableHead>GST Rate (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cylinders.map(cylinder => (
                <TableRow key={cylinder.id}>
                  {editingId === cylinder.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm.name || ''}
                          onChange={e => setEditForm(current => ({ ...current, name: e.target.value }))}
                          placeholder="e.g. 10kg Cylinder"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.hsnSac || '27111900'}
                          onChange={e => setEditForm(current => ({ ...current, hsnSac: e.target.value }))}
                          placeholder="HSN/SAC code"
                          readOnly
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.defaultRate === 0 || editForm.defaultRate ? editForm.defaultRate : ''}
                          onFocus={handleInputFocus}
                          onChange={e => setEditForm((current) => ({ 
                            ...current, 
                            defaultRate: e.target.value === '' ? '' : e.target.value 
                          }) as CylinderEditForm)}
                          placeholder="Default rate"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.gstRate === 0 || editForm.gstRate ? editForm.gstRate : ''}
                          onFocus={handleInputFocus}
                          onChange={e => setEditForm((current) => ({ 
                            ...current, 
                            gstRate: e.target.value === '' ? '' : e.target.value 
                          }) as CylinderEditForm)}
                          placeholder="GST rate"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(cylinder)}>
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
                      <TableCell>{cylinder.name}</TableCell>
                      <TableCell>{cylinder.hsnSac}</TableCell>
                      <TableCell>₹{cylinder.defaultRate.toFixed(2)}</TableCell>
                      <TableCell>{cylinder.gstRate}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(cylinder)}>
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(cylinder.id)}
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

export default CylinderManagement;
