
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUYERS } from '@/constants/billing';
import { Buyer } from '@/constants/billing';
import { toast } from '@/components/ui/use-toast';

interface CylinderBuyerContextType {
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

const CylinderBuyerContext = createContext<CylinderBuyerContextType | undefined>(undefined);

export const CylinderBuyerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch buyers from backend
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const response = await fetch(`${API_URL}/cylinder-buyers`);
        if (response.ok) {
          const data = await response.json();
          setBuyers(data);
        } else {
          // Fall back to localStorage if API fails
          const savedBuyers = localStorage.getItem('cylinderBuyers');
          if (savedBuyers) {
            setBuyers(JSON.parse(savedBuyers));
          } else {
            setBuyers(BUYERS);
          }
        }
      } catch (error) {
        console.error('Error fetching cylinder buyers:', error);
        // Fall back to localStorage if API fails
        const savedBuyers = localStorage.getItem('cylinderBuyers');
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
    localStorage.setItem('cylinderBuyers', JSON.stringify(buyers));
  }, [buyers]);

  const addBuyer = async (buyer: Buyer) => {
    try {
      setIsLoading(true);
      
      // Try to save to API first
      const response = await fetch(`${API_URL}/cylinder-buyers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyer),
      });
      
      if (response.ok) {
        const savedBuyer = await response.json();
        setBuyers([...buyers, savedBuyer]);
        toast({
          title: 'Cylinder Buyer Added',
          description: 'Cylinder buyer has been added successfully',
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
      console.error('Error adding cylinder buyer:', error);
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
      const response = await fetch(`${API_URL}/cylinder-buyers/${updatedBuyer.gstin}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBuyer),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setBuyers(buyers.map(buyer => 
          buyer.gstin === updatedData.gstin ? updatedData : buyer
        ));
        toast({
          title: 'Cylinder Buyer Updated',
          description: 'Cylinder buyer has been updated successfully',
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
      console.error('Error updating cylinder buyer:', error);
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
      const response = await fetch(`${API_URL}/cylinder-buyers/${gstin}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBuyers(buyers.filter(buyer => buyer.gstin !== gstin));
        toast({
          title: 'Cylinder Buyer Deleted',
          description: 'Cylinder buyer has been deleted successfully',
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
      console.error('Error deleting cylinder buyer:', error);
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
    <CylinderBuyerContext.Provider value={value}>
      {children}
    </CylinderBuyerContext.Provider>
  );
};

export const useCylinderBuyers = () => {
  const context = useContext(CylinderBuyerContext);
  if (context === undefined) {
    throw new Error('useCylinderBuyers must be used within a CylinderBuyerProvider');
  }
  return context;
};
