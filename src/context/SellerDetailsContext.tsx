
import React, { createContext, useContext, useState, useEffect } from 'react';
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
      const stored = localStorage.getItem('sellerDetails');
      let data = stored ? JSON.parse(stored) : [];

      // Add default AGNEE GAS DISTRIBUTER if no data exists
      if (data.length === 0) {
        const defaultSeller: SellerDetails = {
          id: crypto.randomUUID(),
          company_name: 'AGNEE GAS DISTRIBUTER',
          address: '3/168B IRRUKUR\nPARAMATHI VELUR\nNAMAKKAL\nTamil Nadu - 637204, India',
          gstin: '33HVVPS5257L1ZH',
          contact: null,
          email: null,
          state: 'Tamil Nadu',
          state_code: '33',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        data = [defaultSeller];
        localStorage.setItem('sellerDetails', JSON.stringify(data));
      }

      setSellerDetails(data);
      
      // Set the active seller details (first active one or first one)
      const activeDetails = data.find((d: SellerDetails) => d.is_active) || data[0];
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
      const now = new Date().toISOString();
      const newDetails: SellerDetails = {
        ...details,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
      };

      const updated = [newDetails, ...sellerDetails];
      setSellerDetails(updated);
      localStorage.setItem('sellerDetails', JSON.stringify(updated));
      
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
      const updatedDetails = { ...details, updated_at: new Date().toISOString() };
      
      const updated = sellerDetails.map(item => 
        item.id === id ? { ...item, ...updatedDetails } : item
      );
      
      setSellerDetails(updated);
      localStorage.setItem('sellerDetails', JSON.stringify(updated));
      
      // Update active details if it's the one being updated
      if (activeSellerDetails?.id === id) {
        const updatedItem = updated.find(item => item.id === id);
        if (updatedItem) {
          setActiveSellerDetailsState(updatedItem);
        }
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
      const updated = sellerDetails.filter(item => item.id !== id);
      
      setSellerDetails(updated);
      localStorage.setItem('sellerDetails', JSON.stringify(updated));
      
      // If deleted item was active, set another one as active
      if (activeSellerDetails?.id === id) {
        setActiveSellerDetailsState(updated[0] || null);
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
      const updated = sellerDetails.map(item => ({
        ...item,
        is_active: item.id === id,
        updated_at: new Date().toISOString()
      }));

      setSellerDetails(updated);
      localStorage.setItem('sellerDetails', JSON.stringify(updated));
      
      const activeItem = updated.find(item => item.id === id);
      if (activeItem) {
        setActiveSellerDetailsState(activeItem);
      }

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
