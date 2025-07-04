
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import CylinderBuyerManagement from '@/components/CylinderBuyerManagement';
import BottleBuyerManagement from '@/components/BottleBuyerManagement';
import CylinderManagement from '@/components/CylinderManagement';
import BottleManagement from '@/components/BottleManagement';
import SellerDetailsManagement from '@/components/SellerDetailsManagement';
import BankDetailsManagement from '@/components/BankDetailsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppMode } from '@/context/AppModeContext';

const UpdatePage = () => {
  const { mode } = useAppMode();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 sm:p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <Link to="/">
              <Button variant="ghost" className="p-2 shrink-0">
                <ChevronLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold truncate">
              Settings & Updates - {mode === 'cylinder' ? 'Cylinders' : 'Bottles'}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue={mode === 'cylinder' ? 'cylinders' : 'bottles'} className="w-full">
            {/* Mobile-responsive tabs */}
            <div className="mb-4 overflow-x-auto">
              <TabsList className="grid h-auto w-full grid-cols-2 lg:grid-cols-4 gap-1 p-1">
                {mode === 'cylinder' ? (
                  <>
                    <TabsTrigger 
                      value="cylinders" 
                      className="text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
                    >
                      Cylinder Management
                    </TabsTrigger>
                    <TabsTrigger 
                      value="buyers" 
                      className="text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
                    >
                      Cylinder Buyers
                    </TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger 
                      value="bottles" 
                      className="text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
                    >
                      Bottle Management
                    </TabsTrigger>
                    <TabsTrigger 
                      value="buyers" 
                      className="text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
                    >
                      Bottle Buyers
                    </TabsTrigger>
                  </>
                )}
                <TabsTrigger 
                  value="seller" 
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
                >
                  Seller Details
                </TabsTrigger>
                <TabsTrigger 
                  value="bank" 
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
                >
                  Bank Details
                </TabsTrigger>
              </TabsList>
            </div>

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
            
            <TabsContent value="seller">
              <SellerDetailsManagement />
            </TabsContent>
            
            <TabsContent value="bank">
              <BankDetailsManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-gray-100 border-t p-4 sm:p-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p className="text-sm sm:text-base">© {new Date().getFullYear()} Billing Software. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UpdatePage;
