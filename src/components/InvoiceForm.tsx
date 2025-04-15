import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Printer, UserPlus, Edit } from 'lucide-react';
import BuyerDialog from './BuyerDialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceFormProps {
  onPrintClick: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onPrintClick }) => {
  const { currentInvoice, setCurrentInvoice, addInvoice, updateInvoice } = useInvoice();
  const [isNewInvoice, setIsNewInvoice] = useState(true);
  const [showBuyerDialog, setShowBuyerDialog] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [buyers, setBuyers] = useState(BUYERS);
  
  const { register, control, handleSubmit, watch, setValue, getValues } = useForm<Invoice>({
    defaultValues: currentInvoice || initialInvoiceState,
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  
  const watchItems = watch('items');
  
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
      const totalTaxableAmount = watchItems.reduce((sum, item) => {
        return sum + (parseFloat(item?.amount?.toString() || '0') || 0);
      }, 0);
      
      setValue('totalTaxableAmount', totalTaxableAmount);
      
      const cgstRate = parseFloat(getValues('cgstRate')?.toString() || '0') || 0;
      const sgstRate = parseFloat(getValues('sgstRate')?.toString() || '0') || 0;
      
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
    }
  }, [watchItems, setValue, getValues]);
  
  const addItem = () => {
    const newItemIndex = fields.length + 1;
    append({
      id: uuidv4(),
      slNo: newItemIndex,
      description: '',
      hsnSac: '',
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
      
      const cgstRate = parseFloat(getValues('cgstRate')?.toString() || '0') || 0;
      const sgstRate = parseFloat(getValues('sgstRate')?.toString() || '0') || 0;
      const taxRate = 1 + ((cgstRate + sgstRate) / 100);
      setValue(`items.${index}.rateIncTax`, ratePerItem * taxRate);
    }
  };
  
  const handleBuyerSelect = (buyerId: string) => {
    const selectedBuyer = BUYERS.find((buyer, index) => index.toString() === buyerId);
    if (selectedBuyer) {
      setValue('buyerName', selectedBuyer.name);
      setValue('buyerAddress', selectedBuyer.address);
      setValue('buyerGstin', selectedBuyer.gstin);
      setValue('buyerState', selectedBuyer.state);
      setValue('buyerStateCode', selectedBuyer.stateCode);
    }
  };
  
  const addPresetItem = (preset: typeof PRESET_ITEMS[0]) => {
    const newItemIndex = fields.length + 1;
    append({
      id: uuidv4(),
      slNo: newItemIndex,
      description: preset.description,
      hsnSac: preset.hsnSac,
      quantity: 1,
      ratePerItem: preset.defaultRate,
      rateIncTax: 0,
      amount: preset.defaultRate
    });
  };
  
  const handleAddBuyer = (buyer: Buyer) => {
    setBuyers([...buyers, buyer]);
    setValue('buyerName', buyer.name);
    setValue('buyerAddress', buyer.address);
    setValue('buyerGstin', buyer.gstin);
    setValue('buyerState', buyer.state);
    setValue('buyerStateCode', buyer.stateCode);
  };

  const handleEditBuyer = (buyer: Buyer) => {
    setBuyers(buyers.map(b => b.name === editingBuyer?.name ? buyer : b));
    setValue('buyerName', buyer.name);
    setValue('buyerAddress', buyer.address);
    setValue('buyerGstin', buyer.gstin);
    setValue('buyerState', buyer.state);
    setValue('buyerStateCode', buyer.stateCode);
    setEditingBuyer(null);
  };

  const onSubmit = (data: Invoice) => {
    if (isNewInvoice) {
      addInvoice(data);
    } else {
      updateInvoice(data);
    }
    
    setCurrentInvoice(data);
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Buyer Information</h2>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEditingBuyer(null);
                  setShowBuyerDialog(true);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Buyer
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Select Customer</Label>
                  <Select onValueChange={handleBuyerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyers.map((buyer, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {buyer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mb-[2px]"
                  onClick={() => {
                    const selectedBuyer = buyers.find((_, index) => 
                      index.toString() === getValues('buyerName')
                    );
                    if (selectedBuyer) {
                      setEditingBuyer(selectedBuyer);
                      setShowBuyerDialog(true);
                    }
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
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
            
            <div>
              <Label htmlFor="deliveryNote">Delivery Note</Label>
              <Input id="deliveryNote" {...register('deliveryNote')} />
            </div>
            
            <div>
              <Label htmlFor="reference">Reference No. & Date</Label>
              <Input id="reference" {...register('reference')} />
            </div>
            
            <div>
              <Label htmlFor="buyerOrderNo">Buyer's Order No.</Label>
              <Input id="buyerOrderNo" {...register('buyerOrderNo')} />
            </div>
            
            <div>
              <Label htmlFor="dispatchDocNo">Dispatch Doc No.</Label>
              <Input id="dispatchDocNo" {...register('dispatchDocNo')} />
            </div>
            
            <div>
              <Label htmlFor="dispatchedThrough">Dispatched Through</Label>
              <Input id="dispatchedThrough" {...register('dispatchedThrough')} />
            </div>
            
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...register('destination')} />
            </div>
            
            <div>
              <Label htmlFor="termsOfDelivery">Terms of Delivery</Label>
              <Input id="termsOfDelivery" {...register('termsOfDelivery')} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="flex gap-2">
              <Select onValueChange={(value) => {
                const preset = PRESET_ITEMS[parseInt(value)];
                if (preset) addPresetItem(preset);
              }}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add preset item" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_ITEMS.map((item, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Custom Item
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Sl. No.</th>
                  <th className="text-left p-2 font-medium">Description</th>
                  <th className="text-left p-2 font-medium">HSN/SAC</th>
                  <th className="text-left p-2 font-medium">Qty</th>
                  <th className="text-left p-2 font-medium">Rate (Incl. Tax)</th>
                  <th className="text-left p-2 font-medium">Rate (Per Item)</th>
                  <th className="text-left p-2 font-medium">Amount</th>
                  <th className="text-left p-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-500">
                      No items added. Click "Add Item" to add your first item.
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
                      <Input
                        {...register(`items.${index}.description` as const, { required: true })}
                        placeholder="Item description"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        {...register(`items.${index}.hsnSac` as const)}
                        placeholder="HSN/SAC"
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
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
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
                        className="w-24"
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
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                              calculateItemAmount(index);
                            }}
                            className="w-24"
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
                        className="w-24"
                      />
                    </td>
                    <td className="p-2">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Tax & Total</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cgstRate">CGST Rate (%)</Label>
                  <Controller
                    control={control}
                    name="cgstRate"
                    render={({ field }) => (
                      <Input
                        id="cgstRate"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                          watchItems?.forEach((_, index) => {
                            calculateItemAmount(index);
                          });
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="cgstAmount">CGST Amount</Label>
                  <Input
                    id="cgstAmount"
                    {...register('cgstAmount')}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sgstRate">SGST Rate (%)</Label>
                  <Controller
                    control={control}
                    name="sgstRate"
                    render={({ field }) => (
                      <Input
                        id="sgstRate"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                          watchItems?.forEach((_, index) => {
                            calculateItemAmount(index);
                          });
                        }}
                      />
                    )}
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
          onClick={onPrintClick}
          className="min-w-[150px]"
        >
          <Printer className="mr-2 h-4 w-4" /> Print/Download
        </Button>
      </div>
      
      <BuyerDialog
        isOpen={showBuyerDialog}
        onClose={() => {
          setShowBuyerDialog(false);
          setEditingBuyer(null);
        }}
        onSave={editingBuyer ? handleEditBuyer : handleAddBuyer}
        editingBuyer={editingBuyer}
      />
    </form>
  );
};

export default InvoiceForm;
