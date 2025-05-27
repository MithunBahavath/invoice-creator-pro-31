
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useCylinders } from '@/context/CylinderContext';
import { toast } from '@/components/ui/use-toast';

const CylinderManagement: React.FC = () => {
  const { cylinders, addCylinder, updateCylinder, deleteCylinder } = useCylinders();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newCylinder, setNewCylinder] = useState({
    name: '',
    hsnSac: '',
    defaultRate: '',
    gstRate: '',
    petBottlesRate: ''
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    hsnSac: '',
    defaultRate: '',
    gstRate: '',
    petBottlesRate: ''
  });

  const generateCylinderName = () => {
    const nextNumber = cylinders.length + 1;
    return `Cylinder ${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleAddCylinder = () => {
    if (!newCylinder.name.trim()) {
      toast({
        title: 'Error',
        description: 'Cylinder name is required',
        variant: 'destructive',
      });
      return;
    }

    const cylinder = {
      name: newCylinder.name,
      hsnSac: newCylinder.hsnSac,
      defaultRate: Number(newCylinder.defaultRate || 0),
      gstRate: Number(newCylinder.gstRate || 0),
      petBottlesRate: Number(newCylinder.petBottlesRate || 0)
    };

    addCylinder(cylinder);
    setNewCylinder({
      name: '',
      hsnSac: '',
      defaultRate: '',
      gstRate: '',
      petBottlesRate: ''
    });
    setIsAdding(false);
    
    toast({
      title: 'Success',
      description: 'Cylinder added successfully',
    });
  };

  const handleEditCylinder = (cylinder: any) => {
    const updatedCylinder = {
      id: cylinder.id,
      name: editForm.name,
      hsnSac: editForm.hsnSac,
      defaultRate: Number(editForm.defaultRate || 0),
      gstRate: Number(editForm.gstRate || 0),
      petBottlesRate: Number(editForm.petBottlesRate || 0)
    };

    // Fix: Compare cylinder.id (string) with editingId (string | null)
    if (editingId && cylinder.id === editingId) {
      updateCylinder(updatedCylinder);
    }
    
    setEditingId(null);
    
    toast({
      title: 'Success',
      description: 'Cylinder updated successfully',
    });
  };

  const startEditing = (cylinder: any) => {
    setEditingId(cylinder.id);
    setEditForm({
      name: cylinder.name,
      hsnSac: cylinder.hsnSac,
      defaultRate: cylinder.defaultRate.toString(),
      gstRate: cylinder.gstRate.toString(),
      petBottlesRate: cylinder.petBottlesRate?.toString() || '0'
    });
  };

  const handleDelete = (id: string) => {
    deleteCylinder(id);
    toast({
      title: 'Success',
      description: 'Cylinder deleted successfully',
    });
  };

  const startAdding = () => {
    const autoName = generateCylinderName();
    setNewCylinder({
      name: autoName,
      hsnSac: '27111900',
      defaultRate: '',
      gstRate: '5',
      petBottlesRate: '0'
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cylinder Management</h1>
        <Button onClick={startAdding} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" /> Add Cylinder
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Cylinder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="newName">Name</Label>
                <Input
                  id="newName"
                  value={newCylinder.name}
                  onChange={(e) => setNewCylinder({...newCylinder, name: e.target.value})}
                  placeholder="Cylinder name"
                />
              </div>
              
              <div>
                <Label htmlFor="newHsn">HSN/SAC</Label>
                <Input
                  id="newHsn"
                  value={newCylinder.hsnSac}
                  onChange={(e) => setNewCylinder({...newCylinder, hsnSac: e.target.value})}
                  placeholder="HSN/SAC"
                />
              </div>
              
              <div>
                <Label htmlFor="newRate">Default Rate</Label>
                <Input
                  id="newRate"
                  type="number"
                  value={newCylinder.defaultRate}
                  onChange={(e) => setNewCylinder({...newCylinder, defaultRate: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="newGst">GST Rate (%)</Label>
                <Input
                  id="newGst"
                  type="number"
                  value={newCylinder.gstRate}
                  onChange={(e) => setNewCylinder({...newCylinder, gstRate: e.target.value})}
                  placeholder="5"
                />
              </div>
              
              <div>
                <Label htmlFor="newPetRate">PET Bottles Rate</Label>
                <Input
                  id="newPetRate"
                  type="number"
                  value={newCylinder.petBottlesRate}
                  onChange={(e) => setNewCylinder({...newCylinder, petBottlesRate: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleAddCylinder}>
                <Save className="mr-2 h-4 w-4" /> Save Cylinder
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {cylinders.map((cylinder) => (
          <Card key={cylinder.id}>
            <CardContent className="pt-6">
              {editingId === cylinder.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor={`editName-${cylinder.id}`}>Name</Label>
                      <Input
                        id={`editName-${cylinder.id}`}
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editHsn-${cylinder.id}`}>HSN/SAC</Label>
                      <Input
                        id={`editHsn-${cylinder.id}`}
                        value={editForm.hsnSac}
                        onChange={(e) => setEditForm({...editForm, hsnSac: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editRate-${cylinder.id}`}>Default Rate</Label>
                      <Input
                        id={`editRate-${cylinder.id}`}
                        type="number"
                        value={editForm.defaultRate}
                        onChange={(e) => setEditForm({...editForm, defaultRate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editGst-${cylinder.id}`}>GST Rate (%)</Label>
                      <Input
                        id={`editGst-${cylinder.id}`}
                        type="number"
                        value={editForm.gstRate}
                        onChange={(e) => setEditForm({...editForm, gstRate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editPetRate-${cylinder.id}`}>PET Bottles Rate</Label>
                      <Input
                        id={`editPetRate-${cylinder.id}`}
                        type="number"
                        value={editForm.petBottlesRate}
                        onChange={(e) => setEditForm({...editForm, petBottlesRate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEditCylinder(cylinder)}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                    <div>
                      <p className="font-medium">{cylinder.name}</p>
                      <p className="text-sm text-gray-500">Name</p>
                    </div>
                    <div>
                      <p className="font-medium">{cylinder.hsnSac}</p>
                      <p className="text-sm text-gray-500">HSN/SAC</p>
                    </div>
                    <div>
                      <p className="font-medium">₹{cylinder.defaultRate}</p>
                      <p className="text-sm text-gray-500">Default Rate</p>
                    </div>
                    <div>
                      <p className="font-medium">{cylinder.gstRate}%</p>
                      <p className="text-sm text-gray-500">GST Rate</p>
                    </div>
                    <div>
                      <p className="font-medium">₹{cylinder.petBottlesRate || 0}</p>
                      <p className="text-sm text-gray-500">PET Bottles Rate</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(cylinder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cylinder.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {cylinders.length === 0 && !isAdding && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No cylinders found. Add your first cylinder to get started.</p>
              <Button onClick={startAdding}>
                <Plus className="mr-2 h-4 w-4" /> Add First Cylinder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CylinderManagement;
