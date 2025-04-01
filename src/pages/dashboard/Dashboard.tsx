import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import SideNav from '@/components/dashboard/SideNav';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  LineChart, 
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell
} from 'recharts';
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingDown, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Bell,
  Sparkles,
  Bot,
  Download,
  Zap
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHome from './DashboardHome';
import SettingsPage from './SettingsPage';

// Mock data (you would replace this with real data from your API)
const revenueData = [
  { month: 'Jan', actual: 12400, predicted: 12000 },
  { month: 'Feb', actual: 13100, predicted: 12800 },
  { month: 'Mar', actual: 12800, predicted: 13500 },
  { month: 'Apr', actual: 13600, predicted: 14000 },
  { month: 'May', actual: 14500, predicted: 14800 },
  { month: 'Jun', actual: 15200, predicted: 15500 },
];

const customerActivityData = [
  { day: 'Mon', active: 850, churned: 12 },
  { day: 'Tue', active: 860, churned: 8 },
  { day: 'Wed', active: 865, churned: 15 },
  { day: 'Thu', active: 880, churned: 10 },
  { day: 'Fri', active: 890, churned: 7 },
  { day: 'Sat', active: 888, churned: 13 },
  { day: 'Sun', active: 900, churned: 9 },
];

const atRiskCustomers = [
  {
    name: 'Acme Corp',
    risk: 87,
    reason: 'Decreased usage, Support tickets increased',
    status: 'Urgent'
  },
  {
    name: 'TechStart Inc',
    risk: 75,
    reason: 'Payment delays, Feature engagement dropped',
    status: 'High'
  },
  {
    name: 'Global Solutions',
    risk: 65,
    reason: 'Reduced team size, Lower activity',
    status: 'Medium'
  }
];

const Overview = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark-900">Overview</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            className="bg-brand-green text-white hover:bg-brand-green-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Take Action
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Monthly Revenue', 
            value: '$15,200', 
            change: '+12.5%',
            icon: DollarSign,
            trend: 'up'
          },
          { 
            title: 'Active Users', 
            value: '900', 
            change: '+8.2%',
            icon: Users,
            trend: 'up'
          },
          { 
            title: 'Churn Rate', 
            value: '2.4%', 
            change: '-1.1%',
            icon: TrendingDown,
            trend: 'down'
          },
          { 
            title: 'At Risk Customers', 
            value: '23', 
            change: '+5',
            icon: AlertCircle,
            trend: 'up',
            alert: true
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${stat.alert ? 'bg-red-50 text-red-600' : 'bg-brand-green/10 text-brand-green'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-brand-dark-600 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-brand-dark-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.trend === 'up' 
                            ? stat.alert ? 'text-red-600' : 'text-brand-green'
                            : 'text-brand-green'
                        }`}>
                          {stat.change}
                          {stat.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Prediction Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Prediction</CardTitle>
            <CardDescription>Actual vs AI-Predicted Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Actual Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    name="AI Prediction"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
            <CardDescription>Daily active users vs churned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.2}
                    name="Active Users"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="churned" 
                    stackId="2" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.2}
                    name="Churned Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 text-red-500 mr-2" />
            High-Risk Customers
          </CardTitle>
          <CardDescription>Immediate attention required</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atRiskCustomers.map((customer, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-brand-green cursor-pointer transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-brand-dark-900">{customer.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'Urgent' 
                          ? 'bg-red-100 text-red-700'
                          : customer.status === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-brand-dark-600">{customer.reason}</p>
                      <div className="flex items-center">
                        <span className="text-red-600 font-medium">{customer.risk}%</span>
                        <span className="text-xs text-brand-dark-500 ml-1">risk</span>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Risk Analysis: {customer.name}</DialogTitle>
                    <DialogDescription>
                      Detailed risk assessment and recommended actions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-brand-dark-900 mb-2">Risk Factors</h4>
                      <ul className="list-disc pl-5 space-y-2 text-brand-dark-600">
                        <li>Decreased product usage in last 30 days</li>
                        <li>Support ticket frequency increased by 45%</li>
                        <li>Key feature adoption rate dropped</li>
                        <li>Payment delays in last billing cycle</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-dark-900 mb-2">Recommended Actions</h4>
                      <ul className="list-disc pl-5 space-y-2 text-brand-dark-600">
                        <li>Schedule immediate customer success meeting</li>
                        <li>Offer personalized feature training session</li>
                        <li>Review and adjust payment terms</li>
                        <li>Implement custom success plan</li>
                      </ul>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full bg-brand-green text-white hover:bg-brand-green-600">
                        Schedule Intervention
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
} 