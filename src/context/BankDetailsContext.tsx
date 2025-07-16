
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface BankDetails {
  id: string;
  bank_name: string;
  account_no: string;
  ifsc_code: string;
  branch_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BankDetailsContextType {
  bankDetails: BankDetails[];
  activeBankDetails: BankDetails | null;
  addBankDetails: (details: Omit<BankDetails, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBankDetails: (id: string, details: Partial<BankDetails>) => Promise<void>;
  deleteBankDetails: (id: string) => Promise<void>;
  setActiveBankDetails: (id: string) => Promise<void>;
  fetchBankDetails: () => Promise<void>;
  isLoading: boolean;
}

const BankDetailsContext = createContext<BankDetailsContextType | undefined>(undefined);

export const BankDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [activeBankDetails, setActiveBankDetailsState] = useState<BankDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem('bankDetails');
      const data = stored ? JSON.parse(stored) : [];

      setBankDetails(data);
      
      // Set the active bank details (first active one or first one)
      const activeDetails = data.find((d: BankDetails) => d.is_active) || data[0];
      if (activeDetails) {
        setActiveBankDetailsState(activeDetails);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bank details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addBankDetails = async (details: Omit<BankDetails, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      const now = new Date().toISOString();
      const newDetails: BankDetails = {
        ...details,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
      };

      const updated = [newDetails, ...bankDetails];
      setBankDetails(updated);
      localStorage.setItem('bankDetails', JSON.stringify(updated));
      
      toast({
        title: 'Success',
        description: 'Bank details added successfully',
      });
    } catch (error) {
      console.error('Error adding bank details:', error);
      toast({
        title: 'Error',
        description: 'Failed to add bank details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBankDetails = async (id: string, details: Partial<BankDetails>) => {
    try {
      setIsLoading(true);
      const updatedDetails = { ...details, updated_at: new Date().toISOString() };
      
      const updated = bankDetails.map(item => 
        item.id === id ? { ...item, ...updatedDetails } : item
      );
      
      setBankDetails(updated);
      localStorage.setItem('bankDetails', JSON.stringify(updated));
      
      // Update active details if it's the one being updated
      if (activeBankDetails?.id === id) {
        const updatedItem = updated.find(item => item.id === id);
        if (updatedItem) {
          setActiveBankDetailsState(updatedItem);
        }
      }

      toast({
        title: 'Success',
        description: 'Bank details updated successfully',
      });
    } catch (error) {
      console.error('Error updating bank details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bank details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBankDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const updated = bankDetails.filter(item => item.id !== id);
      
      setBankDetails(updated);
      localStorage.setItem('bankDetails', JSON.stringify(updated));
      
      // If deleted item was active, set another one as active
      if (activeBankDetails?.id === id) {
        setActiveBankDetailsState(updated[0] || null);
      }

      toast({
        title: 'Success',
        description: 'Bank details deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting bank details:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete bank details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveBankDetails = async (id: string) => {
    try {
      const updated = bankDetails.map(item => ({
        ...item,
        is_active: item.id === id,
        updated_at: new Date().toISOString()
      }));

      setBankDetails(updated);
      localStorage.setItem('bankDetails', JSON.stringify(updated));
      
      const activeItem = updated.find(item => item.id === id);
      if (activeItem) {
        setActiveBankDetailsState(activeItem);
      }

      toast({
        title: 'Success',
        description: 'Active bank details updated',
      });
    } catch (error) {
      console.error('Error setting active bank details:', error);
      toast({
        title: 'Error',
        description: 'Failed to set active bank details',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const value = {
    bankDetails,
    activeBankDetails,
    addBankDetails,
    updateBankDetails,
    deleteBankDetails,
    setActiveBankDetails,
    fetchBankDetails,
    isLoading,
  };

  return (
    <BankDetailsContext.Provider value={value}>
      {children}
    </BankDetailsContext.Provider>
  );
};

export const useBankDetails = () => {
  const context = useContext(BankDetailsContext);
  if (context === undefined) {
    throw new Error('useBankDetails must be used within a BankDetailsProvider');
  }
  return context;
};
