
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SellerDetails {
  id: string;
  company_name: string;
  address: string;
  gstin: string;
  contact: string | null;
  email: string | null;
  state: string;
  state_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SellerDetailsContextType {
  sellerDetails: SellerDetails[];
  activeSellerDetails: SellerDetails | null;
  addSellerDetails: (details: Omit<SellerDetails, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSellerDetails: (id: string, details: Partial<SellerDetails>) => Promise<void>;
  deleteSellerDetails: (id: string) => Promise<void>;
  setActiveSellerDetails: (id: string) => Promise<void>;
  fetchSellerDetails: () => Promise<void>;
  isLoading: boolean;
}

const SellerDetailsContext = createContext<SellerDetailsContextType | undefined>(undefined);

export const SellerDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellerDetails, setSellerDetails] = useState<SellerDetails[]>([]);
  const [activeSellerDetails, setActiveSellerDetailsState] = useState<SellerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSellerDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('seller_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSellerDetails(data || []);
      
      // Set the active seller details (first active one or first one)
      const activeDetails = data?.find(d => d.is_active) || data?.[0];
      if (activeDetails) {
        setActiveSellerDetailsState(activeDetails);
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch seller details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSellerDetails = async (details: Omit<SellerDetails, 'id' | 'created_at' | 'updated_at'>) => {
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

  const updateSellerDetails = async (id: string, details: Partial<SellerDetails>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('seller_details')
        .update(details)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSellerDetails(prev => prev.map(item => item.id === id ? data : item));
      
      // Update active details if it's the one being updated
      if (activeSellerDetails?.id === id) {
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

      setSellerDetails(prev => prev.filter(item => item.id !== id));
      
      // If deleted item was active, set another one as active
      if (activeSellerDetails?.id === id) {
        const remaining = sellerDetails.filter(item => item.id !== id);
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

  const setActiveSellerDetails = async (id: string) => {
    try {
      // Deactivate all first
      await supabase
        .from('seller_details')
        .update({ is_active: false })
        .neq('id', '');

      // Activate the selected one
      const { data, error } = await supabase
        .from('seller_details')
        .update({ is_active: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setActiveSellerDetailsState(data);
      setSellerDetails(prev => prev.map(item => ({
        ...item,
        is_active: item.id === id
      })));

      toast({
        title: 'Success',
        description: 'Active seller details updated',
      });
    } catch (error) {
      console.error('Error setting active seller details:', error);
      toast({
        title: 'Error',
        description: 'Failed to set active seller details',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchSellerDetails();
  }, []);

  const value = {
    sellerDetails,
    activeSellerDetails,
    addSellerDetails,
    updateSellerDetails,
    deleteSellerDetails,
    setActiveSellerDetails,
    fetchSellerDetails,
    isLoading,
  };

  return (
    <SellerDetailsContext.Provider value={value}>
      {children}
    </SellerDetailsContext.Provider>
  );
};

export const useSellerDetails = () => {
  const context = useContext(SellerDetailsContext);
  if (context === undefined) {
    throw new Error('useSellerDetails must be used within a SellerDetailsProvider');
  }
  return context;
};
