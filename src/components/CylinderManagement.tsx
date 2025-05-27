
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
  petBottlesRate?: string | number;
};

const CylinderManagement = () => {
  const { cylinders, addCylinder, updateCylinder, deleteCylinder, isLoading } = useCylinders();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CylinderEditForm>({});

  // Function to generate next cylinder name
  const generateNextCylinderName = () => {
    const existingNumbers = cylinders
      .map(c => c.name.match(/Cylinder (\d+)/))
      .filter(match => match)
      .map(match => parseInt(match![1], 10));
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `Cylinder ${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleEdit = (cylinder: Cylinder) => {
    setEditingId(cylinder.id);
    setEditForm(cylinder);
  };

  const handleSave = (cylinder: Cylinder) => {
    if (!editForm.name || editForm.name.trim() === '') {
      toast.error('Name is required and cannot be empty');
      return;
    }
    
    // Check if defaultRate is undefined, null, or empty string
    if (editForm.defaultRate === undefined || editForm.defaultRate === null || editForm.defaultRate === '') {
      toast.error('Default rate is required');
      return;
    }
    
    // Convert string values to numbers before saving
    const updatedCylinder = { 
      ...cylinder, 
      ...editForm, 
      hsnSac: editForm.hsnSac || '27111900',
      defaultRate: Number(editForm.defaultRate),
      gstRate: Number(editForm.gstRate || 5),
      petBottlesRate: Number(editForm.petBottlesRate || 0)
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
      name: generateNextCylinderName(),
      hsnSac: '27111900',
      defaultRate: 800,
      gstRate: 5,
      petBottlesRate: 0
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
          <Button onClick={handleAdd} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Cylinder
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>HSN/SAC</TableHead>
                  <TableHead>Default Rate</TableHead>
                  <TableHead>GST Rate (%)</TableHead>
                  <TableHead>PET Bottles Rate</TableHead>
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
                            placeholder="e.g. Cylinder 001"
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
                            value={editForm.defaultRate !== undefined && editForm.defaultRate !== null ? editForm.defaultRate : ''}
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
                            value={editForm.gstRate !== undefined && editForm.gstRate !== null ? editForm.gstRate : ''}
                            onFocus={handleInputFocus}
                            onChange={e => setEditForm((current) => ({ 
                              ...current, 
                              gstRate: e.target.value === '' ? '' : e.target.value 
                            }) as CylinderEditForm)}
                            placeholder="GST rate"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={editForm.petBottlesRate !== undefined && editForm.petBottlesRate !== null ? editForm.petBottlesRate : ''}
                            onFocus={handleInputFocus}
                            onChange={e => setEditForm((current) => ({ 
                              ...current, 
                              petBottlesRate: e.target.value === '' ? '' : e.target.value 
                            }) as CylinderEditForm)}
                            placeholder="PET bottles rate"
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
                        <TableCell>₹{(cylinder.petBottlesRate || 0).toFixed(2)}</TableCell>
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
        )}
      </CardContent>
    </Card>
  );
};

export default CylinderManagement;
