
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
import { useCylinders } from '@/context/CylinderContext';
import { toast } from '@/components/ui/use-toast';
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
  generateIRN,
  generateAckNo,
  generateInvoiceNumber
} from '@/utils/helpers';

const InvoiceForm: React.FC<{ onPrintClick: () => void }> = ({ onPrintClick }) => {
  const { currentInvoice, setCurrentInvoice, addInvoice, updateInvoice } = useInvoice();
  const { buyers } = useBuyers();
  const { cylinders } = useCylinders();
  const [isNewInvoice, setIsNewInvoice] = useState(true);
  const [selectedCylinderId, setSelectedCylinderId] = useState<string | null>(null);
  
  const { register, control, handleSubmit, watch, setValue, getValues } = useForm<Invoice>({
    defaultValues: currentInvoice || initialInvoiceState,
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  
  const watchItems = watch('items');
  
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
      
      setValue('irn', generateIRN());
      setValue('ackNo', generateAckNo());
      setValue('ackDate', dateStr);
      setValue('invoiceNo', generateInvoiceNumber());
      setValue('invoiceDate', dateStr);
      setValue('ewbGeneratedDate', `${dateStr} ${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`);
      
      const validUntil = new Date(currentDate);
      validUntil.setDate(validUntil.getDate() + 3);
      setValue('ewbValidUpto', `${validUntil.toISOString().split('T')[0]} ${validUntil.getHours()}:${validUntil.getMinutes()} ${validUntil.getHours() >= 12 ? 'PM' : 'AM'}`);
    }
  }, [isNewInvoice, setValue]);
  
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
    
    // Calculate tax based on the selected cylinder's GST rate
    let gstRate = 5; // Default GST rate
    
    // Get the GST rate from the selected cylinder
    if (selectedCylinderId) {
      const selectedCylinder = cylinders.find(cyl => cyl.id === selectedCylinderId);
      if (selectedCylinder) {
        gstRate = selectedCylinder.gstRate;
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
    if (selectedBuyer) {
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
      
      // Get GST rate for this item based on the cylinder selected
      let gstRate = 5; // Default
      const selectedCylinderId = getValues(`items.${index}.cylinderId`);
      if (selectedCylinderId) {
        const selectedCylinder = cylinders.find(cyl => cyl.id === selectedCylinderId);
        if (selectedCylinder) {
          gstRate = selectedCylinder.gstRate;
        }
      }
      
      const taxRate = 1 + (gstRate / 100);
      setValue(`items.${index}.rateIncTax`, ratePerItem * taxRate);
      
      recalculateAmounts();
    }
  };

  const handleItemSelect = (itemId: string, index: number) => {
    const selectedCylinder = cylinders.find(cyl => cyl.id === itemId);
    if (selectedCylinder) {
      setSelectedCylinderId(itemId);
      setValue(`items.${index}.description`, selectedCylinder.name);
      setValue(`items.${index}.hsnSac`, selectedCylinder.hsnSac);
      setValue(`items.${index}.ratePerItem`, selectedCylinder.defaultRate);
      setValue(`items.${index}.cylinderId`, selectedCylinder.id);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sellerName">Company Name</Label>
                <Input id="sellerName" {...register('sellerName')} />
              </div>
              
              <div>
                <Label htmlFor="sellerAddress">Address</Label>
                <Textarea id="sellerAddress" {...register('sellerAddress')} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerGstin">GSTIN/UIN</Label>
                  <Input id="sellerGstin" {...register('sellerGstin')} />
                </div>
                <div>
                  <Label htmlFor="sellerState">State</Label>
                  <Input id="sellerState" {...register('sellerState')} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerContact">Contact</Label>
                  <Input id="sellerContact" {...register('sellerContact')} />
                </div>
                <div>
                  <Label htmlFor="sellerEmail">Email</Label>
                  <Input id="sellerEmail" type="email" {...register('sellerEmail')} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Select Customer</Label>
                <Select onValueChange={handleBuyerSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
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
              
              <div>
                <Label htmlFor="buyerName">Company Name</Label>
                <Input id="buyerName" {...register('buyerName')} readOnly />
              </div>
              
              <div>
                <Label htmlFor="buyerAddress">Address</Label>
                <Textarea id="buyerAddress" {...register('buyerAddress')} readOnly />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyerGstin">GSTIN/UIN</Label>
                  <Input id="buyerGstin" {...register('buyerGstin')} readOnly />
                </div>
                <div>
                  <Label htmlFor="buyerState">State</Label>
                  <Input id="buyerState" {...register('buyerState')} readOnly />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice No.</Label>
              <Input id="invoiceNo" {...register('invoiceNo')} required />
            </div>
            
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input id="invoiceDate" type="date" {...register('invoiceDate')} required />
            </div>
            
            <div>
              <Label htmlFor="eWayBillNo">e-Way Bill No.</Label>
              <Input id="eWayBillNo" {...register('eWayBillNo')} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Items</h2>
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
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {cylinders.map((cylinder) => (
                            <SelectItem key={cylinder.id} value={cylinder.id}>
                              {cylinder.name}
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
                  GST rates are applied automatically based on the selected cylinder type from settings.
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
              <Input id="bankName" {...register('bankName')} />
            </div>
            
            <div>
              <Label htmlFor="accountNo">A/C No.</Label>
              <Input id="accountNo" {...register('accountNo')} />
            </div>
            
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input id="ifscCode" {...register('ifscCode')} />
            </div>
            
            <div>
              <Label htmlFor="branchName">Branch</Label>
              <Input id="branchName" {...register('branchName')} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">e-Way Bill Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ewbMode">Mode</Label>
              <Input id="ewbMode" {...register('ewbMode')} />
            </div>
            
            <div>
              <Label htmlFor="ewbDistance">Approx Distance (KM)</Label>
              <Input id="ewbDistance" {...register('ewbDistance')} />
            </div>
            
            <div>
              <Label htmlFor="ewbTransactionType">Transaction Type</Label>
              <Input id="ewbTransactionType" {...register('ewbTransactionType')} />
            </div>
            
            <div>
              <Label htmlFor="vehicleNo">Vehicle No.</Label>
              <Input id="vehicleNo" {...register('vehicleNo')} />
            </div>
            
            <div>
              <Label htmlFor="transporterId">Transporter ID</Label>
              <Input id="transporterId" {...register('transporterId')} />
            </div>
            
            <div>
              <Label htmlFor="transporterName">Transporter Name</Label>
              <Input id="transporterName" {...register('transporterName')} />
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
