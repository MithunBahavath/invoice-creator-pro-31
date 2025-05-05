
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Save } from 'lucide-react';
import InvoiceForm from '@/components/InvoiceForm';
import { useInvoice } from '@/context/InvoiceContext';
import InvoicePrint from '@/components/InvoicePrint';

const CreateInvoicePage: React.FC = () => {
  const { currentInvoice, addInvoice } = useInvoice();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Handle print/PDF generation
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${currentInvoice.invoiceNo || 'New'}`,
    onBeforeGetContent: () => {
      if (!currentInvoice.invoiceNo || !currentInvoice.buyerName) {
        toast({
          title: 'Incomplete Invoice',
          description: 'Please fill out invoice details before printing.',
          variant: 'destructive',
        });
        return Promise.reject('Incomplete invoice');
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      // Auto-save the invoice after printing if there are changes
      if (currentInvoice.id) {
        addInvoice({...currentInvoice}); // Create a new copy to ensure it's saved
        toast({
          title: 'Invoice Saved',
          description: 'The invoice has been saved to history.',
        });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="p-2">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create Invoice</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/invoice-history">
              <Button variant="secondary">
                <Save className="h-4 w-4 mr-2" />
                View Saved Invoices
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <InvoiceForm onPrintClick={handlePrint} />
          
          {/* Hidden invoice for printing */}
          <div className="hidden">
            <InvoicePrint forwardRef={invoiceRef} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t p-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} Billing Software. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreateInvoicePage;
