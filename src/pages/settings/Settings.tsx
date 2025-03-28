import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import OrganizationSettings from '@/components/settings/OrganizationSettings';
import SettingsLayout from '@/components/settings/SettingsLayout';

interface Organization {
  name: string;
  website: string;
  phone: string;
  address: string;
  teamSize: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'inactive';
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<string>('profile');

  const mockOrganization: Organization = {
    name: 'Acme Inc.',
    website: 'https://acme.com',
    phone: '+1 (555) 000-0000',
    address: '123 Main St, San Francisco, CA 94105',
    teamSize: 25,
  };

  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@acme.com',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@acme.com',
      role: 'member',
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SettingsLayout>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
          <TabsContent value="organization">
            <OrganizationSettings
              organization={mockOrganization}
              teamMembers={mockTeamMembers}
              onUpdateOrg={(data: Organization) => console.log('Updating org:', data)}
              onInviteMember={(email: string) => console.log('Inviting member:', email)}
              onUpdateMember={(id: string, data: Partial<TeamMember>) => console.log('Updating member:', id, data)}
              onRemoveMember={(id: string) => console.log('Removing member:', id)}
            />
          </TabsContent>
        </Tabs>
      </SettingsLayout>
    </div>
  );
} 