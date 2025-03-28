import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreditCard } from 'lucide-react';

export default function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-sm text-muted-foreground">Pro Plan - $49/month</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Billing Cycle</h3>
                <p className="text-sm text-muted-foreground">Monthly</p>
              </div>
              <Button variant="outline">Update Billing</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Method</h3>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">•••• 4242</p>
                </div>
              </div>
              <Button variant="outline">Update Payment</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">March 2024</h3>
                <p className="text-sm text-muted-foreground">Invoice #INV-2024-001</p>
              </div>
              <Button variant="outline">Download</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">February 2024</h3>
                <p className="text-sm text-muted-foreground">Invoice #INV-2024-002</p>
              </div>
              <Button variant="outline">Download</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your billing notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Billing Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications about your billing</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Reminders</h3>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming payments</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 