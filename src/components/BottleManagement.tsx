
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useBottles } from '@/context/BottleContext';
import { toast } from '@/components/ui/use-toast';

const BottleManagement: React.FC = () => {
  const { bottles, addBottle, updateBottle, deleteBottle } = useBottles();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newBottle, setNewBottle] = useState({
    name: '',
    hsnSac: '',
    defaultRate: '',
    gstRate: ''
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    hsnSac: '',
    defaultRate: '',
    gstRate: ''
  });

  const generateBottleName = () => {
    const nextNumber = bottles.length + 1;
    return `Bottle ${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleAddBottle = () => {
    if (!newBottle.name.trim()) {
      toast({
        title: 'Error',
        description: 'Bottle name is required',
        variant: 'destructive',
      });
      return;
    }

    const bottle = {
      name: newBottle.name,
      hsnSac: newBottle.hsnSac,
      defaultRate: Number(newBottle.defaultRate || 0),
      gstRate: Number(newBottle.gstRate || 0)
    };

    addBottle(bottle);
    setNewBottle({
      name: '',
      hsnSac: '',
      defaultRate: '',
      gstRate: ''
    });
    setIsAdding(false);
  };

  const handleEditBottle = (bottle: any) => {
    const updatedBottle = {
      id: bottle.id,
      name: editForm.name,
      hsnSac: editForm.hsnSac,
      defaultRate: Number(editForm.defaultRate || 0),
      gstRate: Number(editForm.gstRate || 0)
    };

    if (editingId && bottle.id === editingId) {
      updateBottle(updatedBottle);
    }
    
    setEditingId(null);
  };

  const startEditing = (bottle: any) => {
    setEditingId(bottle.id);
    setEditForm({
      name: bottle.name,
      hsnSac: bottle.hsnSac,
      defaultRate: bottle.defaultRate.toString(),
      gstRate: bottle.gstRate.toString()
    });
  };

  const handleDelete = (id: string) => {
    deleteBottle(id);
  };

  const startAdding = () => {
    const autoName = generateBottleName();
    setNewBottle({
      name: autoName,
      hsnSac: '22011000',
      defaultRate: '',
      gstRate: '12'
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bottle Management</h1>
        <Button onClick={startAdding} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" /> Add Bottle
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Bottle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="newName">Name</Label>
                <Input
                  id="newName"
                  value={newBottle.name}
                  onChange={(e) => setNewBottle({...newBottle, name: e.target.value})}
                  placeholder="Bottle name"
                />
              </div>
              
              <div>
                <Label htmlFor="newHsn">HSN/SAC</Label>
                <Input
                  id="newHsn"
                  value={newBottle.hsnSac}
                  onChange={(e) => setNewBottle({...newBottle, hsnSac: e.target.value})}
                  placeholder="HSN/SAC"
                />
              </div>
              
              <div>
                <Label htmlFor="newRate">Default Rate</Label>
                <Input
                  id="newRate"
                  type="number"
                  value={newBottle.defaultRate}
                  onChange={(e) => setNewBottle({...newBottle, defaultRate: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="newGst">GST Rate (%)</Label>
                <Input
                  id="newGst"
                  type="number"
                  value={newBottle.gstRate}
                  onChange={(e) => setNewBottle({...newBottle, gstRate: e.target.value})}
                  placeholder="12"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleAddBottle}>
                <Save className="mr-2 h-4 w-4" /> Save Bottle
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {bottles.map((bottle) => (
          <Card key={bottle.id}>
            <CardContent className="pt-6">
              {editingId === bottle.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`editName-${bottle.id}`}>Name</Label>
                      <Input
                        id={`editName-${bottle.id}`}
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editHsn-${bottle.id}`}>HSN/SAC</Label>
                      <Input
                        id={`editHsn-${bottle.id}`}
                        value={editForm.hsnSac}
                        onChange={(e) => setEditForm({...editForm, hsnSac: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editRate-${bottle.id}`}>Default Rate</Label>
                      <Input
                        id={`editRate-${bottle.id}`}
                        type="number"
                        value={editForm.defaultRate}
                        onChange={(e) => setEditForm({...editForm, defaultRate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`editGst-${bottle.id}`}>GST Rate (%)</Label>
                      <Input
                        id={`editGst-${bottle.id}`}
                        type="number"
                        value={editForm.gstRate}
                        onChange={(e) => setEditForm({...editForm, gstRate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEditBottle(bottle)}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="font-medium">{bottle.name}</p>
                      <p className="text-sm text-gray-500">Name</p>
                    </div>
                    <div>
                      <p className="font-medium">{bottle.hsnSac}</p>
                      <p className="text-sm text-gray-500">HSN/SAC</p>
                    </div>
                    <div>
                      <p className="font-medium">₹{bottle.defaultRate}</p>
                      <p className="text-sm text-gray-500">Default Rate</p>
                    </div>
                    <div>
                      <p className="font-medium">{bottle.gstRate}%</p>
                      <p className="text-sm text-gray-500">GST Rate</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(bottle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(bottle.id)}
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

      {bottles.length === 0 && !isAdding && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No bottles found. Add your first bottle to get started.</p>
              <Button onClick={startAdding}>
                <Plus className="mr-2 h-4 w-4" /> Add First Bottle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BottleManagement;
