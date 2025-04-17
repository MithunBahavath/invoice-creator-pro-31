
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import NotFound from './pages/NotFound';
import UpdatePage from './pages/UpdatePage';
import { InvoiceProvider } from './context/InvoiceContext';
import { CylinderProvider } from './context/CylinderContext';
import { BuyerProvider } from './context/BuyerContext';
import './App.css';

function App() {
  return (
    <CylinderProvider>
      <BuyerProvider>
        <InvoiceProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-invoice" element={<CreateInvoicePage />} />
            <Route path="/invoice-history" element={<InvoiceHistoryPage />} />
            <Route path="/update" element={<UpdatePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </InvoiceProvider>
      </BuyerProvider>
    </CylinderProvider>
  );
}

export default App;
