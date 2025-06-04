
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
    const savedBottles = localStorage.getItem('bottles');
    if (savedBottles) {
      setBottles(JSON.parse(savedBottles));
    }
  }, []);

  // Save bottles to localStorage whenever bottles change
  useEffect(() => {
    localStorage.setItem('bottles', JSON.stringify(bottles));
  }, [bottles]);

  const addBottle = (bottleData: Omit<Bottle, 'id'>) => {
    const newBottle: Bottle = {
      ...bottleData,
      id: uuidv4(),
    };
    setBottles([...bottles, newBottle]);
    toast({
      title: 'Success',
      description: 'Bottle added successfully',
    });
  };

  const updateBottle = (updatedBottle: Bottle) => {
    setBottles(bottles.map(bottle => 
      bottle.id === updatedBottle.id ? updatedBottle : bottle
    ));
    toast({
      title: 'Success',
      description: 'Bottle updated successfully',
    });
  };

  const deleteBottle = (id: string) => {
    setBottles(bottles.filter(bottle => bottle.id !== id));
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
