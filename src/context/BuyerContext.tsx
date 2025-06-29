
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUYERS } from '@/constants/billing';
import { Buyer } from '@/constants/billing';
import { toast } from '@/components/ui/use-toast';

interface BuyerContextType {
  buyers: Buyer[];
  addBuyer: (buyer: Buyer) => void;
  updateBuyer: (buyer: Buyer) => void;
  deleteBuyer: (gstin: string) => void;
  isLoading: boolean;
}

// Define API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const BuyerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch bottle buyers from backend
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const response = await fetch(`${API_URL}/bottle-buyers`);
        if (response.ok) {
          const data = await response.json();
          setBuyers(data);
        } else {
          // Fall back to localStorage if API fails
          const savedBuyers = localStorage.getItem('bottleBuyers');
          if (savedBuyers) {
            setBuyers(JSON.parse(savedBuyers));
          } else {
            setBuyers(BUYERS);
          }
        }
      } catch (error) {
        console.error('Error fetching bottle buyers:', error);
        // Fall back to localStorage if API fails
        const savedBuyers = localStorage.getItem('bottleBuyers');
        if (savedBuyers) {
          setBuyers(JSON.parse(savedBuyers));
        } else {
          setBuyers(BUYERS);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBuyers();
  }, []);

  // Save to localStorage as backup whenever buyers change
  useEffect(() => {
    localStorage.setItem('bottleBuyers', JSON.stringify(buyers));
  }, [buyers]);

  const addBuyer = async (buyer: Buyer) => {
    try {
      setIsLoading(true);
      
      // Try to save to API first
      const response = await fetch(`${API_URL}/bottle-buyers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...buyer, buyerType: 'bottle' }),
      });
      
      if (response.ok) {
        const savedBuyer = await response.json();
        setBuyers([...buyers, savedBuyer]);
        toast({
          title: 'Bottle Buyer Added',
          description: 'Bottle buyer has been added successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setBuyers([...buyers, buyer]);
        toast({
          title: 'Warning',
          description: 'Could not save to server, saved locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding bottle buyer:', error);
      // Fall back to localStorage if API fails
      setBuyers([...buyers, buyer]);
      toast({
        title: 'Warning',
        description: 'Server connection failed, saved locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBuyer = async (updatedBuyer: Buyer) => {
    try {
      setIsLoading(true);
      
      // Try to update via API first
      const response = await fetch(`${API_URL}/bottle-buyers/${updatedBuyer.gstin}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedBuyer, buyerType: 'bottle' }),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setBuyers(buyers.map(buyer => 
          buyer.gstin === updatedData.gstin ? updatedData : buyer
        ));
        toast({
          title: 'Bottle Buyer Updated',
          description: 'Bottle buyer has been updated successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setBuyers(buyers.map(buyer => 
          buyer.gstin === updatedBuyer.gstin ? updatedBuyer : buyer
        ));
        toast({
          title: 'Warning',
          description: 'Could not update on server, updated locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating bottle buyer:', error);
      // Fall back to localStorage if API fails
      setBuyers(buyers.map(buyer => 
        buyer.gstin === updatedBuyer.gstin ? updatedBuyer : buyer
      ));
      toast({
        title: 'Warning',
        description: 'Server connection failed, updated locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBuyer = async (gstin: string) => {
    try {
      setIsLoading(true);
      
      // Try to delete via API first
      const response = await fetch(`${API_URL}/bottle-buyers/${gstin}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBuyers(buyers.filter(buyer => buyer.gstin !== gstin));
        toast({
          title: 'Bottle Buyer Deleted',
          description: 'Bottle buyer has been deleted successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setBuyers(buyers.filter(buyer => buyer.gstin !== gstin));
        toast({
          title: 'Warning',
          description: 'Could not delete from server, deleted locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting bottle buyer:', error);
      // Fall back to localStorage if API fails
      setBuyers(buyers.filter(buyer => buyer.gstin !== gstin));
      toast({
        title: 'Warning',
        description: 'Server connection failed, deleted locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    buyers,
    addBuyer,
    updateBuyer,
    deleteBuyer,
    isLoading,
  };

  return (
    <BuyerContext.Provider value={value}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyers = () => {
  const context = useContext(BuyerContext);
  if (context === undefined) {
    throw new Error('useBuyers must be used within a BuyerProvider');
  }
  return context;
};
