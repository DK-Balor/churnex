import { useState } from 'react';
import { Brain, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AccountType } from '@/types/account';

interface WelcomeSectionProps {
  accountStatus: {
    account_type: AccountType;
    subscription_tier?: string;
    expires_at?: string;
  };
}

const quotes = [
  "Discover insights that drive customer retention",
  "Turn data into actionable retention strategies",
  "Predict and prevent customer churn before it happens",
  "Make data-driven decisions for your business",
  "Stay ahead with AI-powered customer analytics"
];

export default function WelcomeSection({ accountStatus }: WelcomeSectionProps) {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const isTrialAccount = accountStatus.account_type === 'trial';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome to ChurnEx
            </h2>
            <p className="text-gray-500">{quote}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Brain className="h-4 w-4 text-brand-600" />
              <span>AI Analysis {isTrialAccount ? 'Active' : 'Ready'}</span>
            </div>
            {isTrialAccount && accountStatus.expires_at && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-brand-600" />
                <span>Trial Active</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 