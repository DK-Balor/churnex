import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { differenceInDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AccountType = 'demo' | 'trial' | 'paid';
type PlanType = 'starter' | 'pro' | 'enterprise';

interface AccountStatusProps {
  accountType: AccountType;
  subscriptionTier?: PlanType | null;
  createdAt: string;
  expiryDate?: string;
}

const getAccountTypeLabel = (type: AccountType, tier?: PlanType | null) => {
  if (type === 'paid' && tier) {
    return `${tier} Plan`;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getDaysRemaining = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.max(0, differenceInDays(expiry, today));
};

const getProgressValue = (accountType: AccountType, createdAt: string, expiryDate?: string) => {
  if (accountType === 'paid') return 100;
  if (!expiryDate) return 0;
  
  const totalDays = accountType === 'demo' ? 7 : 14; // Demo: 7 days, Trial: 14 days
  const daysRemaining = getDaysRemaining(expiryDate);
  const daysUsed = totalDays - daysRemaining;
  return Math.min(100, (daysUsed / totalDays) * 100);
};

const getBadgeVariant = (accountType: AccountType) => {
  switch (accountType) {
    case 'demo':
      return 'warning';
    case 'trial':
      return 'info';
    case 'paid':
      return 'success';
    default:
      return 'default';
  }
};

export default function AccountStatus({ accountType, subscriptionTier, createdAt, expiryDate }: AccountStatusProps) {
  const daysRemaining = expiryDate ? getDaysRemaining(expiryDate) : 0;
  const progress = getProgressValue(accountType, createdAt, expiryDate);
  const badgeVariant = getBadgeVariant(accountType);

  const getExpiryMessage = () => {
    if (!expiryDate) return null;

    const expiryDateObj = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return (
        <div className="flex items-center text-red-600 mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Your account has expired</span>
        </div>
      );
    }

    if (daysUntilExpiry <= 7) {
      return (
        <div className="flex items-center text-orange-600 mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {daysUntilExpiry} days remaining
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-brand-dark-600 mt-2">
        <Clock className="h-4 w-4 mr-1" />
        <span className="text-sm">
          {daysUntilExpiry} days remaining
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={badgeVariant} className="capitalize">
                    {getAccountTypeLabel(accountType, subscriptionTier)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account created on {new Date(createdAt).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {accountType !== 'paid' && expiryDate && (
              <div className="flex items-center gap-2">
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-xs text-gray-500">
                  {daysRemaining} days remaining
                </span>
              </div>
            )}
          </div>
          
          {subscriptionTier && (
            <div className="text-sm text-brand-dark-600">
              <span className="font-medium">Plan:</span> {subscriptionTier}
            </div>
          )}

          {getExpiryMessage()}
        </div>
      </CardContent>
    </Card>
  );
} 