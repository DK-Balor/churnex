import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SideNav from '@/components/dashboard/SideNav';
import DashboardContent from '@/components/dashboard/DashboardContent';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import AccountStatus from '@/components/dashboard/AccountStatus';
import AIInsightsSection, { AIInsight, ImpactLevel, InsightType } from '@/components/dashboard/AIInsightsSection';
import type { AccountType } from '@/types/account';

export default function Dashboard() {
  const mockAccountStatus = {
    account_type: 'trial' as AccountType,
    subscription_tier: 'basic',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  };

  const mockInsights: AIInsight[] = [
    {
      type: 'pattern' as InsightType,
      title: 'Customer Churn Risk',
      description: 'Several customers showing signs of potential churn',
      impact: 'High' as ImpactLevel,
      recommendation: 'Immediate customer success intervention needed',
      confidence: 85,
      affectedCustomers: 5,
    },
    {
      type: 'prediction' as InsightType,
      title: 'Usage Pattern Change',
      description: 'Significant changes in product usage patterns detected',
      impact: 'Medium' as ImpactLevel,
      recommendation: 'Review usage patterns and reach out to affected customers',
      confidence: 75,
      affectedCustomers: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-8">
          <WelcomeSection accountStatus={mockAccountStatus} />
          <AccountStatus 
            accountType={mockAccountStatus.account_type}
            createdAt={new Date().toISOString()}
            expiryDate={mockAccountStatus.expires_at}
          />
          <AIInsightsSection 
            insights={mockInsights}
            onRefresh={() => console.log('Refreshing insights...')}
            isScanning={false}
          />
          <DashboardContent />
        </main>
      </div>
    </div>
  );
} 