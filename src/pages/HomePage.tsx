
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, History, Plus, Settings, BarChart, FileText, Home } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const HomePage: React.FC = () => {
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
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/create-invoice">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Invoice
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/invoice-history">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <History className="mr-2 h-4 w-4" />
                    View Invoices
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-accent hover:text-accent-foreground"}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-primary text-primary-foreground py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Agnee Gas Distributor Billing Software</h1>
          <p className="text-xl mb-8">Create invoices, manage customers, and grow your business easily and professionally.</p>
          <Button size="lg" className="px-8 py-6 text-lg">
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section - Original Card Layout only (removed the three feature cards) */}
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Update Details
                </CardTitle>
                <CardDescription>
                  Manage buyers, cylinders, and tax configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Add or edit buyers, manage cylinder sizes and their prices, and configure tax rates for different product types.
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
