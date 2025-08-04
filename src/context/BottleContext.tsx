
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

export interface Bottle {
  id: string;
  name: string;
  hsnSac: string;
  defaultRate: number;
  gstRate: number;
}

interface BottleContextType {
  bottles: Bottle[];
  addBottle: (bottle: Omit<Bottle, 'id'>) => void;
  updateBottle: (bottle: Bottle) => void;
  deleteBottle: (id: string) => void;
  getBottle: (id: string) => Bottle | undefined;
  isLoading: boolean;
}

const BottleContext = createContext<BottleContextType | undefined>(undefined);

export const BottleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load bottles from localStorage on component mount
  useEffect(() => {
    try {
      const savedBottles = localStorage.getItem('bottles');
      if (savedBottles) {
        const parsedBottles = JSON.parse(savedBottles);
        if (Array.isArray(parsedBottles)) {
          setBottles(parsedBottles);
        }
      }
    } catch (error) {
      console.error('Error loading bottles from localStorage:', error);
    }
  }, []);

  // Save bottles to localStorage whenever bottles change
  useEffect(() => {
    if (bottles.length > 0) {
      try {
        localStorage.setItem('bottles', JSON.stringify(bottles));
      } catch (error) {
        console.error('Error saving bottles to localStorage:', error);
      }
    }
  }, [bottles]);

  // Ensure data is saved before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (bottles.length > 0) {
        try {
          localStorage.setItem('bottles', JSON.stringify(bottles));
        } catch (error) {
          console.error('Error saving bottles on page unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [bottles]);

  const addBottle = (bottleData: Omit<Bottle, 'id'>) => {
    const newBottle: Bottle = {
      ...bottleData,
      id: uuidv4(),
    };
    const updatedBottles = [...bottles, newBottle];
    setBottles(updatedBottles);
    // Immediately save to localStorage
    try {
      localStorage.setItem('bottles', JSON.stringify(updatedBottles));
    } catch (error) {
      console.error('Error saving bottle to localStorage:', error);
    }
    toast({
      title: 'Success',
      description: 'Bottle added successfully',
    });
  };

  const updateBottle = (updatedBottle: Bottle) => {
    const updatedBottles = bottles.map(bottle => 
      bottle.id === updatedBottle.id ? updatedBottle : bottle
    );
    setBottles(updatedBottles);
    // Immediately save to localStorage
    try {
      localStorage.setItem('bottles', JSON.stringify(updatedBottles));
    } catch (error) {
      console.error('Error updating bottle in localStorage:', error);
    }
    toast({
      title: 'Success',
      description: 'Bottle updated successfully',
    });
  };

  const deleteBottle = (id: string) => {
    const updatedBottles = bottles.filter(bottle => bottle.id !== id);
    setBottles(updatedBottles);
    // Immediately save to localStorage
    try {
      localStorage.setItem('bottles', JSON.stringify(updatedBottles));
    } catch (error) {
      console.error('Error deleting bottle from localStorage:', error);
    }
    toast({
      title: 'Success',
      description: 'Bottle deleted successfully',
    });
  };

  const getBottle = (id: string) => {
    return bottles.find(bottle => bottle.id === id);
  };

  const value = {
    bottles,
    addBottle,
    updateBottle,
    deleteBottle,
    getBottle,
    isLoading,
  };

  return (
    <BottleContext.Provider value={value}>
      {children}
    </BottleContext.Provider>
  );
};

export const useBottles = () => {
  const context = useContext(BottleContext);
  if (context === undefined) {
    throw new Error('useBottles must be used within a BottleProvider');
  }
  return context;
};
