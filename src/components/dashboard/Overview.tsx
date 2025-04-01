import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Activity, Zap } from 'lucide-react';

// Mock data (you would replace this with real data from your API)
const stats = [
  {
    title: 'Total Customers',
    value: '2,543',
    change: '+12.5%',
    icon: Users,
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+8.2%',
    icon: DollarSign,
  },
  {
    title: 'Active Users',
    value: '1,234',
    change: '+5.3%',
    icon: Activity,
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '+2.1%',
    icon: Zap,
  },
];

export default function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 