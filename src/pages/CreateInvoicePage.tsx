
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Save, Search } from 'lucide-react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePrint from '@/components/InvoicePrint';
import { useInvoice } from '@/context/InvoiceContext';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from 'react';

const CreateInvoicePage: React.FC = () => {
  const { currentInvoice, addInvoice } = useInvoice();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

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

  // Setup keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/') {
        setShowSearchDialog(true);
        event.preventDefault();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            <Button 
              variant="outline" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => setShowSearchDialog(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Search</span>
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
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

      <CommandDialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <CommandInput placeholder="Search invoices, customers, products..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Invoices">
            <CommandItem>
              #INV001 - John Doe
              <CommandShortcut>₹5,000</CommandShortcut>
            </CommandItem>
            <CommandItem>
              #INV002 - Jane Smith
              <CommandShortcut>₹7,500</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Customers">
            <CommandItem>John Doe</CommandItem>
            <CommandItem>Jane Smith</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Products">
            <CommandItem>14.2KG Cylinder</CommandItem>
            <CommandItem>5KG Cylinder</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem>New Invoice</CommandItem>
            <CommandItem>New Customer</CommandItem>
            <CommandItem>Update Prices</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default CreateInvoicePage;
