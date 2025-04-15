
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, History, Plus } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Billing Software</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Receipt className="h-6 w-6" />
                Create New Invoice
              </CardTitle>
              <CardDescription>
                Create a new tax invoice with automatic tax calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate professional tax invoices with automatic GST calculations, amount in words, e-Way bill generation, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/create-invoice" className="w-full">
                <Button className="w-full" size="lg">
                  <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <History className="h-6 w-6" />
                Invoice History
              </CardTitle>
              <CardDescription>
                View, edit and manage your previously created invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access your invoice history, search by customer or date, edit existing invoices, and export copies as needed.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/invoice-history" className="w-full">
                <Button className="w-full" variant="outline" size="lg">
                  <History className="mr-2 h-4 w-4" /> View Invoices
                </Button>
              </Link>
            </CardFooter>
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

export default HomePage;
