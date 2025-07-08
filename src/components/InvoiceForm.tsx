import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Printer } from 'lucide-react';
import { useInvoice, Invoice, initialInvoiceState } from '@/context/InvoiceContext';
import { useBuyers } from '@/context/BuyerContext';
import { useCylinderBuyers } from '@/context/CylinderBuyerContext';
import { useCylinders } from '@/context/CylinderContext';
import { useBottles } from '@/context/BottleContext';
import { useSellerDetails } from '@/context/SellerDetailsContext';
import { useBankDetails } from '@/context/BankDetailsContext';
import { useAppMode } from '@/context/AppModeContext';
import { toast } from '@/components/ui/use-toast';
import AddressRoleSelector from './AddressRoleSelector';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  numberToWords,
  calculateTaxes,
  generateInvoiceNumber
} from '@/utils/helpers';

// AGNEE GAS DISTRIBUTER default details
const AGNEE_DETAILS = {
  company_name: 'AGNEE GAS DISTRIBUTER',
  address: '3/168B IRRUKUR\nPARAMATHI VELUR\nNAMAKKAL\nTamil Nadu - 637204, India',
  gstin: '33HVVPS5257L1ZH',
  contact: '',
  email: '',
  state: 'Tamil Nadu',
  state_code: '33'
};

const InvoiceForm: React.FC<{ onPrintClick: () => void }> = ({ onPrintClick }) => {
  const { currentInvoice, setCurrentInvoice, addInvoice, updateInvoice, invoices } = useInvoice();
  const { buyers: bottleBuyers } = useBuyers();
  const { buyers: cylinderBuyers } = useCylinderBuyers();
  const { cylinders } = useCylinders();
  const { bottles } = useBottles();
  const { activeSellerDetails } = useSellerDetails();
  const { activeBankDetails } = useBankDetails();
  const { mode } = useAppMode();
  const [isNewInvoice, setIsNewInvoice] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [agneeRole, setAgneeRole] = useState<'seller' | 'buyer'>('seller');
  
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

  // Set AGNEE details based on role selection
  useEffect(() => {
    if (agneeRole === 'seller') {
      // Set AGNEE as seller
      setValue('sellerName', AGNEE_DETAILS.company_name);
      setValue('sellerAddress', AGNEE_DETAILS.address);
      setValue('sellerGstin', AGNEE_DETAILS.gstin);
      setValue('sellerContact', AGNEE_DETAILS.contact);
      setValue('sellerEmail', AGNEE_DETAILS.email);
      setValue('sellerState', AGNEE_DETAILS.state);
      setValue('sellerStateCode', AGNEE_DETAILS.state_code);
      
      // Set active seller details as buyer if available
      if (activeSellerDetails) {
        setValue('buyerName', activeSellerDetails.company_name);
        setValue('buyerAddress', activeSellerDetails.address);
        setValue('buyerGstin', activeSellerDetails.gstin);
        setValue('buyerState', activeSellerDetails.state);
        setValue('buyerStateCode', activeSellerDetails.state_code);
      }
    } else {
      // Set AGNEE as buyer
      setValue('buyerName', AGNEE_DETAILS.company_name);
      setValue('buyerAddress', AGNEE_DETAILS.address);
      setValue('buyerGstin', AGNEE_DETAILS.gstin);
      setValue('buyerState', AGNEE_DETAILS.state);
      setValue('buyerStateCode', AGNEE_DETAILS.state_code);
      
      // Set active seller details as seller if available
      if (activeSellerDetails) {
        setValue('sellerName', activeSellerDetails.company_name);
        setValue('sellerAddress', activeSellerDetails.address);
        setValue('sellerGstin', activeSellerDetails.gstin);
        setValue('sellerContact', activeSellerDetails.contact || '');
        setValue('sellerEmail', activeSellerDetails.email || '');
        setValue('sellerState', activeSellerDetails.state);
        setValue('sellerStateCode', activeSellerDetails.state_code);
      }
    }
  }, [agneeRole, activeSellerDetails, setValue]);

  // Auto-populate bank details when they become available
  useEffect(() => {
    if (activeBankDetails) {
      setValue('bankName', activeBankDetails.bank_name);
      setValue('accountNo', activeBankDetails.account_no);
      setValue('ifscCode', activeBankDetails.ifsc_code);
      setValue('branchName', activeBankDetails.branch_name);
    }
  }, [activeBankDetails, setValue]);

  useEffect(() => {
    if (currentInvoice?.id) {
      setIsNewInvoice(false);
    } else {
      setIsNewInvoice(true);
    }
  }, [currentInvoice]);

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
  }, [watchItems]);
  
  const recalculateAmounts = () => {
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
  };
  
  const handleBuyerSelect = (buyerId: string) => {
    const selectedBuyer = buyers.find(buyer => buyer.gstin === buyerId);
    if (selectedBuyer && agneeRole === 'seller') {
      setValue('buyerName', selectedBuyer.name);
      setValue('buyerAddress', selectedBuyer.address);
      setValue('buyerGstin', selectedBuyer.gstin);
      setValue('buyerState', selectedBuyer.state);
      setValue('buyerStateCode', selectedBuyer.stateCode);
    }
  };
  
  const addItem = () => {
    const newItemIndex = fields.length + 1;
    append({
      id: uuidv4(),
      slNo: newItemIndex,
      description: '',
      hsnSac: '27111900',
      quantity: 0,
      rateIncTax: 0,
      ratePerItem: 0,
      amount: 0
    });
  };
  
  const calculateItemAmount = (index: number) => {
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
  };

  const handleItemSelect = (itemId: string, index: number) => {
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
  };
  
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
      <AddressRoleSelector 
        selectedRole={agneeRole}
        onRoleChange={setAgneeRole}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">
              {agneeRole === 'seller' ? 'Seller Information (AGNEE GAS DISTRIBUTER)' : 'Seller Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sellerName">Company Name</Label>
                <Input id="sellerName" {...register('sellerName')} readOnly={agneeRole === 'seller'} className={agneeRole === 'seller' ? 'bg-gray-50' : ''} />
              </div>
              
              <div>
                <Label htmlFor="sellerAddress">Address</Label>
                <Textarea id="sellerAddress" {...register('sellerAddress')} readOnly={agneeRole === 'seller'} className={agneeRole === 'seller' ? 'bg-gray-50' : ''} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerGstin">GSTIN/UIN</Label>
                  <Input id="sellerGstin" {...register('sellerGstin')} readOnly={agneeRole === 'seller'} className={agneeRole === 'seller' ? 'bg-gray-50' : ''} />
                </div>
                <div>
                  <Label htmlFor="sellerState">State</Label>
                  <Input id="sellerState" {...register('sellerState')} readOnly={agneeRole === 'seller'} className={agneeRole === 'seller' ? 'bg-gray-50' : ''} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerContact">Contact</Label>
                  <Input id="sellerContact" {...register('sellerContact')} readOnly={agneeRole === 'seller'} className={agneeRole === 'seller' ? 'bg-gray-50' : ''} />
                </div>
                <div>
                  <Label htmlFor="sellerEmail">Email</Label>
                  <Input id="sellerEmail" type="email" {...register('sellerEmail')} readOnly={agneeRole === 'seller'} className={agneeRole === 'seller' ? 'bg-gray-50' : ''} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">
              {agneeRole === 'buyer' ? 'Buyer Information (AGNEE GAS DISTRIBUTER)' : 'Buyer Information'}
            </h2>
            <div className="space-y-4">
              {agneeRole === 'seller' && (
                <div>
                  <Label>Select {mode === 'cylinder' ? 'Cylinder' : 'Bottle'} Customer</Label>
                  <Select onValueChange={handleBuyerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${mode} customer`} />
                    </SelectTrigger>
                    <SelectContent>
                      {buyers.map((buyer) => (
                        <SelectItem key={buyer.gstin} value={buyer.gstin}>
                          {buyer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="buyerName">Company Name</Label>
                <Input id="buyerName" {...register('buyerName')} readOnly={agneeRole === 'buyer'} className={agneeRole === 'buyer' ? 'bg-gray-50' : ''} />
              </div>
              
              <div>
                <Label htmlFor="buyerAddress">Address</Label>
                <Textarea id="buyerAddress" {...register('buyerAddress')} readOnly={agneeRole === 'buyer'} className={agneeRole === 'buyer' ? 'bg-gray-50' : ''} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyerGstin">GSTIN/UIN</Label>
                  <Input id="buyerGstin" {...register('buyerGstin')} readOnly={agneeRole === 'buyer'} className={agneeRole === 'buyer' ? 'bg-gray-50' : ''} />
                </div>
                <div>
                  <Label htmlFor="buyerState">State</Label>
                  <Input id="buyerState" {...register('buyerState')} readOnly={agneeRole === 'buyer'} className={agneeRole === 'buyer' ? 'bg-gray-50' : ''} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice No.</Label>
              <Input id="invoiceNo" {...register('invoiceNo')} required />
            </div>
            
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input id="invoiceDate" type="date" {...register('invoiceDate')} required />
            </div>
          </div>
        </CardContent>
      </Card>
      
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
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Tax & Total</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="gstInfo">GST Information</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  GST rates are applied automatically based on the selected {mode} type from settings.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cgstAmount">CGST Amount</Label>
                  <Input
                    id="cgstAmount"
                    {...register('cgstAmount')}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sgstAmount">SGST Amount</Label>
                  <Input
                    id="sgstAmount"
                    {...register('sgstAmount')}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="totalTaxableAmount">Total Taxable Amount</Label>
                <Input
                  id="totalTaxableAmount"
                  {...register('totalTaxableAmount')}
                  readOnly
                  className="bg-gray-50 font-semibold"
                />
              </div>
              
              <div>
                <Label htmlFor="roundedOff">Rounded Off</Label>
                <Input
                  id="roundedOff"
                  {...register('roundedOff')}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  {...register('totalAmount')}
                  readOnly
                  className="bg-gray-50 font-semibold text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="amountInWords">Amount In Words</Label>
                <Input
                  id="amountInWords"
                  {...register('amountInWords')}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" {...register('bankName')} readOnly className="bg-gray-50" />
            </div>
            
            <div>
              <Label htmlFor="accountNo">A/C No.</Label>
              <Input id="accountNo" {...register('accountNo')} readOnly className="bg-gray-50" />
            </div>
            
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input id="ifscCode" {...register('ifscCode')} readOnly className="bg-gray-50" />
            </div>
            
            <div>
              <Label htmlFor="branchName">Branch</Label>
              <Input id="branchName" {...register('branchName')} readOnly className="bg-gray-50" />
            </div>
          </div>
        </CardContent>
      </Card>
      
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
