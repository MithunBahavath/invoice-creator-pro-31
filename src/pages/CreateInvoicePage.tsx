
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Save, Share } from 'lucide-react';
import InvoiceForm from '@/components/InvoiceForm';
import ShareInvoice from '@/components/ShareInvoice';
import { useInvoice } from '@/context/InvoiceContext';
import InvoicePrint from '@/components/InvoicePrint';

const CreateInvoicePage: React.FC = () => {
  const { currentInvoice, addInvoice, isLoading } = useInvoice();
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
      <header className="bg-primary text-primary-foreground p-4 sm:p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Link to="/">
                <Button variant="ghost" className="p-2 shrink-0">
                  <ChevronLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
              <h1 className="text-lg sm:text-2xl font-bold truncate">Create Invoice</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {currentInvoice.invoiceNo && currentInvoice.buyerName && (
                <div className="flex gap-2">
                  <ShareInvoice 
                    invoice={currentInvoice} 
                    onDownloadPDF={handlePrint}
                  />
                </div>
              )}
              <Link to="/invoice-history" className="w-full sm:w-auto">
                <Button variant="secondary" disabled={isLoading} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Saved Invoices</span>
                  <span className="sm:hidden">Saved</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="bg-blue-50 p-4 mb-4 rounded-md text-center">
              <p className="text-blue-700 text-sm sm:text-base">Processing... Please wait</p>
            </div>
          )}
          <InvoiceForm onPrintClick={handlePrint} />
          
          {/* Hidden invoice for printing */}
          <div className="hidden">
            <InvoicePrint forwardRef={invoiceRef} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t p-4 sm:p-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p className="text-sm sm:text-base">© {new Date().getFullYear()} Billing Software. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreateInvoicePage;
