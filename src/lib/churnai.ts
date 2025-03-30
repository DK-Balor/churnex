import { supabase } from './supabase';
import type { Customer, AIInsight } from '@/types/dashboard';

class ChurnAIService {
  private static instance: ChurnAIService;

  private constructor() {}

  static getInstance(): ChurnAIService {
    if (!ChurnAIService.instance) {
      ChurnAIService.instance = new ChurnAIService();
    }
    return ChurnAIService.instance;
  }

  async analyzeCustomer(customerId: string): Promise<{
    risk: number;
    insights: AIInsight[];
    recommendations: string[];
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('https://aqepnfjkrzczlxdsoagq.supabase.co/functions/v1/churnai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          userId: user.id,
          customerId 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error analyzing customer:', error);
      throw error;
    }
  }

  async getCustomerInsights(customerId: string): Promise<AIInsight[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('https://aqepnfjkrzczlxdsoagq.supabase.co/functions/v1/churnai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          userId: user.id,
          customerId 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data.insights;
    } catch (error) {
      console.error('Error getting customer insights:', error);
      throw error;
    }
  }

  async generateInterventionPlan(customerId: string): Promise<{
    plan: string;
    steps: string[];
    timeline: string[];
    expectedOutcome: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('https://aqepnfjkrzczlxdsoagq.supabase.co/functions/v1/churnai-intervention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          userId: user.id,
          customerId 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error generating intervention plan:', error);
      throw error;
    }
  }

  async predictChurnRisk(customerId: string): Promise<{
    risk: number;
    confidence: number;
    factors: string[];
    trend: 'increasing' | 'stable' | 'decreasing';
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('https://aqepnfjkrzczlxdsoagq.supabase.co/functions/v1/churnai-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          userId: user.id,
          customerId 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error predicting churn risk:', error);
      throw error;
    }
  }

  async trackInterventionSuccess(customerId: string, interventionId: string): Promise<{
    success: boolean;
    metrics: {
      engagement: number;
      satisfaction: number;
      retention: number;
    };
    recommendations: string[];
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('https://aqepnfjkrzczlxdsoagq.supabase.co/functions/v1/churnai-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          userId: user.id,
          customerId,
          interventionId 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error tracking intervention success:', error);
      throw error;
    }
  }
}

export const churnai = ChurnAIService.getInstance(); 