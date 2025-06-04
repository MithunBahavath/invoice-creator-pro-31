
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import CylinderBuyerManagement from '@/components/CylinderBuyerManagement';
import BottleBuyerManagement from '@/components/BottleBuyerManagement';
import CylinderManagement from '@/components/CylinderManagement';
import BottleManagement from '@/components/BottleManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppMode } from '@/context/AppModeContext';

const UpdatePage = () => {
  const { mode } = useAppMode();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="p-2">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Settings & Updates - {mode === 'cylinder' ? 'Cylinders' : 'Bottles'}</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue={mode === 'cylinder' ? 'cylinders' : 'bottles'} className="w-full">
            <TabsList className="mb-4">
              {mode === 'cylinder' ? (
                <>
                  <TabsTrigger value="cylinders">Cylinder Management</TabsTrigger>
                  <TabsTrigger value="buyers">Cylinder Buyer Management</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="bottles">Bottle Management</TabsTrigger>
                  <TabsTrigger value="buyers">Bottle Buyer Management</TabsTrigger>
                </>
              )}
            </TabsList>
            {mode === 'cylinder' ? (
              <>
                <TabsContent value="cylinders">
                  <CylinderManagement />
                </TabsContent>
                <TabsContent value="buyers">
                  <CylinderBuyerManagement />
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="bottles">
                  <BottleManagement />
                </TabsContent>
                <TabsContent value="buyers">
                  <BottleBuyerManagement />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      <footer className="bg-gray-100 border-t p-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} Billing Software. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UpdatePage;
