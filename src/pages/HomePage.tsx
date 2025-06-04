
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, History, Plus, Settings, BarChart, FileText, Home, Cylinder, Users, FileBarChart } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useAppMode } from '@/context/AppModeContext';

const HomePage: React.FC = () => {
  const { mode, setMode } = useAppMode();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Agnee Gas Distributors</h1>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/create-invoice" className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/invoice-history" className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <History className="mr-2 h-4 w-4" />
                    View Invoices
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/dashboard" className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Hero Banner with Mode Selection */}
      <div className="bg-primary text-primary-foreground py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Agnee Gas Distributor Billing Software</h1>
          <p className="text-xl mb-8">Create invoices, manage customers, and grow your business easily and professionally.</p>
          
          {/* Mode Selection */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              variant={mode === 'cylinder' ? 'secondary' : 'outline'}
              onClick={() => setMode('cylinder')}
              className="px-8 py-6 text-lg"
            >
              <Cylinder className="mr-2 h-5 w-5" />
              Cylinder
            </Button>
            <Button 
              size="lg" 
              variant={mode === 'bottle' ? 'secondary' : 'outline'}
              onClick={() => setMode('bottle')}
              className="px-8 py-6 text-lg"
            >
              <FileBarChart className="mr-2 h-5 w-5" />
              Bottle
            </Button>
          </div>
          
          <div className="text-lg">
            Currently managing: <span className="font-bold">{mode === 'cylinder' ? 'Cylinders' : 'Bottles'}</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Complete {mode === 'cylinder' ? 'Gas Cylinder' : 'Bottle'} Distribution Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                {mode === 'cylinder' ? <Cylinder className="h-8 w-8 text-primary" /> : <FileBarChart className="h-8 w-8 text-primary" />}
              </div>
              <h3 className="text-xl font-bold mb-2">{mode === 'cylinder' ? 'Cylinder' : 'Bottle'} Management</h3>
              <p className="text-gray-600">
                Track inventory, manage different {mode === 'cylinder' ? 'cylinder sizes' : 'bottle types'} and their rates with ease.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Database</h3>
              <p className="text-gray-600">Maintain complete customer records and access them instantly while creating invoices.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <FileBarChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Business Analytics</h3>
              <p className="text-gray-600">Get valuable insights with comprehensive dashboards and reports on your sales data.</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
              <span className="mr-2">Explore all features</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Quick Actions - {mode === 'cylinder' ? 'Cylinders' : 'Bottles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Receipt className="h-6 w-6" />
                  Create New Invoice
                </CardTitle>
                <CardDescription>
                  Create a new tax invoice for {mode === 'cylinder' ? 'cylinders' : 'bottles'} with automatic tax calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate professional tax invoices with automatic GST calculations, amount in words, and more.
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
                  View, edit and manage your previously created {mode === 'cylinder' ? 'cylinder' : 'bottle'} invoices
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

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Settings className="h-6 w-4" />
                  Update Details
                </CardTitle>
                <CardDescription>
                  Manage buyers, {mode === 'cylinder' ? 'cylinders' : 'bottles'}, and tax configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Add or edit buyers, manage {mode === 'cylinder' ? 'cylinder sizes' : 'bottle types'} and their prices, and configure tax rates.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/update" className="w-full">
                  <Button className="w-full" variant="secondary" size="lg">
                    <Settings className="mr-2 h-4 w-4" /> Update Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer with Contact and Company Information */}
      <footer className="bg-primary text-primary-foreground p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="flex items-center justify-center md:justify-end mb-2">
              <span className="mr-2">📞</span> 8072991484
            </p>
            <p className="flex items-center justify-center md:justify-end mb-2">
              <span className="mr-2">📧</span> sathishp@gmail.com
            </p>
            <p className="flex items-center justify-center md:justify-end">
              <span className="mr-2">📍</span> 3/168B Irrukur, Paramathi Velur, Namakkal - 637204
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <p className="mb-2">Agnee Gas Distributor</p>
            <p className="mb-2">CEO: Mr. Sathish P</p>
            <p>GSTIN/UIN: 33HVVPS5257L1ZH</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Agnee Gas Distributor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
