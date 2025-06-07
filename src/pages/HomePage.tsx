
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, History, Plus, Settings, BarChart, FileText, Home, Cylinder, Users, FileBarChart, Menu } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useAppMode } from '@/context/AppModeContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const HomePage: React.FC = () => {
  const { mode, setMode } = useAppMode();

  const NavigationLinks = () => (
    <>
      <Link to="/" className="flex items-center px-3 py-2 text-white hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
        <Home className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      <Link to="/create-invoice" className="flex items-center px-3 py-2 text-white hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
        <FileText className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Create Invoice</span>
      </Link>
      <Link to="/invoice-history" className="flex items-center px-3 py-2 text-white hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
        <History className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">View Invoices</span>
      </Link>
      <Link to="/dashboard" className="flex items-center px-3 py-2 text-white hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
        <BarChart className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile-Responsive Top Navigation Bar */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Agnee Gas Distributors</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                <NavigationMenuItem>
                  <NavigationLinks />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <NavigationLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile-Responsive Hero Banner with Mode Selection */}
      <div className="bg-primary text-primary-foreground py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Agnee Gas Distributor Billing Software</h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Create invoices, manage customers, and grow your business easily and professionally.</p>
          
          {/* Mobile-Responsive Mode Selection */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button 
              size="lg" 
              variant={mode === 'cylinder' ? 'secondary' : 'outline'}
              onClick={() => setMode('cylinder')}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
            >
              <Cylinder className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Cylinder
            </Button>
            <Button 
              size="lg" 
              variant={mode === 'bottle' ? 'secondary' : 'outline'}
              onClick={() => setMode('bottle')}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
            >
              <FileBarChart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Bottle
            </Button>
          </div>
          
          <div className="text-base sm:text-lg">
            Currently managing: <span className="font-bold">{mode === 'cylinder' ? 'Cylinders' : 'Bottles'}</span>
          </div>
        </div>
      </div>

      {/* Mobile-Responsive Features Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Complete {mode === 'cylinder' ? 'Gas Cylinder' : 'Bottle'} Distribution Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                {mode === 'cylinder' ? <Cylinder className="h-6 w-6 sm:h-8 sm:w-8 text-primary" /> : <FileBarChart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{mode === 'cylinder' ? 'Cylinder' : 'Bottle'} Management</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Track inventory, manage different {mode === 'cylinder' ? 'cylinder sizes' : 'bottle types'} and their rates with ease.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Customer Database</h3>
              <p className="text-gray-600 text-sm sm:text-base">Maintain complete customer records and access them instantly while creating invoices.</p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <FileBarChart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Business Analytics</h3>
              <p className="text-gray-600 text-sm sm:text-base">Get valuable insights with comprehensive dashboards and reports on your sales data.</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-4 sm:mt-8">
            <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 text-sm sm:text-base">
              <span className="mr-2">Explore all features</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile-Responsive Quick Actions Section */}
      <main className="flex-grow p-4 sm:p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto mt-4 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Quick Actions - {mode === 'cylinder' ? 'Cylinders' : 'Bottles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
                  <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
                  Create New Invoice
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Create a new tax invoice for {mode === 'cylinder' ? 'cylinders' : 'bottles'} with automatic tax calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 text-sm sm:text-base">
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
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
                  <History className="h-5 w-5 sm:h-6 sm:w-6" />
                  Invoice History
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  View, edit and manage your previously created {mode === 'cylinder' ? 'cylinder' : 'bottle'} invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 text-sm sm:text-base">
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

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
                  Update Details
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Manage buyers, {mode === 'cylinder' ? 'cylinders' : 'bottles'}, and tax configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 text-sm sm:text-base">
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

      {/* Mobile-Responsive Footer */}
      <footer className="bg-primary text-primary-foreground p-4 sm:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="text-center md:text-right">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="flex items-center justify-center md:justify-end">
                <span className="mr-2">📞</span> 8072991484
              </p>
              <p className="flex items-center justify-center md:justify-end">
                <span className="mr-2">📧</span> 
                <span className="break-all">sathishp@gmail.com</span>
              </p>
              <p className="flex items-center justify-center md:justify-end">
                <span className="mr-2">📍</span> 
                <span className="text-center md:text-right">3/168B Irrukur, Paramathi Velur, Namakkal - 637204</span>
              </p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Company</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p>Agnee Gas Distributor</p>
              <p>CEO: Mr. Sathish P</p>
              <p className="break-all">GSTIN/UIN: 33HVVPS5257L1ZH</p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Agnee Gas Distributor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
