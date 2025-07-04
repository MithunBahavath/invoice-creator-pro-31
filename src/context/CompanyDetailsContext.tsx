
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SellerDetails {
  id?: string;
  company_name: string;
  address: string;
  gstin: string;
  contact?: string;
  email?: string;
  state: string;
  state_code: string;
  is_active?: boolean;
}

export interface BankDetails {
  id?: string;
  bank_name: string;
  account_no: string;
  ifsc_code: string;
  branch_name: string;
  is_active?: boolean;
}

interface CompanyDetailsContextType {
  sellerDetails: SellerDetails[];
  bankDetails: BankDetails[];
  activeSellerDetails: SellerDetails | null;
  activeBankDetails: BankDetails | null;
  addSellerDetails: (details: SellerDetails) => Promise<void>;
  updateSellerDetails: (details: SellerDetails) => Promise<void>;
  deleteSellerDetails: (id: string) => Promise<void>;
  addBankDetails: (details: BankDetails) => Promise<void>;
  updateBankDetails: (details: BankDetails) => Promise<void>;
  deleteBankDetails: (id: string) => Promise<void>;
  setActiveSellerDetails: (details: SellerDetails) => Promise<void>;
  setActiveBankDetails: (details: BankDetails) => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const CompanyDetailsContext = createContext<CompanyDetailsContextType | undefined>(undefined);

export const CompanyDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellerDetails, setSellerDetails] = useState<SellerDetails[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [activeSellerDetails, setActiveSellerDetailsState] = useState<SellerDetails | null>(null);
  const [activeBankDetails, setActiveBankDetailsState] = useState<BankDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch seller details
      const { data: sellers, error: sellersError } = await supabase
        .from('seller_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (sellersError) throw sellersError;
      setSellerDetails(sellers || []);

      // Set active seller (first active one or first one)
      const activeSeller = sellers?.find(s => s.is_active) || sellers?.[0];
      if (activeSeller) {
        setActiveSellerDetailsState(activeSeller);
      }

      // Fetch bank details
      const { data: banks, error: banksError } = await supabase
        .from('bank_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (banksError) throw banksError;
      setBankDetails(banks || []);

      // Set active bank (first active one or first one)
      const activeBank = banks?.find(b => b.is_active) || banks?.[0];
      if (activeBank) {
        setActiveBankDetailsState(activeBank);
      }

    } catch (error) {
      console.error('Error fetching company details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch company details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Seller details operations
  const addSellerDetails = async (details: SellerDetails) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('seller_details')
        .insert([details])
        .select()
        .single();

      if (error) throw error;

      setSellerDetails(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Seller details added successfully',
      });
    } catch (error) {
      console.error('Error adding seller details:', error);
      toast({
        title: 'Error',
        description: 'Failed to add seller details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSellerDetails = async (details: SellerDetails) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('seller_details')
        .update(details)
        .eq('id', details.id)
        .select()
        .single();

      if (error) throw error;

      setSellerDetails(prev => prev.map(s => s.id === details.id ? data : s));
      if (activeSellerDetails?.id === details.id) {
        setActiveSellerDetailsState(data);
      }
      
      toast({
        title: 'Success',
        description: 'Seller details updated successfully',
      });
    } catch (error) {
      console.error('Error updating seller details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update seller details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSellerDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('seller_details')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSellerDetails(prev => prev.filter(s => s.id !== id));
      if (activeSellerDetails?.id === id) {
        const remaining = sellerDetails.filter(s => s.id !== id);
        setActiveSellerDetailsState(remaining[0] || null);
      }

      toast({
        title: 'Success',
        description: 'Seller details deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting seller details:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete seller details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bank details operations
  const addBankDetails = async (details: BankDetails) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bank_details')
        .insert([details])
        .select()
        .single();

      if (error) throw error;

      setBankDetails(prev => [data, ...prev]);
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

  const updateBankDetails = async (details: BankDetails) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bank_details')
        .update(details)
        .eq('id', details.id)
        .select()
        .single();

      if (error) throw error;

      setBankDetails(prev => prev.map(b => b.id === details.id ? data : b));
      if (activeBankDetails?.id === details.id) {
        setActiveBankDetailsState(data);
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
      const { error } = await supabase
        .from('bank_details')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBankDetails(prev => prev.filter(b => b.id !== id));
      if (activeBankDetails?.id === id) {
        const remaining = bankDetails.filter(b => b.id !== id);
        setActiveBankDetailsState(remaining[0] || null);
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

  const setActiveSellerDetails = async (details: SellerDetails) => {
    try {
      // Set all others as inactive
      await supabase
        .from('seller_details')
        .update({ is_active: false })
        .neq('id', details.id);

      // Set this one as active
      await supabase
        .from('seller_details')
        .update({ is_active: true })
        .eq('id', details.id);

      setActiveSellerDetailsState(details);
      await refreshData();
    } catch (error) {
      console.error('Error setting active seller details:', error);
    }
  };

  const setActiveBankDetails = async (details: BankDetails) => {
    try {
      // Set all others as inactive
      await supabase
        .from('bank_details')
        .update({ is_active: false })
        .neq('id', details.id);

      // Set this one as active
      await supabase
        .from('bank_details')
        .update({ is_active: true })
        .eq('id', details.id);

      setActiveBankDetailsState(details);
      await refreshData();
    } catch (error) {
      console.error('Error setting active bank details:', error);
    }
  };

  const value = {
    sellerDetails,
    bankDetails,
    activeSellerDetails,
    activeBankDetails,
    addSellerDetails,
    updateSellerDetails,
    deleteSellerDetails,
    addBankDetails,
    updateBankDetails,
    deleteBankDetails,
    setActiveSellerDetails,
    setActiveBankDetails,
    isLoading,
    refreshData,
  };

  return (
    <CompanyDetailsContext.Provider value={value}>
      {children}
    </CompanyDetailsContext.Provider>
  );
};

export const useCompanyDetails = () => {
  const context = useContext(CompanyDetailsContext);
  if (context === undefined) {
    throw new Error('useCompanyDetails must be used within a CompanyDetailsProvider');
  }
  return context;
};
