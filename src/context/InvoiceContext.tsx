import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

// Define the structure of an invoice item
export interface InvoiceItem {
  id: string;
  slNo: number;
  description: string;
  hsnSac: string;
  quantity: number;
  rateIncTax: number;
  ratePerItem: number;
  amount: number;
  cylinderId?: string; // Added to track which cylinder this item refers to
}

// Define the structure of an invoice
export interface Invoice {
  id: string;
  // Header information
  irn: string;
  ackNo: string;
  ackDate: string;
  
  // Seller information
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerContact: string;
  sellerEmail: string;
  sellerState: string;
  sellerStateCode: string;
  
  // Buyer information
  buyerName: string;
  buyerAddress: string;
  buyerGstin: string;
  buyerState: string;
  buyerStateCode: string;
  
  // Invoice details
  invoiceNo: string;
  invoiceDate: string;
  
  // Items and calculations
  items: InvoiceItem[];
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  totalTaxableAmount: number;
  roundedOff: number;
  totalAmount: number;
  amountInWords: string;
  
  // Bank details
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branchName: string;
}

// Define the initial state of a new invoice
export const initialInvoiceState: Invoice = {
  id: uuidv4(),
  irn: '',
  ackNo: '',
  ackDate: '',
  sellerName: 'AGNEE GAS DISTRIBUTER',
  sellerAddress: '3/168B IRRUKUR, PARAMATHI VELUR, NAMAKKAL, Tamil Nadu - 637204, India',
  sellerGstin: '33HVVPS5257L1ZH',
  sellerContact: '8072991484',
  sellerEmail: 'sathishp@gmail.com',
  sellerState: 'Tamil Nadu',
  sellerStateCode: '33',
  buyerName: '',
  buyerAddress: '',
  buyerGstin: '',
  buyerState: 'Tamil Nadu',
  buyerStateCode: '33',
  invoiceNo: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  items: [],
  cgstRate: 2.5,
  sgstRate: 2.5,
  cgstAmount: 0,
  sgstAmount: 0,
  totalTaxableAmount: 0,
  roundedOff: 0,
  totalAmount: 0,
  amountInWords: '',
  bankName: 'City Union Bank',
  accountNo: '510909010109147',
  ifscCode: 'CIUB0000003',
  branchName: 'Kumbakonam Town',
};

// Define the context type
interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  currentInvoice: Invoice;
  setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  resetCurrentInvoice: () => void;
  isLoading: boolean;
}

// Define API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

// Create the context
const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Create a provider component
export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({ ...initialInvoiceState });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const response = await fetch(`${API_URL}/invoices`);
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        } else {
          // Fall back to localStorage if API fails
          const savedInvoices = localStorage.getItem('invoices');
          if (savedInvoices) {
            setInvoices(JSON.parse(savedInvoices));
          }
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Fall back to localStorage if API fails
        const savedInvoices = localStorage.getItem('invoices');
        if (savedInvoices) {
          setInvoices(JSON.parse(savedInvoices));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);

  // Save to localStorage as backup whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Add a new invoice
  const addInvoice = async (invoice: Invoice) => {
    try {
      setIsLoading(true);
      
      // Try to save to API first
      const response = await fetch(`${API_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoice),
      });
      
      if (response.ok) {
        const savedInvoice = await response.json();
        setInvoices([...invoices, savedInvoice]);
        toast({
          title: 'Invoice Saved',
          description: 'Invoice has been saved successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setInvoices([...invoices, invoice]);
        toast({
          title: 'Warning',
          description: 'Could not save to server, saved locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      // Fall back to localStorage if API fails
      setInvoices([...invoices, invoice]);
      toast({
        title: 'Warning',
        description: 'Server connection failed, saved locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing invoice
  const updateInvoice = async (updatedInvoice: Invoice) => {
    try {
      setIsLoading(true);
      
      // Try to update via API first
      const response = await fetch(`${API_URL}/invoices/${updatedInvoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInvoice),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setInvoices(invoices.map(inv => (inv.id === updatedData.id ? updatedData : inv)));
        toast({
          title: 'Invoice Updated',
          description: 'Invoice has been updated successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setInvoices(invoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
        toast({
          title: 'Warning',
          description: 'Could not update on server, updated locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      // Fall back to localStorage if API fails
      setInvoices(invoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
      toast({
        title: 'Warning',
        description: 'Server connection failed, updated locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an invoice
  const deleteInvoice = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Try to delete via API first
      const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        toast({
          title: 'Invoice Deleted',
          description: 'Invoice has been deleted successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        toast({
          title: 'Warning',
          description: 'Could not delete from server, deleted locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      // Fall back to localStorage if API fails
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      toast({
        title: 'Warning',
        description: 'Server connection failed, deleted locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get a specific invoice by ID
  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  // Reset the current invoice to initial state
  const resetCurrentInvoice = () => {
    setCurrentInvoice({ ...initialInvoiceState, id: uuidv4() });
  };

  // Value object to be provided by the context
  const value = {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    currentInvoice,
    setCurrentInvoice,
    resetCurrentInvoice,
    isLoading,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Custom hook to use the invoice context
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
