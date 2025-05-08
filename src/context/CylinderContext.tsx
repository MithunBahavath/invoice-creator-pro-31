
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface Cylinder {
  id: string;
  name: string;
  hsnSac: string;
  defaultRate: number;
  gstRate: number;
}

interface CylinderContextType {
  cylinders: Cylinder[];
  addCylinder: (cylinder: Omit<Cylinder, "id">) => void;
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
        console.log('Fetching cylinders from:', `${API_URL}/cylinders`);
        // Try to fetch from API first
        const response = await fetch(`${API_URL}/cylinders`, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Cylinders data:', data);
          setCylinders(data);
        } else {
          console.warn('API returned non-OK status:', response.status);
          // Fall back to localStorage if API fails
          const savedCylinders = localStorage.getItem('cylinders');
          if (savedCylinders) {
            setCylinders(JSON.parse(savedCylinders));
          } else {
            // Initialize with default cylinders if neither API nor localStorage works
            const defaultCylinders = [
              { id: uuidv4(), name: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800, gstRate: 5 },
              { id: uuidv4(), name: '12kg', hsnSac: '27111900', defaultRate: 1200, gstRate: 5 },
              { id: uuidv4(), name: '17kg', hsnSac: '27111900', defaultRate: 1700, gstRate: 5 },
              { id: uuidv4(), name: '33kg', hsnSac: '27111900', defaultRate: 3300, gstRate: 5 },
            ];
            setCylinders(defaultCylinders);
            localStorage.setItem('cylinders', JSON.stringify(defaultCylinders));
          }
        }
      } catch (error) {
        console.error('Error fetching cylinders:', error);
        // Fall back to localStorage if API fails
        const savedCylinders = localStorage.getItem('cylinders');
        if (savedCylinders) {
          setCylinders(JSON.parse(savedCylinders));
        } else {
          // Initialize with default cylinders if neither API nor localStorage works
          const defaultCylinders = [
            { id: uuidv4(), name: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800, gstRate: 5 },
            { id: uuidv4(), name: '12kg', hsnSac: '27111900', defaultRate: 1200, gstRate: 5 },
            { id: uuidv4(), name: '17kg', hsnSac: '27111900', defaultRate: 1700, gstRate: 5 },
            { id: uuidv4(), name: '33kg', hsnSac: '27111900', defaultRate: 3300, gstRate: 5 },
          ];
          setCylinders(defaultCylinders);
          localStorage.setItem('cylinders', JSON.stringify(defaultCylinders));
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

  const addCylinder = async (cylinderData: Omit<Cylinder, "id">) => {
    try {
      setIsLoading(true);
      
      // Make sure name field is not empty
      if (!cylinderData.name || cylinderData.name.trim() === '') {
        toast({
          title: 'Validation Error',
          description: 'Cylinder name is required',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      // Generate a unique ID for the new cylinder
      const cylinder = { ...cylinderData, id: Date.now().toString() } as Cylinder;
      
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
        console.warn('API returned non-OK status when adding cylinder:', response.status);
        
        // Try to get more detailed error information
        const errorData = await response.json().catch(() => ({
          message: 'Could not save to server'
        }));
        
        // Fall back to localStorage if API fails
        setCylinders([...cylinders, cylinder]);
        toast({
          title: 'Warning',
          description: `Server error: ${errorData.message || 'Could not save to server'}, saved locally`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding cylinder:', error);
      // Generate a unique ID for the new cylinder
      const cylinder = { ...cylinderData, id: Date.now().toString() } as Cylinder;
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
      console.log('Updating cylinder:', updatedCylinder);
      
      // Validation
      if (!updatedCylinder.name || updatedCylinder.name.trim() === '') {
        toast({
          title: 'Validation Error',
          description: 'Cylinder name is required',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      // Try to update via API first
      const response = await fetch(`${API_URL}/cylinders/${updatedCylinder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCylinder),
      });
      
      console.log('Update response status:', response.status);
      
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
        console.warn('API returned non-OK status when updating cylinder:', response.status);
        
        // Try to get more detailed error information
        const errorData = await response.json().catch(() => ({
          message: 'Could not update on server'
        }));
        
        // Fall back to localStorage if API fails
        setCylinders(cylinders.map(cylinder => 
          cylinder.id === updatedCylinder.id ? updatedCylinder : cylinder
        ));
        toast({
          title: 'Warning',
          description: `Server error: ${errorData.message || 'Could not update on server'}, updated locally`,
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
      console.log('Deleting cylinder with ID:', id);
      
      // Try to delete via API first
      const response = await fetch(`${API_URL}/cylinders/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        setCylinders(cylinders.filter(cylinder => cylinder.id !== id));
        toast({
          title: 'Cylinder Deleted',
          description: 'Cylinder has been deleted successfully',
        });
      } else {
        console.warn('API returned non-OK status when deleting cylinder:', response.status);
        
        // Try to get more detailed error information
        const errorData = await response.json().catch(() => ({
          message: 'Could not delete from server'
        }));
        
        // Fall back to localStorage if API fails
        setCylinders(cylinders.filter(cylinder => cylinder.id !== id));
        toast({
          title: 'Warning',
          description: `Server error: ${errorData.message || 'Could not delete from server'}, deleted locally`,
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
