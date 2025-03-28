import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  customerId: string;
}

interface PredictionResult {
  risk: number;
  confidence: number;
  factors: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, customerId } = await req.json() as RequestBody;

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get customer data
    const { data: customer, error: customerError } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (customerError) throw customerError;

    // Get historical activities
    const { data: activities, error: activitiesError } = await supabaseClient
      .from('customer_activities')
      .select('*')
      .eq('customer_id', customerId)
      .order('timestamp', { ascending: true });

    if (activitiesError) throw activitiesError;

    // Get subscription history
    const { data: subscriptions, error: subscriptionsError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: true });

    if (subscriptionsError) throw subscriptionsError;

    // Calculate prediction
    const prediction = calculatePrediction(customer, activities, subscriptions);

    return new Response(
      JSON.stringify(prediction),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function calculatePrediction(
  customer: any,
  activities: any[],
  subscriptions: any[]
): PredictionResult {
  const factors: string[] = [];
  let risk = 0;
  let confidence = 0;

  // Calculate engagement trend
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  );
  const activityTrend = calculateActivityTrend(activities);
  if (activityTrend === 'decreasing') {
    risk += 30;
    factors.push('Decreasing engagement over time');
  }

  // Check subscription stability
  const subscriptionStability = checkSubscriptionStability(subscriptions);
  if (!subscriptionStability.stable) {
    risk += 25;
    factors.push(subscriptionStability.factor);
  }

  // Analyze support interactions
  const supportAnalysis = analyzeSupportInteractions(activities);
  if (supportAnalysis.risk) {
    risk += supportAnalysis.risk;
    factors.push(supportAnalysis.factor);
  }

  // Check feature usage
  const usageAnalysis = analyzeFeatureUsage(activities);
  if (usageAnalysis.risk) {
    risk += usageAnalysis.risk;
    factors.push(usageAnalysis.factor);
  }

  // Calculate confidence based on data quality
  confidence = calculateConfidence(activities, subscriptions);

  // Determine trend
  const trend = determineTrend(activities, subscriptions);

  return {
    risk: Math.min(100, risk),
    confidence,
    factors,
    trend,
  };
}

function calculateActivityTrend(activities: any[]): 'increasing' | 'stable' | 'decreasing' {
  if (activities.length < 2) return 'stable';

  const recentActivities = activities.slice(-30);
  const olderActivities = activities.slice(-60, -30);

  const recentCount = recentActivities.length;
  const olderCount = olderActivities.length;

  if (recentCount > olderCount * 1.2) return 'increasing';
  if (recentCount < olderCount * 0.8) return 'decreasing';
  return 'stable';
}

function checkSubscriptionStability(subscriptions: any[]): { stable: boolean; factor?: string } {
  if (subscriptions.length === 0) {
    return { stable: false, factor: 'No active subscription' };
  }

  const currentSubscription = subscriptions[subscriptions.length - 1];
  if (currentSubscription.status !== 'active') {
    return { stable: false, factor: `Subscription status: ${currentSubscription.status}` };
  }

  // Check for frequent plan changes
  const planChanges = subscriptions.filter(
    (s, i, arr) => i > 0 && s.plan_id !== arr[i - 1].plan_id
  ).length;

  if (planChanges > 2) {
    return { stable: false, factor: 'Frequent plan changes detected' };
  }

  return { stable: true };
}

function analyzeSupportInteractions(activities: any[]): { risk: number; factor: string } {
  const supportTickets = activities.filter((a) => a.type === 'support_ticket');
  const recentTickets = supportTickets.filter(
    (a) => new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  if (recentTickets.length >= 5) {
    return {
      risk: 25,
      factor: 'High volume of recent support tickets',
    };
  }

  if (supportTickets.length >= 10) {
    return {
      risk: 15,
      factor: 'High total support ticket volume',
    };
  }

  return { risk: 0, factor: '' };
}

function analyzeFeatureUsage(activities: any[]): { risk: number; factor: string } {
  const featureUsage = activities.filter((a) => a.type === 'feature_use');
  const uniqueFeatures = new Set(featureUsage.map((a) => a.feature_id));

  if (uniqueFeatures.size < 3) {
    return {
      risk: 20,
      factor: 'Limited feature adoption',
    };
  }

  return { risk: 0, factor: '' };
}

function calculateConfidence(activities: any[], subscriptions: any[]): number {
  let confidence = 0;

  // Data volume factors
  if (activities.length > 100) confidence += 30;
  else if (activities.length > 50) confidence += 20;
  else if (activities.length > 20) confidence += 10;

  // Time span factors
  if (activities.length > 0) {
    const oldestActivity = new Date(activities[0].timestamp);
    const newestActivity = new Date(activities[activities.length - 1].timestamp);
    const monthsSpan = (newestActivity.getTime() - oldestActivity.getTime()) / (30 * 24 * 60 * 60 * 1000);

    if (monthsSpan > 6) confidence += 30;
    else if (monthsSpan > 3) confidence += 20;
    else if (monthsSpan > 1) confidence += 10;
  }

  // Subscription history factors
  if (subscriptions.length > 0) confidence += 20;

  return Math.min(100, confidence);
}

function determineTrend(
  activities: any[],
  subscriptions: any[]
): 'increasing' | 'stable' | 'decreasing' {
  const activityTrend = calculateActivityTrend(activities);
  const subscriptionTrend = checkSubscriptionStability(subscriptions);

  if (activityTrend === 'decreasing' || !subscriptionTrend.stable) {
    return 'increasing';
  }

  if (activityTrend === 'increasing' && subscriptionTrend.stable) {
    return 'decreasing';
  }

  return 'stable';
} 