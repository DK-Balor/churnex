import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface BillingSettingsProps {
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'past_due';
    currentPeriodEnd: string;
    amount: number;
  };
  onConnectStripe: () => void;
  onChangePlan: () => void;
  onUpdatePayment: () => void;
}

const BillingSettings = ({
  subscription,
  onConnectStripe,
  onChangePlan,
  onUpdatePayment,
}: BillingSettingsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing & Subscription</CardTitle>
          <CardDescription>Manage your subscription and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-sm text-gray-500">{subscription.plan}</p>
              </div>
              <Badge
                variant={
                  subscription.status === 'active'
                    ? 'default'
                    : subscription.status === 'past_due'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {subscription.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Renews {subscription.currentPeriodEnd}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>${subscription.amount}/month</span>
              </div>
            </div>
            <Button onClick={onChangePlan} variant="outline" className="w-full">
              Change Plan
            </Button>
          </div>

          {/* Payment Method */}
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-sm text-gray-500">Manage your payment information</p>
              </div>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={onUpdatePayment} variant="outline" className="w-full">
              Update Payment Method
            </Button>
          </div>

          {/* Stripe Connection */}
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Stripe Integration</h3>
                <p className="text-sm text-gray-500">Connect your Stripe account for payments</p>
              </div>
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={onConnectStripe} variant="outline" className="w-full">
              Connect Stripe Account
            </Button>
          </div>

          {/* Billing History */}
          <div>
            <h3 className="font-medium mb-4">Billing History</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg text-sm"
                >
                  <div>
                    <div className="font-medium">Invoice #1234{index}</div>
                    <div className="text-gray-500">Jan {index + 1}, 2024</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>${subscription.amount}</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings; 