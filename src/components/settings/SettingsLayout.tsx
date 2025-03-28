import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  UserCircle,
  CreditCard,
  Building2,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Key,
} from 'lucide-react';

interface SettingsLayoutProps {
  activeTab: 'profile' | 'billing' | 'organization' | 'notifications' | 'security';
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const tabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircle,
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: Building2,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
  },
];

const SettingsLayout = ({ activeTab, onTabChange, children }: SettingsLayoutProps) => {
  return (
    <div className="max-w-[1800px] mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  activeTab === tab.id ? 'bg-brand-green text-white' : ''
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout; 