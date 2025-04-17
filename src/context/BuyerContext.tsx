
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUYERS } from '@/constants/billing';
import { Buyer } from '@/constants/billing';

interface BuyerContextType {
  buyers: Buyer[];
  addBuyer: (buyer: Buyer) => void;
  updateBuyer: (buyer: Buyer) => void;
  deleteBuyer: (gstin: string) => void;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const BuyerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyers, setBuyers] = useState<Buyer[]>(() => {
    const savedBuyers = localStorage.getItem('buyers');
    return savedBuyers ? JSON.parse(savedBuyers) : BUYERS;
  });

  // Save to localStorage whenever buyers change
  useEffect(() => {
    localStorage.setItem('buyers', JSON.stringify(buyers));
  }, [buyers]);

  const addBuyer = (buyer: Buyer) => {
    setBuyers([...buyers, buyer]);
  };

  const updateBuyer = (updatedBuyer: Buyer) => {
    setBuyers(buyers.map(buyer => 
      buyer.gstin === updatedBuyer.gstin ? updatedBuyer : buyer
    ));
  };

  const deleteBuyer = (gstin: string) => {
    setBuyers(buyers.filter(buyer => buyer.gstin !== gstin));
  };

  const value = {
    buyers,
    addBuyer,
    updateBuyer,
    deleteBuyer,
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
