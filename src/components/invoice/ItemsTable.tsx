
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import { Invoice } from '@/context/InvoiceContext';
import PresetItemSelector from '../PresetItemSelector';
import { PresetItem } from '@/constants/billing';

interface ItemsTableProps {
  form: UseFormReturn<Invoice>;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ form }) => {
  const { register, control, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const calculateItemAmount = (index: number) => {
    const item = getValues(`items.${index}`);
    if (item) {
      const quantity = parseFloat(item.quantity?.toString() || '0') || 0;
      const ratePerItem = parseFloat(item.ratePerItem?.toString() || '0') || 0;
      
      const amount = quantity * ratePerItem;
      form.setValue(`items.${index}.amount`, amount);
      
      const cgstRate = parseFloat(getValues('cgstRate')?.toString() || '0') || 0;
      const sgstRate = parseFloat(getValues('sgstRate')?.toString() || '0') || 0;
      const taxRate = 1 + ((cgstRate + sgstRate) / 100);
      form.setValue(`items.${index}.rateIncTax`, ratePerItem * taxRate);
    }
  };

  const addItem = () => {
    const newItemIndex = fields.length + 1;
    append({
      id: crypto.randomUUID(),
      slNo: newItemIndex,
      description: '',
      hsnSac: '',
      quantity: 0,
      rateIncTax: 0,
      ratePerItem: 0,
      amount: 0
    });
  };

  const addPresetItem = (preset: PresetItem) => {
    const newItemIndex = fields.length + 1;
    append({
      id: crypto.randomUUID(),
      slNo: newItemIndex,
      description: preset.description,
      hsnSac: preset.hsnSac,
      quantity: 1,
      ratePerItem: preset.defaultRate,
      rateIncTax: 0,
      amount: preset.defaultRate
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Items</h2>
          <PresetItemSelector onItemSelect={addPresetItem} />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium w-16">Sl. No.</th>
                <th className="text-left p-2 font-medium flex-1">Description</th>
                <th className="text-left p-2 font-medium w-24">HSN/SAC</th>
                <th className="text-left p-2 font-medium w-20">Qty</th>
                <th className="text-right p-2 font-medium w-32">Rate (Incl. Tax)</th>
                <th className="text-right p-2 font-medium w-32">Rate (Per Item)</th>
                <th className="text-right p-2 font-medium w-32">Amount</th>
                <th className="text-center p-2 font-medium w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No items added. Use the options above to add items.
                  </td>
                </tr>
              )}
              
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b">
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.slNo`)}
                      defaultValue={index + 1}
                      readOnly
                      className="w-12 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.description`)}
                      placeholder="Item description"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.hsnSac`)}
                      placeholder="HSN/SAC"
                      className="w-24"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.quantity`)}
                      type="number"
                      min="0"
                      className="w-20"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        form.setValue(`items.${index}.quantity`, value);
                        calculateItemAmount(index);
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.rateIncTax`)}
                      type="number"
                      step="0.01"
                      min="0"
                      readOnly
                      className="w-28 text-right"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.ratePerItem`)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-28 text-right"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        form.setValue(`items.${index}.ratePerItem`, value);
                        calculateItemAmount(index);
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.amount`)}
                      type="number"
                      step="0.01"
                      readOnly
                      className="w-28 text-right"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            type="button" 
            onClick={addItem} 
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Custom Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemsTable;
