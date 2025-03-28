import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import DashboardContent from './DashboardContent';
import WelcomeSection from './WelcomeSection';
import AccountStatus from './AccountStatus';
import AIInsightsSection from './AIInsightsSection';

const mockAccountStatus = {
  account_type: 'trial' as const,
  subscription_tier: 'starter' as const,
  expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockInsights = [
  {
    type: 'pattern' as const,
    title: 'Increased Churn Risk Detected',
    description: 'Several customers showing decreased engagement patterns',
    impact: 'High' as const,
    recommendation: 'Consider proactive outreach to affected customers',
    confidence: 85,
    affectedCustomers: 12
  },
  {
    type: 'prediction' as const,
    title: 'Potential Revenue Impact',
    description: 'Current trends suggest possible revenue decline',
    impact: 'Medium' as const,
    recommendation: 'Review pricing strategy and customer feedback',
    confidence: 75,
    affectedCustomers: 8
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <WelcomeSection accountStatus={mockAccountStatus} />
            <AccountStatus 
              accountType={mockAccountStatus.account_type}
              createdAt={mockAccountStatus.created_at}
              expiryDate={mockAccountStatus.expires_at}
            />
            <AIInsightsSection 
              insights={mockInsights}
              onRefresh={() => {}}
              isScanning={false}
            />
            <DashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
} 