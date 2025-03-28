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

interface InsightResult {
  insights: {
    type: 'pattern' | 'prediction' | 'opportunity';
    title: string;
    description: string;
    impact: 'Critical' | 'High' | 'Medium' | 'Low';
    recommendation: string;
    confidence: number;
    affectedCustomers: string[];
  }[];
  patterns: {
    type: string;
    description: string;
    impact: 'Critical' | 'High' | 'Medium' | 'Low';
    customers: string[];
  }[];
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

    // Get customer activities
    const { data: activities, error: activitiesError } = await supabaseClient
      .from('customer_activities')
      .select('*')
      .eq('customer_id', customerId)
      .order('timestamp', { ascending: true });

    if (activitiesError) throw activitiesError;

    // Get subscription data
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError) throw subscriptionError;

    // Get similar customers
    const { data: similarCustomers, error: similarError } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('plan_id', subscription.plan_id)
      .neq('id', customerId)
      .limit(10);

    if (similarError) throw similarError;

    // Generate insights
    const insights = generateInsights(customer, activities, subscription, similarCustomers);

    return new Response(
      JSON.stringify(insights),
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

function generateInsights(
  customer: any,
  activities: any[],
  subscription: any,
  similarCustomers: any[]
): InsightResult {
  const insights: InsightResult['insights'] = [];
  const patterns: InsightResult['patterns'] = [];

  // Analyze engagement patterns
  const engagementPattern = analyzeEngagementPattern(activities);
  if (engagementPattern) {
    insights.push({
      type: 'pattern',
      title: 'Engagement Pattern Detected',
      description: engagementPattern.description,
      impact: engagementPattern.impact,
      recommendation: engagementPattern.recommendation,
      confidence: engagementPattern.confidence,
      affectedCustomers: [customer.id],
    });
  }

  // Analyze feature usage
  const featureUsage = analyzeFeatureUsage(activities);
  if (featureUsage) {
    insights.push({
      type: 'opportunity',
      title: 'Feature Usage Opportunity',
      description: featureUsage.description,
      impact: featureUsage.impact,
      recommendation: featureUsage.recommendation,
      confidence: featureUsage.confidence,
      affectedCustomers: [customer.id],
    });
  }

  // Analyze subscription health
  const subscriptionHealth = analyzeSubscriptionHealth(subscription, similarCustomers);
  if (subscriptionHealth) {
    insights.push({
      type: 'prediction',
      title: 'Subscription Health Analysis',
      description: subscriptionHealth.description,
      impact: subscriptionHealth.impact,
      recommendation: subscriptionHealth.recommendation,
      confidence: subscriptionHealth.confidence,
      affectedCustomers: [customer.id],
    });
  }

  // Identify common patterns across similar customers
  const commonPatterns = identifyCommonPatterns(similarCustomers);
  patterns.push(...commonPatterns);

  return { insights, patterns };
}

function analyzeEngagementPattern(activities: any[]): {
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendation: string;
  confidence: number;
} | null {
  if (activities.length < 10) return null;

  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const activityFrequency = recentActivities.length / 30;
  const uniqueFeatures = new Set(recentActivities.map((a) => a.feature_id)).size;

  if (activityFrequency < 0.5) {
    return {
      description: 'Low engagement detected in the last 30 days',
      impact: 'High',
      recommendation: 'Schedule a check-in call to understand customer needs and provide guidance',
      confidence: 85,
    };
  }

  if (uniqueFeatures < 3) {
    return {
      description: 'Limited feature adoption detected',
      impact: 'Medium',
      recommendation: 'Provide personalized feature training and highlight key benefits',
      confidence: 75,
    };
  }

  return null;
}

function analyzeFeatureUsage(activities: any[]): {
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendation: string;
  confidence: number;
} | null {
  const featureUsage = activities.filter((a) => a.type === 'feature_use');
  const uniqueFeatures = new Set(featureUsage.map((a) => a.feature_id));

  if (uniqueFeatures.size < 3) {
    return {
      description: 'Customer is not utilizing key features',
      impact: 'Medium',
      recommendation: 'Schedule a feature walkthrough and identify potential use cases',
      confidence: 80,
    };
  }

  return null;
}

function analyzeSubscriptionHealth(
  subscription: any,
  similarCustomers: any[]
): {
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendation: string;
  confidence: number;
} | null {
  const similarActiveSubscriptions = similarCustomers.filter(
    (c) => c.subscription_status === 'active'
  ).length;

  const healthScore = (similarActiveSubscriptions / similarCustomers.length) * 100;

  if (healthScore < 70) {
    return {
      description: 'Low retention rate among similar customers',
      impact: 'Critical',
      recommendation: 'Implement proactive retention strategies and monitor closely',
      confidence: 90,
    };
  }

  return null;
}

function identifyCommonPatterns(similarCustomers: any[]): {
  type: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  customers: string[];
}[] {
  const patterns: {
    type: string;
    description: string;
    impact: 'Critical' | 'High' | 'Medium' | 'Low';
    customers: string[];
  }[] = [];

  // Analyze common support issues
  const supportIssues = analyzeSupportIssues(similarCustomers);
  if (supportIssues) {
    patterns.push(supportIssues);
  }

  // Analyze common feature usage patterns
  const featurePatterns = analyzeFeaturePatterns(similarCustomers);
  if (featurePatterns) {
    patterns.push(featurePatterns);
  }

  return patterns;
}

function analyzeSupportIssues(similarCustomers: any[]): {
  type: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  customers: string[];
} | null {
  const customersWithIssues = similarCustomers.filter(
    (c) => c.support_tickets > 3
  );

  if (customersWithIssues.length >= 3) {
    return {
      type: 'support_issues',
      description: 'Multiple customers experiencing support issues',
      impact: 'High',
      customers: customersWithIssues.map((c) => c.id),
    };
  }

  return null;
}

function analyzeFeaturePatterns(similarCustomers: any[]): {
  type: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  customers: string[];
} | null {
  const customersWithLowUsage = similarCustomers.filter(
    (c) => c.feature_usage < 3
  );

  if (customersWithLowUsage.length >= 5) {
    return {
      type: 'feature_usage',
      description: 'Low feature adoption among similar customers',
      impact: 'Medium',
      customers: customersWithLowUsage.map((c) => c.id),
    };
  }

  return null;
} 