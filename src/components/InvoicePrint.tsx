
import React from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { InvoicePrint as InvoicePrintUI } from '@/components/ui/invoice-print';

interface InvoicePrintProps {
  forwardRef: React.RefObject<HTMLDivElement>;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ forwardRef }) => {
  const { currentInvoice } = useInvoice();
  
  return <InvoicePrintUI invoice={currentInvoice} ref={forwardRef} />;
};

export default InvoicePrint;
