
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Cylinder {
  id: string;
  name: string;
  hsnSac: string;
  defaultRate: number;
  gstRate: number;
}

interface CylinderContextType {
  cylinders: Cylinder[];
  addCylinder: (cylinder: Cylinder) => void;
  updateCylinder: (cylinder: Cylinder) => void;
  deleteCylinder: (id: string) => void;
}

const CylinderContext = createContext<CylinderContextType | undefined>(undefined);

export const CylinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cylinders, setCylinders] = useState<Cylinder[]>(() => {
    const savedCylinders = localStorage.getItem('cylinders');
    return savedCylinders 
      ? JSON.parse(savedCylinders) 
      : [
          { id: '1', name: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800, gstRate: 5 },
          { id: '2', name: '12kg', hsnSac: '27111900', defaultRate: 1200, gstRate: 5 },
          { id: '3', name: '17kg', hsnSac: '27111900', defaultRate: 1700, gstRate: 5 },
          { id: '4', name: '33kg', hsnSac: '27111900', defaultRate: 3300, gstRate: 5 },
        ];
  });

  // Save to localStorage whenever cylinders change
  useEffect(() => {
    localStorage.setItem('cylinders', JSON.stringify(cylinders));
  }, [cylinders]);

  const addCylinder = (cylinder: Cylinder) => {
    setCylinders([...cylinders, cylinder]);
  };

  const updateCylinder = (updatedCylinder: Cylinder) => {
    setCylinders(cylinders.map(cylinder => 
      cylinder.id === updatedCylinder.id ? updatedCylinder : cylinder
    ));
  };

  const deleteCylinder = (id: string) => {
    setCylinders(cylinders.filter(cylinder => cylinder.id !== id));
  };

  const value = {
    cylinders,
    addCylinder,
    updateCylinder,
    deleteCylinder,
  };

  return (
    <CylinderContext.Provider value={value}>
      {children}
    </CylinderContext.Provider>
  );
};

export const useCylinders = () => {
  const context = useContext(CylinderContext);
  if (context === undefined) {
    throw new Error('useCylinders must be used within a CylinderProvider');
  }
  return context;
};
