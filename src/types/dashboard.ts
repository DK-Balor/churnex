export type TimeRange = '7d' | '30d' | '60d' | '90d' | '1y';

export type InsightType = 'pattern' | 'prediction' | 'opportunity';
export type ImpactLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AIInsight {
  type: InsightType;
  title: string;
  description: string;
  impact: ImpactLevel;
  recommendation: string;
  confidence: number;
  affectedCustomers: number;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  activityType: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface DashboardMetrics {
  revenue: {
    total: number;
    growth: number;
    previousPeriod: number;
    atRisk: number;
  };
  customers: {
    total: number;
    active: number;
    atRisk: number;
    churned: number;
    recovered: number;
  };
  churnRate: number;
  revenueAtRisk: number;
  healthScore: number;
  engagementScore: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
  color: string;
  customers: number;
  revenue: number;
  churnRate: number;
}

export interface Customer {
  id: string;
  name: string;
  risk: number;
  reason: string;
  status: 'Urgent' | 'High' | 'Medium' | 'Low';
  mrr: number;
  lastContact: string;
  nextAction: string;
  trend: 'up' | 'down' | 'stable';
  healthScore: number;
  engagementScore: number;
  segment: string;
  subscription: {
    status: string;
    plan: string;
    startDate: string;
    renewalDate: string;
  };
  activity: {
    lastLogin: string;
    featureUsage: Record<string, number>;
    supportTickets: number;
  };
} 