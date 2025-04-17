
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
import { toast } from 'sonner';

interface Cylinder {
  id: string;
  name: string;
  hsnSac: string;
  defaultRate: number;
}

const CylinderManagement = () => {
  const [cylinders, setCylinders] = useState<Cylinder[]>([
    { id: '1', name: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800 },
    { id: '2', name: '12kg', hsnSac: '27111900', defaultRate: 1200 },
    { id: '3', name: '17kg', hsnSac: '27111900', defaultRate: 1700 },
    { id: '4', name: '33kg', hsnSac: '27111900', defaultRate: 3300 },
  ]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Cylinder>>({});

  const handleEdit = (cylinder: Cylinder) => {
    setEditingId(cylinder.id);
    setEditForm(cylinder);
  };

  const handleSave = (cylinder: Cylinder) => {
    if (!editForm.name || !editForm.defaultRate) {
      toast.error('Name and rate are required');
      return;
    }
    
    setCylinders(current =>
      current.map(c =>
        c.id === cylinder.id
          ? { 
              ...c, 
              ...editForm, 
              hsnSac: editForm.hsnSac || '27111900',
              defaultRate: Number(editForm.defaultRate)
            }
          : c
      )
    );
    setEditingId(null);
    setEditForm({});
    toast.success('Cylinder updated successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = () => {
    const newCylinder: Cylinder = {
      id: Date.now().toString(),
      name: '',
      hsnSac: '27111900',
      defaultRate: 0
    };
    setCylinders(current => [...current, newCylinder]);
    setEditingId(newCylinder.id);
    setEditForm(newCylinder);
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
                          value={editForm.defaultRate || 0}
                          onChange={e => setEditForm(current => ({ 
                            ...current, 
                            defaultRate: parseFloat(e.target.value) || 0 
                          }))}
                          placeholder="Default rate"
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
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cylinder)}>
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

export default CylinderManagement;
