export type TimeRange = '7d' | '30d' | '60d' | '90d' | '1y';

export type InsightType = 'pattern' | 'prediction' | 'opportunity';
export type ImpactLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: 'churn' | 'growth' | 'satisfaction';
  createdAt: string;
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
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'at_risk';
  lastActive: string;
  joinedAt: string;
}

export interface Metrics {
  totalCustomers: number;
  activeCustomers: number;
  churnRate: number;
  monthlyRevenue: number;
  growthRate: number;
} 