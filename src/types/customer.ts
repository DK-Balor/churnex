export interface Customer {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  industry?: string;
  company_size?: string;
  region?: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
}

export interface ChurnPrediction {
  customerId: string;
  riskScore: number;
  probability: number;
  factors: {
    payment: number;
    engagement: number;
    subscription: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

export interface CustomerActivity {
  id: string;
  customer_id: string;
  feature_name: string;
  timestamp: string;
  duration?: number;
  success?: boolean;
  metadata?: Record<string, any>;
}

export interface SupportTicket {
  id: string;
  customer_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  assigned_to?: string;
}

export interface StripePayment {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'late';
  due_date: string;
  paid_date?: string;
  invoice_id: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  customer_count: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerHealthScore {
  customer_id: string;
  score: number;
  factors: {
    engagement: number;
    satisfaction: number;
    usage: number;
    support: number;
  };
  last_updated: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface CustomerJourney {
  customer_id: string;
  stage: 'awareness' | 'consideration' | 'decision' | 'onboarding' | 'activation' | 'retention';
  current_step: string;
  completed_steps: string[];
  next_steps: string[];
  last_updated: string;
  metadata?: Record<string, any>;
}

export interface CustomerFeedback {
  id: string;
  customer_id: string;
  type: 'survey' | 'interview' | 'support' | 'product';
  rating?: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface CustomerSuccessPlan {
  id: string;
  customer_id: string;
  goals: string[];
  milestones: {
    id: string;
    title: string;
    description: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  created_at: string;
  updated_at: string;
  assigned_to?: string;
} 