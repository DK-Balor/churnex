import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AccountType } from '@/types/account';

interface AccountStatusProps {
  accountType: AccountType;
  createdAt: string;
  expiryDate?: string;
}

const getProgressValue = (expiryDate?: string) => {
  if (!expiryDate) return 100;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const total = expiry.getTime() - now.getTime();
  const remaining = Math.max(0, total);
  return Math.round((remaining / total) * 100);
};

export default function AccountStatus({ accountType, expiryDate }: AccountStatusProps) {
  const progress = getProgressValue(expiryDate);
  const daysRemaining = expiryDate
    ? Math.max(0, Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
              <p className="text-sm text-gray-500">
                {accountType === 'trial' ? 'Trial Account' : 'Paid Account'}
              </p>
            </div>
            {daysRemaining !== null && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{daysRemaining} days remaining</p>
                <p className="text-xs text-gray-500">Until expiration</p>
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
} 