
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { saveToStorage, loadFromStorage } from '@/utils/localStorage';

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

  // Load bottles from storage on component mount
  useEffect(() => {
    const loadBottles = async () => {
      try {
        const savedBottles = await loadFromStorage<Bottle[]>('bottles', []);
        if (Array.isArray(savedBottles)) {
          setBottles(savedBottles);
        }
      } catch (error) {
        console.error('Error loading bottles:', error);
      }
    };
    
    loadBottles();
  }, []);

  // Save bottles to storage whenever bottles change
  useEffect(() => {
    if (bottles.length > 0) {
      saveToStorage('bottles', bottles);
    }
  }, [bottles]);

  // Ensure data is saved before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (bottles.length > 0) {
        saveToStorage('bottles', bottles);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [bottles]);

  const addBottle = async (bottleData: Omit<Bottle, 'id'>) => {
    const newBottle: Bottle = {
      ...bottleData,
      id: uuidv4(),
    };
    const updatedBottles = [...bottles, newBottle];
    setBottles(updatedBottles);
    // Immediately save to storage
    await saveToStorage('bottles', updatedBottles);
    toast({
      title: 'Success',
      description: 'Bottle added successfully',
    });
  };

  const updateBottle = async (updatedBottle: Bottle) => {
    const updatedBottles = bottles.map(bottle => 
      bottle.id === updatedBottle.id ? updatedBottle : bottle
    );
    setBottles(updatedBottles);
    // Immediately save to storage
    await saveToStorage('bottles', updatedBottles);
    toast({
      title: 'Success',
      description: 'Bottle updated successfully',
    });
  };

  const deleteBottle = async (id: string) => {
    const updatedBottles = bottles.filter(bottle => bottle.id !== id);
    setBottles(updatedBottles);
    // Immediately save to storage
    await saveToStorage('bottles', updatedBottles);
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
