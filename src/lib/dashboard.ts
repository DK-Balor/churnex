import { supabase } from './supabase';
import type { DashboardMetrics, CustomerActivity, Customer, TimeRange } from '@/types/dashboard';

class DashboardService {
  private static instance: DashboardService;
  private subscribers: ((data: any) => void)[] = [];

  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getMetrics(timeRange: TimeRange): Promise<DashboardMetrics> {
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error');
      }
      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      console.log('Fetching metrics for user:', user.id);

      // Use Supabase client instead of direct fetch
      const { data, error } = await supabase
        .rpc('get_dashboard_metrics', {
          user_id: user.id,
          time_range: timeRange
        });

      if (error) {
        console.error('Error fetching metrics:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  async getCustomerActivities(): Promise<CustomerActivity[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('customer_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching customer activities:', error);
      return [];
    }
  }

  async getAtRiskCustomers(): Promise<Customer[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .gte('risk', 60)
        .order('risk', { ascending: false });

      if (error) {
        console.error('Error fetching at-risk customers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching at-risk customers:', error);
      return [];
    }
  }

  async syncAllData(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .rpc('sync_stripe_data', {
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  }

  subscribeToCustomerUpdates(callback: (data: any) => void) {
    this.subscribers.push(callback);

    const subscription = supabase
      .channel('customer_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, callback)
      .subscribe();

    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
      subscription.unsubscribe();
    };
  }
}

export const dashboard = DashboardService.getInstance(); 