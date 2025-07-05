
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from 'lucide-react';
import { UseFormRegister, Control, Controller, UseFieldArrayReturn, UseFormGetValues } from 'react-hook-form';
import { Invoice } from '@/context/InvoiceContext';

interface InvoiceItemsSectionProps {
  register: UseFormRegister<Invoice>;
  control: Control<Invoice>;
  fields: UseFieldArrayReturn['fields'];
  append: UseFieldArrayReturn['append'];
  remove: UseFieldArrayReturn['remove'];
  getValues: UseFormGetValues<Invoice>;
  mode: string;
  availableItems: any[];
  handleItemSelect: (itemId: string, index: number) => void;
  calculateItemAmount: (index: number) => void;
  recalculateAmounts: () => void;
  handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({
  register,
  control,
  fields,
  append,
  remove,
  mode,
  availableItems,
  handleItemSelect,
  calculateItemAmount,
  recalculateAmounts,
  handleInputFocus
}) => {
  const addItem = () => {
    const newItemIndex = fields.length + 1;
    append({
      id: crypto.randomUUID(),
      slNo: newItemIndex,
      description: '',
      hsnSac: '27111900',
      quantity: 0,
      rateIncTax: 0,
      ratePerItem: 0,
      amount: 0
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Items ({mode === 'cylinder' ? 'Cylinders' : 'Bottles'})</h2>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
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
                    No items added. Click the "Add Item" button above to add items.
                  </td>
                </tr>
              )}
              
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b">
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.slNo` as const)}
                      defaultValue={index + 1}
                      readOnly
                      className="w-12 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <Select 
                      onValueChange={(value) => handleItemSelect(value, index)}
                      defaultValue={field.description}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${mode}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.hsnSac` as const)}
                      placeholder="HSN/SAC"
                      className="w-24"
                      readOnly
                    />
                  </td>
                  <td className="p-2">
                    <Controller
                      control={control}
                      name={`items.${index}.quantity` as const}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onFocus={handleInputFocus}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value) || 0);
                            calculateItemAmount(index);
                          }}
                          className="w-20"
                        />
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.rateIncTax` as const)}
                      type="number"
                      step="0.01"
                      min="0"
                      readOnly
                      className="w-28 text-right"
                    />
                  </td>
                  <td className="p-2">
                    <Controller
                      control={control}
                      name={`items.${index}.ratePerItem` as const}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          onFocus={handleInputFocus}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value) || 0);
                            calculateItemAmount(index);
                          }}
                          className="w-28 text-right"
                        />
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      {...register(`items.${index}.amount` as const)}
                      type="number"
                      step="0.01"
                      readOnly
                      className="w-28 text-right"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <Button
                      type="button"
                      onClick={() => {
                        remove(index);
                        setTimeout(() => recalculateAmounts(), 0);
                      }}
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
      </CardContent>
    </Card>
  );
};
