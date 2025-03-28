import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  interventionId: string;
  stepId?: string;
  status?: 'completed' | 'failed';
  notes?: string;
}

interface TrackingResult {
  success: boolean;
  message: string;
  metrics: {
    current: {
      engagement: number;
      featureUsage: number;
      satisfaction: number;
    };
    target: {
      engagement: number;
      featureUsage: number;
      satisfaction: number;
    };
    progress: {
      engagement: number;
      featureUsage: number;
      satisfaction: number;
    };
  };
  steps: {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    notes: string[];
  }[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, interventionId, stepId, status, notes } = await req.json() as RequestBody;

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get intervention plan
    const { data: intervention, error: interventionError } = await supabaseClient
      .from('intervention_plans')
      .select('*')
      .eq('id', interventionId)
      .single();

    if (interventionError) throw interventionError;

    // Get customer activities
    const { data: activities, error: activitiesError } = await supabaseClient
      .from('customer_activities')
      .select('*')
      .eq('customer_id', intervention.customer_id)
      .order('timestamp', { ascending: true });

    if (activitiesError) throw activitiesError;

    // Update step status if provided
    if (stepId && status) {
      const updatedSteps = intervention.steps.map((step: any) => {
        if (step.id === stepId) {
          return {
            ...step,
            status,
            notes: notes ? [...(step.notes || []), notes] : step.notes,
          };
        }
        return step;
      });

      const { error: updateError } = await supabaseClient
        .from('intervention_plans')
        .update({
          steps: updatedSteps,
          updated_at: new Date().toISOString(),
        })
        .eq('id', interventionId);

      if (updateError) throw updateError;
    }

    // Calculate current metrics
    const currentMetrics = calculateCurrentMetrics(activities);

    // Calculate progress
    const progress = calculateProgress(currentMetrics, intervention.metrics.target);

    // Update intervention metrics
    const { error: metricsError } = await supabaseClient
      .from('intervention_plans')
      .update({
        metrics: {
          ...intervention.metrics,
          current: currentMetrics,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', interventionId);

    if (metricsError) throw metricsError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Intervention tracking updated successfully',
        metrics: {
          current: currentMetrics,
          target: intervention.metrics.target,
          progress,
        },
        steps: intervention.steps,
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

function calculateProgress(
  current: { engagement: number; featureUsage: number; satisfaction: number },
  target: { engagement: number; featureUsage: number; satisfaction: number }
): {
  engagement: number;
  featureUsage: number;
  satisfaction: number;
} {
  return {
    engagement: calculateMetricProgress(current.engagement, target.engagement),
    featureUsage: calculateMetricProgress(current.featureUsage, target.featureUsage),
    satisfaction: calculateMetricProgress(current.satisfaction, target.satisfaction),
  };
}

function calculateMetricProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
} 