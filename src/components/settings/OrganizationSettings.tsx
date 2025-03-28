import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Users, Mail, MapPin, Plus, MoreVertical, Trash2 } from 'lucide-react';

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

interface OrganizationSettingsProps {
  organization: Organization;
  teamMembers: TeamMember[];
  onUpdateOrg: (data: Organization) => void;
  onInviteMember: (email: string) => void;
  onUpdateMember: (id: string, data: Partial<TeamMember>) => void;
  onRemoveMember: (id: string) => void;
}

export default function OrganizationSettings({
  organization,
  teamMembers,
  onUpdateOrg,
  onInviteMember,
  onUpdateMember,
  onRemoveMember,
}: OrganizationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>
            Manage your organization details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="org-name"
                  className="pl-9"
                  defaultValue={organization.name}
                  onChange={(e) => onUpdateOrg({ ...organization, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  className="pl-9"
                  defaultValue={organization.website}
                  onChange={(e) => onUpdateOrg({ ...organization, website: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  className="pl-9"
                  defaultValue={organization.phone}
                  onChange={(e) => onUpdateOrg({ ...organization, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  className="pl-9"
                  defaultValue={organization.address}
                  onChange={(e) => onUpdateOrg({ ...organization, address: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Add Team Member</h3>
                <p className="text-sm text-muted-foreground">
                  Invite new members to join your team
                </p>
              </div>
              <Button onClick={() => onInviteMember('')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.email} • {member.role}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUpdateMember(member.id, { role: member.role === 'admin' ? 'member' : 'admin' })}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
} 