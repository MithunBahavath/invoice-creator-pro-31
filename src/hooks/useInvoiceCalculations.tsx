
import { useState, useCallback } from 'react';
import { Invoice, InvoiceItem } from '@/context/InvoiceContext';
import { UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { numberToWords, calculateTaxes } from '@/utils/helpers';

interface UseInvoiceCalculationsProps {
  setValue: UseFormSetValue<Invoice>;
  getValues: UseFormGetValues<Invoice>;
  cylinders: any[];
  bottles: any[];
  mode: string;
}

export const useInvoiceCalculations = ({ 
  setValue, 
  getValues, 
  cylinders, 
  bottles, 
  mode 
}: UseInvoiceCalculationsProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const recalculateAmounts = useCallback(() => {
    const watchItems = getValues('items');
    
    const totalTaxableAmount = watchItems?.reduce((sum, item) => {
      return sum + (parseFloat(item?.amount?.toString() || '0') || 0);
    }, 0) || 0;
    
    setValue('totalTaxableAmount', totalTaxableAmount);
    
    // Calculate tax based on the selected item's GST rate
    let gstRate = 5; // Default GST rate
    
    // Get the GST rate from the selected item
    if (selectedItemId) {
      const items = mode === 'cylinder' ? cylinders : bottles;
      const selectedItem = items.find(item => item.id === selectedItemId);
      if (selectedItem) {
        gstRate = selectedItem.gstRate;
      }
    }
    
    // Split the GST rate equally between CGST and SGST
    const cgstRate = gstRate / 2;
    const sgstRate = gstRate / 2;
    
    setValue('cgstRate', cgstRate);
    setValue('sgstRate', sgstRate);
    
    const { cgstAmount, sgstAmount, totalAmount, roundedOff } = calculateTaxes(
      totalTaxableAmount, 
      cgstRate, 
      sgstRate
    );
    
    setValue('cgstAmount', cgstAmount);
    setValue('sgstAmount', sgstAmount);
    setValue('roundedOff', roundedOff);
    setValue('totalAmount', totalAmount);
    
    setValue('amountInWords', numberToWords(totalAmount));
  }, [setValue, getValues, selectedItemId, mode, cylinders, bottles]);

  const calculateItemAmount = useCallback((index: number) => {
    const item = getValues(`items.${index}`);
    if (item) {
      const quantity = parseFloat(item.quantity?.toString() || '0') || 0;
      const ratePerItem = parseFloat(item.ratePerItem?.toString() || '0') || 0;
      
      const amount = quantity * ratePerItem;
      setValue(`items.${index}.amount`, amount);
      
      // Get GST rate for this item based on the selected item
      let gstRate = 5; // Default
      const selectedItemId = getValues(`items.${index}.cylinderId`);
      if (selectedItemId) {
        const items = mode === 'cylinder' ? cylinders : bottles;
        const selectedItem = items.find(item => item.id === selectedItemId);
        if (selectedItem) {
          gstRate = selectedItem.gstRate;
        }
      }
      
      const taxRate = 1 + (gstRate / 100);
      setValue(`items.${index}.rateIncTax`, ratePerItem * taxRate);
      
      recalculateAmounts();
    }
  }, [getValues, setValue, mode, cylinders, bottles, recalculateAmounts]);

  const handleItemSelect = useCallback((itemId: string, index: number) => {
    const items = mode === 'cylinder' ? cylinders : bottles;
    const selectedItem = items.find(item => item.id === itemId);
    if (selectedItem) {
      setSelectedItemId(itemId);
      setValue(`items.${index}.description`, selectedItem.name);
      setValue(`items.${index}.hsnSac`, selectedItem.hsnSac);
      setValue(`items.${index}.ratePerItem`, selectedItem.defaultRate);
      setValue(`items.${index}.cylinderId`, selectedItem.id);
      calculateItemAmount(index);
    }
  }, [mode, cylinders, bottles, setValue, calculateItemAmount]);

  return {
    selectedItemId,
    setSelectedItemId,
    recalculateAmounts,
    calculateItemAmount,
    handleItemSelect
  };
};
