import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import NotFound from './pages/NotFound';
import UpdatePage from './pages/UpdatePage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import Index from './pages/Index';
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
    <AuthProvider>
      <AppModeProvider>
        <SellerDetailsProvider>
          <BankDetailsProvider>
            <CylinderProvider>
              <BottleProvider>
                <CylinderBuyerProvider>
                  <BuyerProvider>
                    <InvoiceProvider>
                      <Routes>
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                        <Route path="/create-invoice" element={<ProtectedRoute><CreateInvoicePage /></ProtectedRoute>} />
                        <Route path="/invoice-history" element={<ProtectedRoute><InvoiceHistoryPage /></ProtectedRoute>} />
                        <Route path="/update" element={<ProtectedRoute><UpdatePage /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
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
    </AuthProvider>
  );
}

export default App;