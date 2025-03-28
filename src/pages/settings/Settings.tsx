import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import OrganizationSettings from '@/components/settings/OrganizationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail, MessageSquare, Lock, Key } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'billing' | 'organization' | 'notifications' | 'security'>('profile');

  // Mock data
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    company: 'Acme Inc',
    avatar: '',
  };

  const mockSubscription = {
    plan: 'Professional',
    status: 'active' as const,
    currentPeriodEnd: 'Feb 1, 2024',
    amount: 49,
  };

  const mockOrganization = {
    name: 'Acme Inc',
    website: 'https://acme.com',
    phone: '+1 234 567 890',
    address: '123 Main St, City, Country',
    teamSize: 10,
  };

  const mockTeamMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@acme.com',
      role: 'admin' as const,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@acme.com',
      role: 'member' as const,
      status: 'active' as const,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            user={mockUser}
            onSave={(data) => console.log('Saving profile:', data)}
          />
        );

      case 'billing':
        return (
          <BillingSettings
            subscription={mockSubscription}
            onConnectStripe={() => console.log('Connecting Stripe...')}
            onChangePlan={() => console.log('Changing plan...')}
            onUpdatePayment={() => console.log('Updating payment...')}
          />
        );

      case 'organization':
        return (
          <OrganizationSettings
            organization={mockOrganization}
            teamMembers={mockTeamMembers}
            onUpdateOrg={(data) => console.log('Updating org:', data)}
            onInviteMember={() => console.log('Inviting member...')}
            onUpdateMember={(id, data) => console.log('Updating member:', id, data)}
            onRemoveMember={(id) => console.log('Removing member:', id)}
          />
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Customer Activity',
                        description: 'Get notified when customers take important actions',
                        icon: Mail,
                      },
                      {
                        title: 'Churn Risk Alerts',
                        description: 'Receive alerts when customers show signs of churning',
                        icon: Bell,
                      },
                      {
                        title: 'Team Messages',
                        description: 'Get notified about team communication',
                        icon: MessageSquare,
                      },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <Label htmlFor={`notification-${index}`}>{item.title}</Label>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                          </div>
                          <Switch id={`notification-${index}`} defaultChecked />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Desktop Notifications',
                        description: 'Show notifications on your desktop',
                      },
                      {
                        title: 'Mobile Notifications',
                        description: 'Send notifications to your mobile device',
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`push-${index}`}>{item.title}</Label>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Switch id={`push-${index}`} defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password */}
                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="current-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="new-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3 className="font-medium">Active Sessions</h3>
                  <div className="space-y-2">
                    {[
                      {
                        device: 'MacBook Pro',
                        location: 'San Francisco, CA',
                        lastActive: '2 minutes ago',
                      },
                      {
                        device: 'iPhone 12',
                        location: 'San Francisco, CA',
                        lastActive: '1 hour ago',
                      },
                    ].map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{session.device}</div>
                          <div className="text-sm text-gray-500">
                            {session.location} • {session.lastActive}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          End Session
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SettingsLayout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)}>
      {renderContent()}
    </SettingsLayout>
  );
};

export default Settings; 