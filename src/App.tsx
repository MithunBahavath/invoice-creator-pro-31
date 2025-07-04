import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { InvoiceProvider } from '@/context/InvoiceContext';
import { BuyerProvider } from '@/context/BuyerContext';
import { CylinderBuyerProvider } from '@/context/CylinderBuyerContext';
import { CylinderProvider } from '@/context/CylinderContext';
import { BottleProvider } from '@/context/BottleContext';
import { AppModeProvider } from '@/context/AppModeContext';
import { CompanyDetailsProvider } from '@/context/CompanyDetailsContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppModeProvider>
      <CompanyDetailsProvider>
        <InvoiceProvider>
          <BuyerProvider>
            <CylinderBuyerProvider>
              <CylinderProvider>
                <BottleProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/*" element={<Index />} />
                      </Routes>
                    </BrowserRouter>
                  </TooltipProvider>
                </BottleProvider>
              </CylinderProvider>
            </CylinderBuyerProvider>
          </BuyerProvider>
        </InvoiceProvider>
      </CompanyDetailsProvider>
    </AppModeProvider>
  </QueryClientProvider>
);

export default App;
