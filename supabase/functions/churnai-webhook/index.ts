import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookEvent {
  type: string;
  customerId: string;
  timestamp: string;
  data: any;
}

interface WebhookResult {
  success: boolean;
  message: string;
  actions: {
    type: string;
    description: string;
    status: 'triggered' | 'skipped' | 'failed';
  }[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const event = await req.json() as WebhookEvent;

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const actions: WebhookResult['actions'] = [];

    // Process the event based on its type
    switch (event.type) {
      case 'customer.created':
        await handleCustomerCreated(supabaseClient, event, actions);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(supabaseClient, event, actions);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(supabaseClient, event, actions);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(supabaseClient, event, actions);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabaseClient, event, actions);
        break;

      case 'support.ticket.created':
        await handleSupportTicketCreated(supabaseClient, event, actions);
        break;

      case 'feature.usage':
        await handleFeatureUsage(supabaseClient, event, actions);
        break;

      default:
        actions.push({
          type: 'unknown_event',
          description: `Unhandled event type: ${event.type}`,
          status: 'skipped',
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        actions,
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

async function handleCustomerCreated(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Create customer record
  const { error: customerError } = await supabaseClient
    .from('customers')
    .insert([{
      id: event.customerId,
      created_at: event.timestamp,
      updated_at: event.timestamp,
      ...event.data,
    }]);

  if (customerError) {
    actions.push({
      type: 'customer_creation',
      description: 'Failed to create customer record',
      status: 'failed',
    });
    throw customerError;
  }

  actions.push({
    type: 'customer_creation',
    description: 'Customer record created successfully',
    status: 'triggered',
  });
}

async function handleCustomerUpdated(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Update customer record
  const { error: updateError } = await supabaseClient
    .from('customers')
    .update({
      ...event.data,
      updated_at: event.timestamp,
    })
    .eq('id', event.customerId);

  if (updateError) {
    actions.push({
      type: 'customer_update',
      description: 'Failed to update customer record',
      status: 'failed',
    });
    throw updateError;
  }

  actions.push({
    type: 'customer_update',
    description: 'Customer record updated successfully',
    status: 'triggered',
  });
}

async function handleSubscriptionCreated(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Create subscription record
  const { error: subscriptionError } = await supabaseClient
    .from('subscriptions')
    .insert([{
      customer_id: event.customerId,
      created_at: event.timestamp,
      updated_at: event.timestamp,
      ...event.data,
    }]);

  if (subscriptionError) {
    actions.push({
      type: 'subscription_creation',
      description: 'Failed to create subscription record',
      status: 'failed',
    });
    throw subscriptionError;
  }

  // Trigger welcome intervention
  await triggerWelcomeIntervention(supabaseClient, event.customerId, actions);

  actions.push({
    type: 'subscription_creation',
    description: 'Subscription record created successfully',
    status: 'triggered',
  });
}

async function handleSubscriptionUpdated(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Update subscription record
  const { error: updateError } = await supabaseClient
    .from('subscriptions')
    .update({
      ...event.data,
      updated_at: event.timestamp,
    })
    .eq('customer_id', event.customerId);

  if (updateError) {
    actions.push({
      type: 'subscription_update',
      description: 'Failed to update subscription record',
      status: 'failed',
    });
    throw updateError;
  }

  // Check if plan changed
  if (event.data.plan_id) {
    await triggerPlanChangeIntervention(supabaseClient, event.customerId, actions);
  }

  actions.push({
    type: 'subscription_update',
    description: 'Subscription record updated successfully',
    status: 'triggered',
  });
}

async function handleSubscriptionCancelled(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Update subscription record
  const { error: updateError } = await supabaseClient
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: event.timestamp,
      updated_at: event.timestamp,
    })
    .eq('customer_id', event.customerId);

  if (updateError) {
    actions.push({
      type: 'subscription_cancellation',
      description: 'Failed to update subscription record',
      status: 'failed',
    });
    throw updateError;
  }

  // Trigger retention intervention
  await triggerRetentionIntervention(supabaseClient, event.customerId, actions);

  actions.push({
    type: 'subscription_cancellation',
    description: 'Subscription record updated successfully',
    status: 'triggered',
  });
}

async function handleSupportTicketCreated(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Create support ticket record
  const { error: ticketError } = await supabaseClient
    .from('support_tickets')
    .insert([{
      customer_id: event.customerId,
      created_at: event.timestamp,
      updated_at: event.timestamp,
      ...event.data,
    }]);

  if (ticketError) {
    actions.push({
      type: 'support_ticket_creation',
      description: 'Failed to create support ticket record',
      status: 'failed',
    });
    throw ticketError;
  }

  // Check if intervention needed
  await checkSupportIntervention(supabaseClient, event.customerId, actions);

  actions.push({
    type: 'support_ticket_creation',
    description: 'Support ticket record created successfully',
    status: 'triggered',
  });
}

async function handleFeatureUsage(
  supabaseClient: any,
  event: WebhookEvent,
  actions: WebhookResult['actions']
) {
  // Create feature usage record
  const { error: usageError } = await supabaseClient
    .from('feature_usage')
    .insert([{
      customer_id: event.customerId,
      timestamp: event.timestamp,
      ...event.data,
    }]);

  if (usageError) {
    actions.push({
      type: 'feature_usage',
      description: 'Failed to create feature usage record',
      status: 'failed',
    });
    throw usageError;
  }

  // Check if intervention needed
  await checkFeatureUsageIntervention(supabaseClient, event.customerId, actions);

  actions.push({
    type: 'feature_usage',
    description: 'Feature usage record created successfully',
    status: 'triggered',
  });
}

async function triggerWelcomeIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  try {
    const { error: interventionError } = await supabaseClient
      .from('intervention_plans')
      .insert([{
        customer_id: customerId,
        type: 'proactive',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        steps: [
          {
            id: `welcome-${Date.now()}-1`,
            title: 'Welcome Call',
            description: 'Schedule a welcome call to introduce key features and set expectations',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'customer_success',
            notes: [],
          },
          {
            id: `welcome-${Date.now()}-2`,
            title: 'Feature Onboarding',
            description: 'Provide guided tour of key features and best practices',
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'product_success',
            notes: [],
          },
        ],
      }]);

    if (interventionError) throw interventionError;

    actions.push({
      type: 'welcome_intervention',
      description: 'Welcome intervention plan created successfully',
      status: 'triggered',
    });
  } catch (error) {
    actions.push({
      type: 'welcome_intervention',
      description: 'Failed to create welcome intervention plan',
      status: 'failed',
    });
  }
}

async function triggerPlanChangeIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  try {
    const { error: interventionError } = await supabaseClient
      .from('intervention_plans')
      .insert([{
        customer_id: customerId,
        type: 'proactive',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        steps: [
          {
            id: `plan-change-${Date.now()}-1`,
            title: 'Plan Change Review',
            description: 'Schedule a call to review plan changes and ensure smooth transition',
            status: 'pending',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'customer_success',
            notes: [],
          },
        ],
      }]);

    if (interventionError) throw interventionError;

    actions.push({
      type: 'plan_change_intervention',
      description: 'Plan change intervention plan created successfully',
      status: 'triggered',
    });
  } catch (error) {
    actions.push({
      type: 'plan_change_intervention',
      description: 'Failed to create plan change intervention plan',
      status: 'failed',
    });
  }
}

async function triggerRetentionIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  try {
    const { error: interventionError } = await supabaseClient
      .from('intervention_plans')
      .insert([{
        customer_id: customerId,
        type: 'reactive',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        steps: [
          {
            id: `retention-${Date.now()}-1`,
            title: 'Retention Call',
            description: 'Schedule an immediate call to understand cancellation reasons and offer retention options',
            status: 'pending',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'customer_success',
            notes: [],
          },
          {
            id: `retention-${Date.now()}-2`,
            title: 'Retention Offer Review',
            description: 'Review and prepare retention offers based on customer value',
            status: 'pending',
            dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'sales',
            notes: [],
          },
        ],
      }]);

    if (interventionError) throw interventionError;

    actions.push({
      type: 'retention_intervention',
      description: 'Retention intervention plan created successfully',
      status: 'triggered',
    });
  } catch (error) {
    actions.push({
      type: 'retention_intervention',
      description: 'Failed to create retention intervention plan',
      status: 'failed',
    });
  }
}

async function checkSupportIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  // Get recent support tickets
  const { data: tickets, error: ticketsError } = await supabaseClient
    .from('support_tickets')
    .select('*')
    .eq('customer_id', customerId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (ticketsError) {
    actions.push({
      type: 'support_intervention_check',
      description: 'Failed to check support intervention need',
      status: 'failed',
    });
    return;
  }

  // Check if intervention needed
  if (tickets.length >= 5) {
    await triggerSupportIntervention(supabaseClient, customerId, actions);
  }
}

async function checkFeatureUsageIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  // Get recent feature usage
  const { data: usage, error: usageError } = await supabaseClient
    .from('feature_usage')
    .select('*')
    .eq('customer_id', customerId)
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (usageError) {
    actions.push({
      type: 'feature_usage_intervention_check',
      description: 'Failed to check feature usage intervention need',
      status: 'failed',
    });
    return;
  }

  // Check if intervention needed
  const uniqueFeatures = new Set(usage.map((u) => u.feature_id)).size;
  if (uniqueFeatures < 3) {
    await triggerFeatureUsageIntervention(supabaseClient, customerId, actions);
  }
}

async function triggerSupportIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  try {
    const { error: interventionError } = await supabaseClient
      .from('intervention_plans')
      .insert([{
        customer_id: customerId,
        type: 'reactive',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        steps: [
          {
            id: `support-${Date.now()}-1`,
            title: 'Support Review Call',
            description: 'Schedule a call to review support issues and provide solutions',
            status: 'pending',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'customer_success',
            notes: [],
          },
        ],
      }]);

    if (interventionError) throw interventionError;

    actions.push({
      type: 'support_intervention',
      description: 'Support intervention plan created successfully',
      status: 'triggered',
    });
  } catch (error) {
    actions.push({
      type: 'support_intervention',
      description: 'Failed to create support intervention plan',
      status: 'failed',
    });
  }
}

async function triggerFeatureUsageIntervention(
  supabaseClient: any,
  customerId: string,
  actions: WebhookResult['actions']
) {
  try {
    const { error: interventionError } = await supabaseClient
      .from('intervention_plans')
      .insert([{
        customer_id: customerId,
        type: 'proactive',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        steps: [
          {
            id: `feature-${Date.now()}-1`,
            title: 'Feature Adoption Review',
            description: 'Schedule a call to review feature adoption and provide guidance',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: 'product_success',
            notes: [],
          },
        ],
      }]);

    if (interventionError) throw interventionError;

    actions.push({
      type: 'feature_usage_intervention',
      description: 'Feature usage intervention plan created successfully',
      status: 'triggered',
    });
  } catch (error) {
    actions.push({
      type: 'feature_usage_intervention',
      description: 'Failed to create feature usage intervention plan',
      status: 'failed',
    });
  }
} 