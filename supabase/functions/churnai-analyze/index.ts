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
      .order('timestamp', { ascending: false })
      .limit(100);

    if (activitiesError) throw activitiesError;

    // Get subscription data
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (subscriptionError) throw subscriptionError;

    // Calculate risk score based on various factors
    const riskScore = calculateRiskScore(customer, activities, subscription);

    // Generate insights
    const insights = generateInsights(customer, activities, subscription, riskScore);

    // Generate recommendations
    const recommendations = generateRecommendations(insights, riskScore);

    return new Response(
      JSON.stringify({
        risk: riskScore,
        insights,
        recommendations,
      }),
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

function calculateRiskScore(
  customer: any,
  activities: any[],
  subscription: any
): number {
  let score = 0;
  const weights = {
    engagement: 0.3,
    payment: 0.3,
    support: 0.2,
    usage: 0.2,
  };

  // Calculate engagement score
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const engagementScore = recentActivities.length > 0 ? 1 : 0;

  // Calculate payment score
  const paymentScore = subscription?.status === 'active' ? 1 : 0;

  // Calculate support score
  const supportTickets = activities.filter((a) => a.type === 'support_ticket');
  const supportScore = supportTickets.length < 3 ? 1 : 0;

  // Calculate usage score
  const featureUsage = activities.filter((a) => a.type === 'feature_use');
  const usageScore = featureUsage.length > 5 ? 1 : 0;

  // Calculate weighted average
  score =
    engagementScore * weights.engagement +
    paymentScore * weights.payment +
    supportScore * weights.support +
    usageScore * weights.usage;

  return Math.round(score * 100);
}

function generateInsights(
  customer: any,
  activities: any[],
  subscription: any,
  riskScore: number
): any[] {
  const insights = [];

  // Engagement insights
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  if (recentActivities.length === 0) {
    insights.push({
      type: 'pattern',
      title: 'Low Engagement Detected',
      description: 'No activity in the last 30 days',
      impact: 'High',
      recommendation: 'Initiate re-engagement campaign',
      confidence: 90,
      affectedCustomers: 1,
    });
  }

  // Payment insights
  if (subscription?.status !== 'active') {
    insights.push({
      type: 'prediction',
      title: 'Subscription Status Alert',
      description: `Subscription is ${subscription?.status}`,
      impact: 'Critical',
      recommendation: 'Review payment status and contact customer',
      confidence: 95,
      affectedCustomers: 1,
    });
  }

  // Support insights
  const supportTickets = activities.filter((a) => a.type === 'support_ticket');
  if (supportTickets.length >= 3) {
    insights.push({
      type: 'pattern',
      title: 'High Support Volume',
      description: `${supportTickets.length} support tickets in recent period`,
      impact: 'Medium',
      recommendation: 'Review support issues and implement solutions',
      confidence: 85,
      affectedCustomers: 1,
    });
  }

  // Usage insights
  const featureUsage = activities.filter((a) => a.type === 'feature_use');
  if (featureUsage.length <= 5) {
    insights.push({
      type: 'opportunity',
      title: 'Low Feature Adoption',
      description: 'Limited use of key features',
      impact: 'Medium',
      recommendation: 'Schedule feature training session',
      confidence: 80,
      affectedCustomers: 1,
    });
  }

  return insights;
}

function generateRecommendations(insights: any[], riskScore: number): string[] {
  const recommendations = [];

  // High-risk recommendations
  if (riskScore >= 80) {
    recommendations.push('Schedule immediate intervention call');
    recommendations.push('Review customer success plan');
    recommendations.push('Prepare retention offer');
  }

  // Medium-risk recommendations
  if (riskScore >= 60 && riskScore < 80) {
    recommendations.push('Increase engagement frequency');
    recommendations.push('Schedule success review');
    recommendations.push('Identify upsell opportunities');
  }

  // Low-risk recommendations
  if (riskScore < 60) {
    recommendations.push('Maintain regular check-ins');
    recommendations.push('Monitor engagement metrics');
    recommendations.push('Plan next success milestone');
  }

  // Add insight-based recommendations
  insights.forEach((insight) => {
    recommendations.push(insight.recommendation);
  });

  return [...new Set(recommendations)]; // Remove duplicates
} 