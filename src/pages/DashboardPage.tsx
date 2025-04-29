
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, 
  FileText, 
  User, 
  BarChart3, 
  PieChart, 
  DollarSign,
  Search
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useInvoice } from '@/context/InvoiceContext';
import { useBuyers } from '@/context/BuyerContext';
import { useCylinders } from '@/context/CylinderContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

const DashboardPage: React.FC = () => {
  const { invoices } = useInvoice();
  const { buyers } = useBuyers();
  const { cylinders } = useCylinders();
  
  // Get most recent invoices (up to 4)
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())
    .slice(0, 4);
  
  // Generate daily revenue data for the last 7 days
  const generateDailyRevenue = () => {
    const today = new Date();
    const dailyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayInvoices = invoices.filter(inv => inv.invoiceDate === dateString);
      const dayRevenue = dayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      
      dailyData.push({
        date: dateString,
        revenue: dayRevenue,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
      });
    }
    
    return dailyData;
  };
  
  // Calculate revenue per cylinder type
  const calculateCylinderRevenue = () => {
    // Create a map to store revenue for each cylinder type
    const cylinderRevenue = new Map<string, number>();
    
    // Initialize with all cylinder types from our cylinders context
    cylinders.forEach(cylinder => {
      cylinderRevenue.set(cylinder.name, 0);
    });
    
    // Process all invoices and their items
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        if (cylinderRevenue.has(item.description)) {
          cylinderRevenue.set(
            item.description, 
            (cylinderRevenue.get(item.description) || 0) + item.amount
          );
        } else {
          // Handle items that might not match a cylinder name exactly
          cylinderRevenue.set(item.description, (cylinderRevenue.get(item.description) || 0) + item.amount);
        }
      });
    });
    
    // Convert to array format for the pie chart
    return Array.from(cylinderRevenue.entries())
      .filter(([_, value]) => value > 0) // Only include non-zero values
      .map(([name, value]) => ({
        name,
        value
      }));
  };
  
  // Calculate revenue per buyer
  const buyerRevenue = buyers.map(buyer => {
    const buyerInvoices = invoices.filter(inv => inv.buyerName === buyer.name);
    const totalRevenue = buyerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const invoiceCount = buyerInvoices.length;
    
    return {
      name: buyer.name,
      revenue: totalRevenue,
      invoices: invoiceCount
    };
  }).filter(buyer => buyer.invoices > 0);
  
  // Revenue chart data
  const revenueData = generateDailyRevenue();
  
  // Cylinder revenue data
  const cylinderRevenueData = calculateCylinderRevenue();
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="p-2">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>Latest invoice transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentInvoices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNo}</TableCell>
                          <TableCell>{invoice.invoiceDate}</TableCell>
                          <TableCell>{invoice.buyerName}</TableCell>
                          <TableCell className="text-right">₹{invoice.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-gray-500">No invoices created yet</div>
                )}
              </CardContent>
              <CardFooter>
                <Link to="/invoice-history" className="w-full">
                  <Button variant="outline" className="w-full">View All Invoices</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Buyer Profiles */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Buyer Profiles
                </CardTitle>
                <CardDescription>Top customers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {buyerRevenue.length > 0 ? (
                  <div className="space-y-4">
                    {buyerRevenue
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 4)
                      .map((buyer) => (
                        <div key={buyer.name} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{buyer.name}</p>
                            <p className="text-sm text-gray-500">{buyer.invoices} invoices</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{buyer.revenue.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">No buyer data available</div>
                )}
              </CardContent>
              <CardFooter>
                <Link to="/update" className="w-full">
                  <Button variant="outline" className="w-full">Manage Buyers</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Revenue Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>Daily revenue trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Cylinder Type */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue by Cylinder Type
                </CardTitle>
                <CardDescription>Distribution by product</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={cylinderRevenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {cylinderRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Custom Report Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Custom Reports
              </CardTitle>
              <CardDescription>Filter invoices by date, customer, or status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All customers</option>
                    {buyers.map(buyer => (
                      <option key={buyer.gstin}>{buyer.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All statuses</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <Button className="w-full">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 border-t p-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} Agnee Gas Distributor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
