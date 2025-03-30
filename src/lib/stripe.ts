import { supabase } from './supabase';
import type { Customer } from '@/types/dashboard';

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  subscription: {
    id: string;
    status: string;
    plan: string;
    currentPeriodEnd: string;
  };
  metadata: Record<string, any>;
}

class StripeService {
  private static instance: StripeService;

  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async getCustomerData(): Promise<StripeCustomer | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_stripe_customer', {
          user_id: user.id
        });

      if (error) {
        console.error('Error fetching Stripe customer:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching Stripe customer data:', error);
      return null;
    }
  }

  async getSubscriptionPlans(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_stripe_plans');

      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }

  async updateSubscription(planId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .rpc('update_stripe_subscription', {
          user_id: user.id,
          plan_id: planId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .rpc('cancel_stripe_subscription', {
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

export const stripe = StripeService.getInstance(); 