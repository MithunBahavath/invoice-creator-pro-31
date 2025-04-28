import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, Edit, Trash2, FileText, Search, Plus, Share2 } from 'lucide-react';
import { useInvoice, Invoice } from '@/context/InvoiceContext';
import { formatDate } from '@/utils/helpers';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { InvoicePrint } from '@/components/ui/invoice-print';
import { toast } from '@/components/ui/use-toast';

const InvoiceHistoryPage: React.FC = () => {
  const { invoices, deleteInvoice, setCurrentInvoice } = useInvoice();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Invoice>('invoiceDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = search.toLowerCase();
    const dateMatches = !dateFilter || invoice.invoiceDate.includes(dateFilter);
    
    const searchMatches = !search 
      || invoice.invoiceNo.toLowerCase().includes(searchLower)
      || invoice.buyerName.toLowerCase().includes(searchLower)
      || invoice.totalAmount.toString().includes(searchLower);
    
    return dateMatches && searchMatches;
  }).sort((a, b) => {
    const fieldA = a[sortField]?.toString() || '';
    const fieldB = b[sortField]?.toString() || '';
    
    if (sortField === 'totalAmount') {
      return sortDirection === 'asc' 
        ? (a.totalAmount || 0) - (b.totalAmount || 0)
        : (b.totalAmount || 0) - (a.totalAmount || 0);
    }
    
    return sortDirection === 'asc' 
      ? fieldA.localeCompare(fieldB) 
      : fieldB.localeCompare(fieldA);
  });

  const toggleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setCurrentInvoice({...invoice});
  };

  const handleShare = async (invoice: Invoice, method: 'copy' | 'email') => {
    const invoiceUrl = `${window.location.origin}/invoice/${invoice.id}`;
    
    if (method === 'copy') {
      try {
        await navigator.clipboard.writeText(invoiceUrl);
        toast({
          title: "Link Copied",
          description: "Invoice link has been copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      }
    } else if (method === 'email') {
      const subject = `Invoice ${invoice.invoiceNo} from ${invoice.sellerName}`;
      const body = `View invoice details at: ${invoiceUrl}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

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
            <h1 className="text-2xl font-bold">Invoice History</h1>
          </div>
          <div className="flex space-x-2">
            <Link to="/update">
              <Button variant="secondary">
                Settings & Updates
              </Button>
            </Link>
            <Link to="/create-invoice">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Invoice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by invoice no. or customer name"
                    className="pl-8"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    placeholder="Filter by date"
                  />
                </div>
              </div>
              
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
                  <p className="mt-2 text-gray-500">
                    You haven't created any invoices yet. Create your first invoice to get started.
                  </p>
                  <Link to="/create-invoice" className="mt-4 inline-block">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Invoice
                    </Button>
                  </Link>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No matching invoices</h3>
                  <p className="mt-2 text-gray-500">
                    No invoices match your search criteria. Try adjusting your filters.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearch('');
                      setDateFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => toggleSort('invoiceNo')}
                        >
                          Invoice No.
                          {sortField === 'invoiceNo' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => toggleSort('invoiceDate')}
                        >
                          Date
                          {sortField === 'invoiceDate' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => toggleSort('buyerName')}
                        >
                          Customer
                          {sortField === 'buyerName' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer"
                          onClick={() => toggleSort('totalAmount')}
                        >
                          Amount
                          {sortField === 'totalAmount' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map(invoice => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNo}</TableCell>
                          <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                          <TableCell>{invoice.buyerName}</TableCell>
                          <TableCell className="text-right">₹ {invoice.totalAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>Invoice #{invoice.invoiceNo}</DialogTitle>
                                  </DialogHeader>
                                  <div className="overflow-y-auto max-h-[80vh]">
                                    <InvoicePrint invoice={invoice} />
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      onClick={() => window.print()}
                                      className="print:hidden"
                                    >
                                      Download PDF
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Link to="/create-invoice">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEdit(invoice)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                    <span className="sr-only">Share</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleShare(invoice, 'copy')}>
                                    Copy Link
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShare(invoice, 'email')}>
                                    Share via Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete invoice {invoice.invoiceNo}? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => deleteInvoice(invoice.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
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

export default InvoiceHistoryPage;
