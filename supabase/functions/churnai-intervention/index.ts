import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  customerId: string;
  interventionType?: 'proactive' | 'reactive';
}

interface InterventionResult {
  plan: {
    id: string;
    type: 'proactive' | 'reactive';
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    customerId: string;
    createdAt: string;
    updatedAt: string;
    steps: {
      id: string;
      title: string;
      description: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      dueDate: string;
      assignedTo: string;
      notes: string[];
    }[];
    metrics: {
      target: {
        engagement: number;
        featureUsage: number;
        satisfaction: number;
      };
      current: {
        engagement: number;
        featureUsage: number;
        satisfaction: number;
      };
    };
  };
  success: boolean;
  message: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, customerId, interventionType = 'proactive' } = await req.json() as RequestBody;

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

    // Generate intervention plan
    const plan = generateInterventionPlan(customer, activities, subscription, interventionType);

    // Save intervention plan
    const { data: savedPlan, error: saveError } = await supabaseClient
      .from('intervention_plans')
      .insert([{
        customer_id: customerId,
        type: interventionType,
        status: 'draft',
        steps: plan.steps,
        metrics: plan.metrics,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({
        plan: savedPlan,
        success: true,
        message: 'Intervention plan created successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function generateInterventionPlan(
  customer: any,
  activities: any[],
  subscription: any,
  type: 'proactive' | 'reactive'
): {
  steps: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    dueDate: string;
    assignedTo: string;
    notes: string[];
  }[];
  metrics: {
    target: {
      engagement: number;
      featureUsage: number;
      satisfaction: number;
    };
    current: {
      engagement: number;
      featureUsage: number;
      satisfaction: number;
    };
  };
} {
  const steps = [];
  const currentMetrics = calculateCurrentMetrics(activities);

  // Generate steps based on intervention type
  if (type === 'proactive') {
    steps.push(...generateProactiveSteps(currentMetrics));
  } else {
    steps.push(...generateReactiveSteps(currentMetrics));
  }

  // Set target metrics
  const targetMetrics = {
    engagement: Math.min(100, currentMetrics.engagement * 1.2),
    featureUsage: Math.min(100, currentMetrics.featureUsage * 1.3),
    satisfaction: Math.min(100, currentMetrics.satisfaction * 1.1),
  };

  return {
    steps,
    metrics: {
      target: targetMetrics,
      current: currentMetrics,
    },
  };
}

function calculateCurrentMetrics(activities: any[]): {
  engagement: number;
  featureUsage: number;
  satisfaction: number;
} {
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  // Calculate engagement score
  const engagement = calculateEngagementScore(recentActivities);

  // Calculate feature usage score
  const featureUsage = calculateFeatureUsageScore(recentActivities);

  // Calculate satisfaction score
  const satisfaction = calculateSatisfactionScore(recentActivities);

  return {
    engagement,
    featureUsage,
    satisfaction,
  };
}

function calculateEngagementScore(activities: any[]): number {
  if (activities.length === 0) return 0;

  const activityFrequency = activities.length / 30;
  const uniqueFeatures = new Set(activities.map((a) => a.feature_id)).size;

  return Math.min(100, (activityFrequency * 50) + (uniqueFeatures * 10));
}

function calculateFeatureUsageScore(activities: any[]): number {
  const featureUsage = activities.filter((a) => a.type === 'feature_use');
  const uniqueFeatures = new Set(featureUsage.map((a) => a.feature_id));

  return Math.min(100, uniqueFeatures.size * 20);
}

function calculateSatisfactionScore(activities: any[]): number {
  const supportTickets = activities.filter((a) => a.type === 'support_ticket');
  const positiveFeedback = activities.filter((a) => a.type === 'feedback' && a.sentiment === 'positive');

  const ticketScore = Math.max(0, 100 - (supportTickets.length * 10));
  const feedbackScore = Math.min(100, positiveFeedback.length * 20);

  return Math.round((ticketScore + feedbackScore) / 2);
}

function generateProactiveSteps(currentMetrics: {
  engagement: number;
  featureUsage: number;
  satisfaction: number;
}): {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dueDate: string;
  assignedTo: string;
  notes: string[];
}[] {
  const steps = [];
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  // Add engagement improvement steps
  if (currentMetrics.engagement < 70) {
    steps.push({
      id: `step-${Date.now()}-1`,
      title: 'Schedule Engagement Review',
      description: 'Schedule a call to review customer engagement and identify improvement opportunities',
      status: 'pending',
      dueDate,
      assignedTo: 'customer_success',
      notes: [],
    });
  }

  // Add feature adoption steps
  if (currentMetrics.featureUsage < 60) {
    steps.push({
      id: `step-${Date.now()}-2`,
      title: 'Feature Adoption Workshop',
      description: 'Organize a workshop to demonstrate key features and their benefits',
      status: 'pending',
      dueDate,
      assignedTo: 'product_success',
      notes: [],
    });
  }

  // Add satisfaction improvement steps
  if (currentMetrics.satisfaction < 80) {
    steps.push({
      id: `step-${Date.now()}-3`,
      title: 'Customer Satisfaction Survey',
      description: 'Send a detailed satisfaction survey to gather feedback and identify areas for improvement',
      status: 'pending',
      dueDate,
      assignedTo: 'customer_success',
      notes: [],
    });
  }

  return steps;
}

function generateReactiveSteps(currentMetrics: {
  engagement: number;
  featureUsage: number;
  satisfaction: number;
}): {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dueDate: string;
  assignedTo: string;
  notes: string[];
}[] {
  const steps = [];
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  // Add immediate action steps
  steps.push({
    id: `step-${Date.now()}-1`,
    title: 'Emergency Response Call',
    description: 'Schedule an immediate call to address customer concerns and prevent churn',
    status: 'pending',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'customer_success',
    notes: [],
  });

  // Add retention steps
  steps.push({
    id: `step-${Date.now()}-2`,
    title: 'Retention Offer Review',
    description: 'Review and prepare retention offers based on customer value and history',
    status: 'pending',
    dueDate,
    assignedTo: 'sales',
    notes: [],
  });

  // Add feedback collection steps
  steps.push({
    id: `step-${Date.now()}-3`,
    title: 'Detailed Feedback Collection',
    description: 'Conduct in-depth interviews to understand customer pain points and concerns',
    status: 'pending',
    dueDate,
    assignedTo: 'customer_success',
    notes: [],
  });

  return steps;
} 