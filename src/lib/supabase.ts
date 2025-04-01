import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

declare global {
  interface ImportMetaEnv extends ImportMetaEnvAugmentation {}
}

interface ImportMetaEnvAugmentation {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Environment Variables:', {
  supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
  supabaseAnonKey: supabaseAnonKey ? 'Present' : 'Missing',
  allEnv: import.meta.env
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  if (error?.code === 'PGRST116') {
    return { notFound: true };
  }
  throw error;
};

// Helper function to track analytics events
export const trackEvent = async (
  eventType: string,
  properties: Record<string, any> = {}
) => {
  const session = await supabase.auth.getSession();
  if (!session.data.session?.user) return;

  await supabase.from('analytics_events').insert({
    user_id: session.data.session.user.id,
    event_type: eventType,
    properties,
    session_id: crypto.randomUUID(),
  });
};

// Helper function to get user's customers
export const getUserCustomers = async () => {
  const session = await supabase.auth.getSession();
  if (!session.data.session?.user) return [];

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', session.data.session.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Helper function to get customer activities
export const getCustomerActivities = async (customerId: string) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('customer_id', customerId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
};

// Helper function to get customer churn predictions
export const getCustomerPredictions = async (customerId: string) => {
  const { data, error } = await supabase
    .from('churn_predictions')
    .select('*')
    .eq('customer_id', customerId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
}; 