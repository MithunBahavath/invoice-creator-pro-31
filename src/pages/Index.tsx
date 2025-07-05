
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CreateInvoicePage from './CreateInvoicePage';
import InvoiceHistoryPage from './InvoiceHistoryPage';
import UpdatePage from './UpdatePage';
import DashboardPage from './DashboardPage';
import NotFound from './NotFound';

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create" element={<CreateInvoicePage />} />
      <Route path="/history" element={<InvoiceHistoryPage />} />
      <Route path="/update" element={<UpdatePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
