import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "./context/InvoiceContext";
import HomePage from "./pages/HomePage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage";
import NotFound from "./pages/NotFound";
import UpdatePage from "./pages/UpdatePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <InvoiceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-invoice" element={<CreateInvoicePage />} />
            <Route path="/invoice-history" element={<InvoiceHistoryPage />} />
            <Route path="/update" element={<UpdatePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </InvoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
