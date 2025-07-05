
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import NotFound from './pages/NotFound';
import UpdatePage from './pages/UpdatePage';
import DashboardPage from './pages/DashboardPage';
import { InvoiceProvider } from './context/InvoiceContext';
import { CylinderProvider } from './context/CylinderContext';
import { BuyerProvider } from './context/BuyerContext';
import { CylinderBuyerProvider } from './context/CylinderBuyerContext';
import { BottleProvider } from './context/BottleContext';
import { AppModeProvider } from './context/AppModeContext';
import { SellerDetailsProvider } from './context/SellerDetailsContext';
import { BankDetailsProvider } from './context/BankDetailsContext';
import './App.css';

function App() {
  return (
    <AppModeProvider>
      <SellerDetailsProvider>
        <BankDetailsProvider>
          <CylinderProvider>
            <BottleProvider>
              <CylinderBuyerProvider>
                <BuyerProvider>
                  <InvoiceProvider>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/create-invoice" element={<CreateInvoicePage />} />
                      <Route path="/invoice-history" element={<InvoiceHistoryPage />} />
                      <Route path="/update" element={<UpdatePage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </InvoiceProvider>
                </BuyerProvider>
              </CylinderBuyerProvider>
            </BottleProvider>
          </CylinderProvider>
        </BankDetailsProvider>
      </SellerDetailsProvider>
    </AppModeProvider>
  );
}

export default App;
