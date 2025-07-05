
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Save, Printer } from 'lucide-react';
import { useInvoice, Invoice, initialInvoiceState } from '@/context/InvoiceContext';
import { useBuyers } from '@/context/BuyerContext';
import { useCylinderBuyers } from '@/context/CylinderBuyerContext';
import { useCylinders } from '@/context/CylinderContext';
import { useBottles } from '@/context/BottleContext';
import { useAppMode } from '@/context/AppModeContext';
import { useCompanyDetails } from '@/context/CompanyDetailsContext';
import { toast } from '@/components/ui/use-toast';
import { generateInvoiceNumber } from '@/utils/helpers';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations';
import { InvoiceSellerSection } from './InvoiceSellerSection';
import { InvoiceBuyerSection } from './InvoiceBuyerSection';
import { InvoiceDetailsSection } from './InvoiceDetailsSection';
import { InvoiceItemsSection } from './InvoiceItemsSection';
import { InvoiceTaxSection } from './InvoiceTaxSection';
import { InvoiceBankSection } from './InvoiceBankSection';

const InvoiceForm: React.FC<{ onPrintClick: () => void }> = ({ onPrintClick }) => {
  const { currentInvoice, setCurrentInvoice, addInvoice, updateInvoice, invoices } = useInvoice();
  const { buyers: bottleBuyers } = useBuyers();
  const { buyers: cylinderBuyers } = useCylinderBuyers();
  const { cylinders } = useCylinders();
  const { bottles } = useBottles();
  const { mode } = useAppMode();
  const { activeSellerDetails, activeBankDetails } = useCompanyDetails();
  const [isNewInvoice, setIsNewInvoice] = useState(true);
  
  const { register, control, handleSubmit, watch, setValue, getValues } = useForm<Invoice>({
    defaultValues: currentInvoice || initialInvoiceState,
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  
  const watchItems = watch('items');
  
  // Get buyers based on current mode
  const buyers = mode === 'cylinder' ? cylinderBuyers : bottleBuyers;

  // Use the custom hook for calculations
  const { recalculateAmounts, calculateItemAmount, handleItemSelect } = useInvoiceCalculations({
    setValue,
    getValues,
    cylinders,
    bottles,
    mode
  });

  useEffect(() => {
    if (currentInvoice?.id) {
      setIsNewInvoice(false);
    } else {
      setIsNewInvoice(true);
    }
  }, [currentInvoice]);

  // Auto-populate seller and bank details when they change
  useEffect(() => {
    if (activeSellerDetails) {
      setValue('sellerName', activeSellerDetails.company_name);
      setValue('sellerAddress', activeSellerDetails.address);
      setValue('sellerGstin', activeSellerDetails.gstin);
      setValue('sellerContact', activeSellerDetails.contact || '');
      setValue('sellerEmail', activeSellerDetails.email || '');
      setValue('sellerState', activeSellerDetails.state);
      setValue('sellerStateCode', activeSellerDetails.state_code);
    }
  }, [activeSellerDetails, setValue]);

  useEffect(() => {
    if (activeBankDetails) {
      setValue('bankName', activeBankDetails.bank_name);
      setValue('accountNo', activeBankDetails.account_no);
      setValue('ifscCode', activeBankDetails.ifsc_code);
      setValue('branchName', activeBankDetails.branch_name);
    }
  }, [activeBankDetails, setValue]);

  useEffect(() => {
    if (isNewInvoice) {
      const currentDate = new Date();
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Generate invoice number using the new algorithm with existing invoices
      setValue('invoiceNo', generateInvoiceNumber(invoices));
      setValue('invoiceDate', dateStr);
    }
  }, [isNewInvoice, setValue, invoices]);
  
  useEffect(() => {
    if (watchItems) {
      recalculateAmounts();
    }
  }, [watchItems, recalculateAmounts]);
  
  const onSubmit = (data: Invoice) => {
    try {
      if (data.id) {
        updateInvoice(data);
        setCurrentInvoice(data);
        toast({
          title: 'Invoice Updated',
          description: 'The invoice has been successfully updated.',
        });
      } else {
        const newInvoice = {
          ...data,
          id: uuidv4(),
        };
        addInvoice(newInvoice);
        setCurrentInvoice(newInvoice);
        toast({
          title: 'Invoice Saved',
          description: 'The invoice has been successfully saved.',
        });
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the invoice. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePrintClick = () => {
    const formData = getValues();
    
    if (!formData.buyerName || !formData.invoiceNo) {
      toast({
        title: 'Incomplete Invoice',
        description: 'Please fill out invoice details before printing.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.id) {
      formData.id = uuidv4();
    }
    
    if (isNewInvoice) {
      addInvoice(formData);
    } else {
      updateInvoice(formData);
    }
    
    setCurrentInvoice(formData);
    
    onPrintClick();
  };

  // Helper function to handle input focus and selection
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const availableItems = mode === 'cylinder' ? cylinders : bottles;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvoiceSellerSection register={register} />
        <InvoiceBuyerSection 
          register={register} 
          setValue={setValue} 
          buyers={buyers} 
          mode={mode} 
        />
      </div>
      
      <InvoiceDetailsSection register={register} />
      
      <InvoiceItemsSection
        register={register}
        control={control}
        fields={fields}
        append={append}
        remove={remove}
        getValues={getValues}
        mode={mode}
        availableItems={availableItems}
        handleItemSelect={handleItemSelect}
        calculateItemAmount={calculateItemAmount}
        recalculateAmounts={recalculateAmounts}
        handleInputFocus={handleInputFocus}
      />
      
      <InvoiceTaxSection register={register} mode={mode} />
      
      <InvoiceBankSection register={register} />
      
      <div className="flex justify-between">
        <Button type="submit" className="min-w-[150px]">
          <Save className="mr-2 h-4 w-4" /> Save Invoice
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handlePrintClick}
          className="min-w-[150px]"
        >
          <Printer className="mr-2 h-4 w-4" /> Print/Download
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
