import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Save, Printer, UserPlus, Edit } from 'lucide-react';
import { useInvoice, Invoice, initialInvoiceState } from '@/context/InvoiceContext';
import BuyerDialog from './BuyerDialog';
import SellerInfo from './invoice/SellerInfo';
import InvoiceDetails from './invoice/InvoiceDetails';
import ItemsTable from './invoice/ItemsTable';
import TaxCalculation from './invoice/TaxCalculation';
import BankDetails from './invoice/BankDetails';
import EWayBillDetails from './invoice/EWayBillDetails';
import { BUYERS, Buyer } from '@/constants/billing';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceFormProps {
  onPrintClick: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onPrintClick }) => {
  const { currentInvoice, setCurrentInvoice, addInvoice, updateInvoice } = useInvoice();
  const [showBuyerDialog, setShowBuyerDialog] = React.useState(false);
  const [editingBuyer, setEditingBuyer] = React.useState<Buyer | null>(null);
  const [isNewInvoice, setIsNewInvoice] = React.useState(true);
  const [buyers, setBuyers] = React.useState(BUYERS);
  
  const form = useForm<Invoice>({
    defaultValues: currentInvoice || initialInvoiceState,
  });
  
  // Setup initial values for new invoice
  useEffect(() => {
    if (isNewInvoice) {
      const currentDate = new Date();
      const dateStr = currentDate.toISOString().split('T')[0];
      
      form.setValue('irn', crypto.randomUUID());
      form.setValue('ackNo', crypto.randomUUID());
      form.setValue('ackDate', dateStr);
      form.setValue('invoiceNo', crypto.randomUUID());
      form.setValue('invoiceDate', dateStr);
      form.setValue('ewbGeneratedDate', `${dateStr} ${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`);
      
      const validUntil = new Date(currentDate);
      validUntil.setDate(validUntil.getDate() + 3);
      form.setValue('ewbValidUpto', `${validUntil.toISOString().split('T')[0]} ${validUntil.getHours()}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`);
    }
  }, [isNewInvoice, form.setValue]);
  
  // Watch items for tax calculations
  useEffect(() => {
    if (form.watch('items')) {
      const totalTaxableAmount = form.watch('items').reduce((sum, item) => {
        return sum + (parseFloat(item?.amount?.toString() || '0') || 0);
      }, 0);
      
      form.setValue('totalTaxableAmount', totalTaxableAmount);
      
      const cgstRate = parseFloat(form.getValues('cgstRate')?.toString() || '0') || 0;
      const sgstRate = parseFloat(form.getValues('sgstRate')?.toString() || '0') || 0;
      
      const cgstAmount = (totalTaxableAmount * cgstRate) / 100;
      const sgstAmount = (totalTaxableAmount * sgstRate) / 100;
      const totalAmount = totalTaxableAmount + cgstAmount + sgstAmount;
      const roundedOff = Math.round(totalAmount) - totalAmount;
      
      form.setValue('cgstAmount', cgstAmount);
      form.setValue('sgstAmount', sgstAmount);
      form.setValue('roundedOff', roundedOff);
      form.setValue('totalAmount', totalAmount);
      
      // numberToWords(totalAmount);
      form.setValue('amountInWords', 'in words');
    }
  }, [form.watch('items'), form.setValue, form.getValues]);
  
  const handleBuyerSelect = (buyerId: string) => {
    const selectedBuyer = BUYERS.find((buyer, index) => index.toString() === buyerId);
    if (selectedBuyer) {
      form.setValue('buyerName', selectedBuyer.name);
      form.setValue('buyerAddress', selectedBuyer.address);
      form.setValue('buyerGstin', selectedBuyer.gstin);
      form.setValue('buyerState', selectedBuyer.state);
      form.setValue('buyerStateCode', selectedBuyer.stateCode);
    }
  };

  const handleAddBuyer = (buyer: Buyer) => {
    setBuyers([...buyers, buyer]);
    form.setValue('buyerName', buyer.name);
    form.setValue('buyerAddress', buyer.address);
    form.setValue('buyerGstin', buyer.gstin);
    form.setValue('buyerState', buyer.state);
    form.setValue('buyerStateCode', buyer.stateCode);
  };

  const handleEditBuyer = (buyer: Buyer) => {
    setBuyers(buyers.map(b => b.name === editingBuyer?.name ? buyer : b));
    form.setValue('buyerName', buyer.name);
    form.setValue('buyerAddress', buyer.address);
    form.setValue('buyerGstin', buyer.gstin);
    form.setValue('buyerState', buyer.state);
    form.setValue('buyerStateCode', buyer.stateCode);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SellerInfo register={form.register} />
        <BuyerDialog 
          isOpen={showBuyerDialog} 
          onClose={() => {
            setShowBuyerDialog(false);
            setEditingBuyer(null);
          }}
          onSave={editingBuyer ? 
            handleEditBuyer
            : 
            handleAddBuyer
          }
          editingBuyer={editingBuyer}
        />
      </div>
      
      <InvoiceDetails register={form.register} />
      <ItemsTable form={form} />
      <TaxCalculation form={form} />
      <BankDetails register={form.register} />
      <EWayBillDetails register={form.register} />
      
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
    </form>
  );
};

export default InvoiceForm;
