
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

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
  isLoading: boolean;
}

// Define API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

const CylinderContext = createContext<CylinderContextType | undefined>(undefined);

export const CylinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch cylinders from backend
  useEffect(() => {
    const fetchCylinders = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const response = await fetch(`${API_URL}/cylinders`);
        if (response.ok) {
          const data = await response.json();
          setCylinders(data);
        } else {
          // Fall back to localStorage if API fails
          const savedCylinders = localStorage.getItem('cylinders');
          if (savedCylinders) {
            setCylinders(JSON.parse(savedCylinders));
          } else {
            setCylinders([
              { id: '1', name: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800, gstRate: 5 },
              { id: '2', name: '12kg', hsnSac: '27111900', defaultRate: 1200, gstRate: 5 },
              { id: '3', name: '17kg', hsnSac: '27111900', defaultRate: 1700, gstRate: 5 },
              { id: '4', name: '33kg', hsnSac: '27111900', defaultRate: 3300, gstRate: 5 },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching cylinders:', error);
        // Fall back to localStorage if API fails
        const savedCylinders = localStorage.getItem('cylinders');
        if (savedCylinders) {
          setCylinders(JSON.parse(savedCylinders));
        } else {
          setCylinders([
            { id: '1', name: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800, gstRate: 5 },
            { id: '2', name: '12kg', hsnSac: '27111900', defaultRate: 1200, gstRate: 5 },
            { id: '3', name: '17kg', hsnSac: '27111900', defaultRate: 1700, gstRate: 5 },
            { id: '4', name: '33kg', hsnSac: '27111900', defaultRate: 3300, gstRate: 5 },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCylinders();
  }, []);

  // Save to localStorage as backup whenever cylinders change
  useEffect(() => {
    localStorage.setItem('cylinders', JSON.stringify(cylinders));
  }, [cylinders]);

  const addCylinder = async (cylinder: Cylinder) => {
    try {
      setIsLoading(true);
      
      // Try to save to API first
      const response = await fetch(`${API_URL}/cylinders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cylinder),
      });
      
      if (response.ok) {
        const savedCylinder = await response.json();
        setCylinders([...cylinders, savedCylinder]);
        toast({
          title: 'Cylinder Added',
          description: 'Cylinder has been added successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setCylinders([...cylinders, cylinder]);
        toast({
          title: 'Warning',
          description: 'Could not save to server, saved locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding cylinder:', error);
      // Fall back to localStorage if API fails
      setCylinders([...cylinders, cylinder]);
      toast({
        title: 'Warning',
        description: 'Server connection failed, saved locally',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCylinder = async (updatedCylinder: Cylinder) => {
    try {
      setIsLoading(true);
      
      // Try to update via API first
      const response = await fetch(`${API_URL}/cylinders/${updatedCylinder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCylinder),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setCylinders(cylinders.map(cylinder => 
          cylinder.id === updatedData.id ? updatedData : cylinder
        ));
        toast({
          title: 'Cylinder Updated',
          description: 'Cylinder has been updated successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setCylinders(cylinders.map(cylinder => 
          cylinder.id === updatedCylinder.id ? updatedCylinder : cylinder
        ));
        toast({
          title: 'Warning',
          description: 'Could not update on server, updated locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating cylinder:', error);
      // Fall back to localStorage if API fails
      setCylinders(cylinders.map(cylinder => 
        cylinder.id === updatedCylinder.id ? updatedCylinder : cylinder
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

  const deleteCylinder = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Try to delete via API first
      const response = await fetch(`${API_URL}/cylinders/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCylinders(cylinders.filter(cylinder => cylinder.id !== id));
        toast({
          title: 'Cylinder Deleted',
          description: 'Cylinder has been deleted successfully',
        });
      } else {
        // Fall back to localStorage if API fails
        setCylinders(cylinders.filter(cylinder => cylinder.id !== id));
        toast({
          title: 'Warning',
          description: 'Could not delete from server, deleted locally',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting cylinder:', error);
      // Fall back to localStorage if API fails
      setCylinders(cylinders.filter(cylinder => cylinder.id !== id));
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
    cylinders,
    addCylinder,
    updateCylinder,
    deleteCylinder,
    isLoading,
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
