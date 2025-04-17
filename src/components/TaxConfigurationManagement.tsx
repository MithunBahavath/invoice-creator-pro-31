
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
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface TaxConfig {
  id: string;
  productType: string;
  cgstRate: number;
  sgstRate: number;
}

const TaxConfigurationManagement = () => {
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([
    { id: '1', productType: '8kg Cylinder', cgstRate: 2.5, sgstRate: 2.5 },
    { id: '2', productType: '12kg', cgstRate: 2.5, sgstRate: 2.5 },
    { id: '3', productType: '17kg', cgstRate: 2.5, sgstRate: 2.5 },
    { id: '4', productType: '33kg', cgstRate: 2.5, sgstRate: 2.5 },
  ]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TaxConfig>>({});

  const handleEdit = (taxConfig: TaxConfig) => {
    setEditingId(taxConfig.id);
    setEditForm(taxConfig);
  };

  const handleSave = (taxConfig: TaxConfig) => {
    if (editForm.cgstRate === undefined || editForm.sgstRate === undefined) {
      toast.error('Tax rates are required');
      return;
    }
    
    setTaxConfigs(current =>
      current.map(c =>
        c.id === taxConfig.id
          ? { 
              ...c, 
              cgstRate: Number(editForm.cgstRate),
              sgstRate: Number(editForm.sgstRate)
            }
          : c
      )
    );
    setEditingId(null);
    setEditForm({});
    toast.success('Tax rates updated successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Tax Configuration</h2>
          <p className="text-muted-foreground">Set CGST and SGST rates for each product type</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Type</TableHead>
                <TableHead>CGST Rate (%)</TableHead>
                <TableHead>SGST Rate (%)</TableHead>
                <TableHead>Total GST (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxConfigs.map(taxConfig => (
                <TableRow key={taxConfig.id}>
                  {editingId === taxConfig.id ? (
                    <>
                      <TableCell>
                        {taxConfig.productType}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.cgstRate || 0}
                          onChange={e => setEditForm(current => ({ 
                            ...current, 
                            cgstRate: parseFloat(e.target.value) || 0 
                          }))}
                          placeholder="CGST Rate"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.sgstRate || 0}
                          onChange={e => setEditForm(current => ({ 
                            ...current, 
                            sgstRate: parseFloat(e.target.value) || 0 
                          }))}
                          placeholder="SGST Rate"
                        />
                      </TableCell>
                      <TableCell>
                        {((editForm.cgstRate || 0) + (editForm.sgstRate || 0)).toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(taxConfig)}>
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
                      <TableCell>{taxConfig.productType}</TableCell>
                      <TableCell>{taxConfig.cgstRate}%</TableCell>
                      <TableCell>{taxConfig.sgstRate}%</TableCell>
                      <TableCell>{(taxConfig.cgstRate + taxConfig.sgstRate).toFixed(2)}%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(taxConfig)}>
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

export default TaxConfigurationManagement;
