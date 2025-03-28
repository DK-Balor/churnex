import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DashboardContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Customer Overview</CardTitle>
          <CardDescription>Key metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Customers</span>
              <span className="text-2xl font-bold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Customers</span>
              <span className="text-2xl font-bold">1,100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Churn Rate</span>
              <span className="text-2xl font-bold">2.5%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Revenue</span>
              <span className="text-2xl font-bold">$45,678</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Growth Rate</span>
              <span className="text-2xl font-bold text-green-600">+12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">MRR</span>
              <span className="text-2xl font-bold">$42,890</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <ArrowRight className="mr-2 h-4 w-4" />
              View Customer Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ArrowRight className="mr-2 h-4 w-4" />
              Export Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ArrowRight className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 