import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Settings,
  CreditCard,
  Users,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-muted/40 p-4">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          <div className="pt-4">
            <Button variant="ghost" className="w-full justify-start text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
} 